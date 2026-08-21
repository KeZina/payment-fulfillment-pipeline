"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Client } from "braintree-web/client";
import type { HostedFields } from "braintree-web/hosted-fields";
import * as v from "valibot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib";
import { BraintreeClientTokenResponseSchema } from "@/schemas";
import { checkoutPaymentStyles } from "./checkout-payment.styles";
import type {
  CheckoutHostedFieldsOptions,
  CheckoutPaymentHandle,
  CheckoutPaymentFieldName,
  CheckoutPaymentInitializationState,
  CheckoutPaymentProps,
} from "./checkout-payment.types";

const CARD_NUMBER_FIELD_ID = "braintree-card-number";
const EXPIRATION_DATE_FIELD_ID = "braintree-expiration-date";
const CVV_FIELD_ID = "braintree-cvv";
const POSTAL_CODE_FIELD_ID = "braintree-postal-code";
const CARD_NUMBER_ERROR_ID = "braintree-card-number-error";
const EXPIRATION_DATE_ERROR_ID = "braintree-expiration-date-error";
const CVV_ERROR_ID = "braintree-cvv-error";
const POSTAL_CODE_ERROR_ID = "braintree-postal-code-error";
const PAYMENT_FIELD_NAMES = [
  "number",
  "expirationDate",
  "cvv",
  "postalCode",
] as const satisfies readonly CheckoutPaymentFieldName[];
const PAYMENT_FIELD_ERROR_MESSAGES = {
  number: "Enter a valid Braintree Sandbox card number.",
  expirationDate: "Enter a valid future expiration date.",
  cvv: "Enter a valid CVV.",
  postalCode: "Enter a valid postal code.",
} as const;

function setHostedFieldsDisabledState(
  instance: HostedFields,
  isDisabled: boolean,
) {
  for (const fieldName of PAYMENT_FIELD_NAMES) {
    if (isDisabled) {
      instance.setAttribute(
        {
          field: fieldName,
          attribute: "disabled",
          value: true,
        },
        () => undefined,
      );
      continue;
    }

    instance.removeAttribute(
      {
        field: fieldName,
        attribute: "disabled",
      },
      () => undefined,
    );
  }
}

// TODO the file is way too big, split into smaller components and functions. logic has to be more explicit and descriptive
export const CheckoutPayment = forwardRef<
  CheckoutPaymentHandle,
  CheckoutPaymentProps
>(function CheckoutPayment(
  {
    feedback,
    formId,
    isLocked,
    isPaymentValid,
    isSubmitting,
    onReadyChange,
    onResetAttempt,
    onValidityChange,
  },
  ref,
) {
  const hostedFieldsRef = useRef<HostedFields | null>(null);
  const touchedFieldsRef = useRef(new Set<CheckoutPaymentFieldName>());
  const teardownPromiseRef = useRef<Promise<void>>(Promise.resolve());
  const isInteractionDisabledRef = useRef(isSubmitting || isLocked);
  const [initializationState, setInitializationState] =
    useState<CheckoutPaymentInitializationState>("loading");
  const [invalidFieldNames, setInvalidFieldNames] = useState<
    CheckoutPaymentFieldName[]
  >([]);
  const [retryKey, setRetryKey] = useState(0);

  const clear = useCallback(() => {
    const instance = hostedFieldsRef.current;

    if (!instance) {
      return;
    }

    touchedFieldsRef.current.clear();
    setInvalidFieldNames([]);

    for (const fieldName of PAYMENT_FIELD_NAMES) {
      try {
        instance.clear(fieldName, () => undefined);
        instance.setAttribute(
          {
            field: fieldName,
            attribute: "aria-invalid",
            value: false,
          },
          () => undefined,
        );
        instance.setMessage({ field: fieldName, message: "" });
      } catch {
        // Clearing is best effort after a completed or rejected sandbox test.
      }
    }

    onValidityChange(false);
  }, [onValidityChange]);

  useImperativeHandle(
    ref,
    () => ({
      clear,
      tokenize: async () => {
        const instance = hostedFieldsRef.current;

        if (!instance) {
          throw new Error("Braintree Hosted Fields are not ready.");
        }

        const payload = await instance.tokenize();

        return payload.nonce;
      },
    }),
    [clear],
  );

  useEffect(() => {
    let isCancelled = false;
    let hasTornDownClient = false;
    let hasTornDownHostedFields = false;
    let clientInstance: Client | null = null;
    let hostedFieldsInstance: HostedFields | null = null;
    const abortController = new AbortController();
    const previousTeardown = teardownPromiseRef.current;

    async function teardownClientInstance() {
      if (!clientInstance || hasTornDownClient) {
        return;
      }

      hasTornDownClient = true;
      await Promise.resolve(clientInstance.teardown(() => undefined)).catch(
        () => undefined,
      );
    }

    async function teardownHostedFieldsInstance() {
      if (!hostedFieldsInstance || hasTornDownHostedFields) {
        return;
      }

      hasTornDownHostedFields = true;
      await hostedFieldsInstance.teardown().catch(() => undefined);
    }

    async function teardownInstances() {
      await teardownHostedFieldsInstance();
      await teardownClientInstance();
    }

    setInitializationState("loading");
    touchedFieldsRef.current.clear();
    setInvalidFieldNames([]);
    onReadyChange(false);
    onValidityChange(false);

    async function initializeHostedFields() {
      try {
        await previousTeardown;

        if (isCancelled) {
          return;
        }

        const tokenResponse = await fetch("/api/braintree/client-token", {
          method: "POST",
          cache: "no-store",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
          signal: abortController.signal,
        });

        if (!tokenResponse.ok) {
          throw new Error("Braintree Sandbox client token request failed.");
        }

        const tokenBody: unknown = await tokenResponse.json();
        const parsedToken = v.safeParse(
          BraintreeClientTokenResponseSchema,
          tokenBody,
        );

        if (!parsedToken.success) {
          throw new Error("Braintree Sandbox client token is invalid.");
        }

        const [clientSdk, hostedFieldsSdk] = await Promise.all([
          import("braintree-web/client"),
          import("braintree-web/hosted-fields"),
        ]);

        clientInstance = await clientSdk.create({
          authorization: parsedToken.output.clientToken,
        });

        if (isCancelled) {
          await teardownClientInstance();
          return;
        }

        const inputColor = getComputedStyle(document.body).color;
        const hostedFieldsOptions: CheckoutHostedFieldsOptions = {
          client: clientInstance,
          preventAutofill: true,
          styles: {
            input: {
              color: inputColor,
              "font-family": "system-ui, sans-serif",
              "font-size": "14px",
            },
            "@media screen and (max-width: 767px)": {
              input: { "font-size": "16px" },
            },
          },
          fields: {
            number: {
              container: `#${CARD_NUMBER_FIELD_ID}`,
              placeholder: "Card number",
            },
            expirationDate: {
              container: `#${EXPIRATION_DATE_FIELD_ID}`,
              placeholder: "MM / YY",
            },
            cvv: {
              container: `#${CVV_FIELD_ID}`,
              placeholder: "CVV",
            },
            postalCode: {
              container: `#${POSTAL_CODE_FIELD_ID}`,
              placeholder: "Postal code",
            },
          },
        };

        hostedFieldsInstance = await hostedFieldsSdk.create(
          hostedFieldsOptions,
        );

        if (isCancelled) {
          await teardownInstances();
          return;
        }

        hostedFieldsRef.current = hostedFieldsInstance;

        const updateValidity = (showAllErrors = false) => {
          const state = hostedFieldsInstance?.getState();

          if (!state) {
            onValidityChange(false);
            return;
          }

          const nextInvalidFieldNames = PAYMENT_FIELD_NAMES.filter(
            (fieldName) => {
              const field = state.fields[fieldName];

              return (
                !field.isValid &&
                (showAllErrors ||
                  touchedFieldsRef.current.has(fieldName) ||
                  !field.isPotentiallyValid)
              );
            },
          );

          setInvalidFieldNames(nextInvalidFieldNames);

          for (const fieldName of PAYMENT_FIELD_NAMES) {
            const isInvalid = nextInvalidFieldNames.includes(fieldName);

            try {
              hostedFieldsInstance?.setAttribute(
                {
                  field: fieldName,
                  attribute: "aria-invalid",
                  value: isInvalid,
                },
                () => undefined,
              );
              hostedFieldsInstance?.setMessage({
                field: fieldName,
                message: isInvalid
                  ? PAYMENT_FIELD_ERROR_MESSAGES[fieldName]
                  : "",
              });
            } catch {
              // Visible field errors remain available if iframe messaging fails.
            }
          }

          onValidityChange(
            PAYMENT_FIELD_NAMES.every(
              (fieldName) => state.fields[fieldName].isValid,
            ),
          );
        };

        hostedFieldsInstance.on("validityChange", () => updateValidity());
        hostedFieldsInstance.on("blur", (event) => {
          const touchedFieldName = PAYMENT_FIELD_NAMES.find(
            (fieldName) => fieldName === event.emittedBy,
          );

          if (touchedFieldName) {
            touchedFieldsRef.current.add(touchedFieldName);
          }

          updateValidity();
        });
        hostedFieldsInstance.on("inputSubmitRequest", () => {
          updateValidity(true);

          const form = document.getElementById(formId);

          if (form instanceof HTMLFormElement) {
            form.requestSubmit();
          }
        });

        for (const fieldName of PAYMENT_FIELD_NAMES) {
          hostedFieldsInstance.setAttribute(
            {
              field: fieldName,
              attribute: "aria-required",
              value: true,
            },
            () => undefined,
          );
        }

        setHostedFieldsDisabledState(
          hostedFieldsInstance,
          isInteractionDisabledRef.current,
        );

        updateValidity();
        setInitializationState("ready");
        onReadyChange(true);
      } catch {
        await teardownInstances();

        if (!isCancelled) {
          hostedFieldsRef.current = null;
          setInitializationState("error");
          onReadyChange(false);
          onValidityChange(false);
        }
      }
    }

    void initializeHostedFields();

    return () => {
      isCancelled = true;
      abortController.abort();
      hostedFieldsRef.current = null;
      onReadyChange(false);
      onValidityChange(false);
      teardownPromiseRef.current = teardownInstances();
    };
  }, [formId, onReadyChange, onValidityChange, retryKey]);

  useEffect(() => {
    const instance = hostedFieldsRef.current;
    const isInteractionDisabled = isSubmitting || isLocked;

    isInteractionDisabledRef.current = isInteractionDisabled;

    if (!instance) {
      return;
    }

    setHostedFieldsDisabledState(instance, isInteractionDisabled);
  }, [isLocked, isSubmitting]);

  const isReady = initializationState === "ready";
  const isButtonDisabled =
    !isReady ||
    !isPaymentValid ||
    isSubmitting ||
    isLocked ||
    feedback?.kind === "success";

  let buttonLabel = "Submit sandbox transaction";

  if (isSubmitting) {
    buttonLabel = "Processing sandbox transaction…";
  } else if (feedback?.kind === "success") {
    buttonLabel = "Sandbox transaction complete";
  } else if (feedback?.kind === "unknown") {
    buttonLabel = "Review sandbox status";
  } else if (!isReady) {
    buttonLabel = "Loading secure payment fields…";
  } else if (!isPaymentValid) {
    buttonLabel = "Enter sandbox card details";
  }

  return (
    <Card id='payment'>
      <CardHeader>
        <CardTitle id='payment-heading' role='heading' aria-level={2}>
          Payment
        </CardTitle>
        <CardDescription>
          Card details stay inside secure fields hosted by Braintree.
        </CardDescription>
        <CardAction>
          <Badge variant='secondary'>Braintree Sandbox</Badge>
        </CardAction>
      </CardHeader>
      <CardContent
        className={checkoutPaymentStyles.content}
        aria-labelledby='payment-heading'
        aria-busy={initializationState === "loading"}
      >
        <p className={checkoutPaymentStyles.notice}>
          PayPal acts as an independent controller for payment processing. It
          may collect payment and identifying information to operate and
          improve services for us and others, detect fraud, prevent harm or
          loss, authenticate users, analyze performance, and comply with law.
          PayPal handles this data under its{" "}
          <a
            href='https://www.paypal.com/us/legalhub/privacy-full'
            target='_blank'
            rel='noreferrer'
          >
            PayPal Privacy Statement
          </a>
          .
        </p>

        {initializationState === "loading" && (
          <p className={checkoutPaymentStyles.status} role='status'>
            Loading secure Braintree fields…
          </p>
        )}

        {initializationState === "error" && (
          <FieldGroup>
            <Field>
              <p className={checkoutPaymentStyles.error} role='alert'>
                Braintree Sandbox could not initialize. Check the server
                configuration and try again.
              </p>
              <Button
                type='button'
                variant='outline'
                className={checkoutPaymentStyles.retry}
                onClick={() => setRetryKey((value) => value + 1)}
              >
                Retry secure fields
              </Button>
            </Field>
          </FieldGroup>
        )}

        {initializationState !== "error" && (
          <FieldGroup
            className={cn(
              checkoutPaymentStyles.fields,
              initializationState === "loading" &&
                checkoutPaymentStyles.fieldsLoading,
            )}
            aria-hidden={initializationState === "loading" || undefined}
            inert={initializationState === "loading" || undefined}
          >
            <Field
              className={checkoutPaymentStyles.numberField}
              data-disabled={!isReady || isSubmitting || isLocked}
              data-invalid={invalidFieldNames.includes("number")}
            >
              <FieldLabel htmlFor={CARD_NUMBER_FIELD_ID}>Card number</FieldLabel>
              <div
                id={CARD_NUMBER_FIELD_ID}
                className={checkoutPaymentStyles.hostedField}
              />
              <FieldDescription>
                Use a Braintree Sandbox test card only.
              </FieldDescription>
              {invalidFieldNames.includes("number") && (
                <FieldError id={CARD_NUMBER_ERROR_ID}>
                  {PAYMENT_FIELD_ERROR_MESSAGES.number}
                </FieldError>
              )}
            </Field>
            <Field
              data-disabled={!isReady || isSubmitting || isLocked}
              data-invalid={invalidFieldNames.includes("expirationDate")}
            >
              <FieldLabel htmlFor={EXPIRATION_DATE_FIELD_ID}>
                Expiration date
              </FieldLabel>
              <div
                id={EXPIRATION_DATE_FIELD_ID}
                className={checkoutPaymentStyles.hostedField}
              />
              {invalidFieldNames.includes("expirationDate") && (
                <FieldError id={EXPIRATION_DATE_ERROR_ID}>
                  {PAYMENT_FIELD_ERROR_MESSAGES.expirationDate}
                </FieldError>
              )}
            </Field>
            <Field
              data-disabled={!isReady || isSubmitting || isLocked}
              data-invalid={invalidFieldNames.includes("cvv")}
            >
              <FieldLabel htmlFor={CVV_FIELD_ID}>CVV</FieldLabel>
              <div
                id={CVV_FIELD_ID}
                className={checkoutPaymentStyles.hostedField}
              />
              {invalidFieldNames.includes("cvv") && (
                <FieldError id={CVV_ERROR_ID}>
                  {PAYMENT_FIELD_ERROR_MESSAGES.cvv}
                </FieldError>
              )}
            </Field>
            <Field
              data-disabled={!isReady || isSubmitting || isLocked}
              data-invalid={invalidFieldNames.includes("postalCode")}
            >
              <FieldLabel htmlFor={POSTAL_CODE_FIELD_ID}>
                Postal code
              </FieldLabel>
              <div
                id={POSTAL_CODE_FIELD_ID}
                className={checkoutPaymentStyles.hostedField}
              />
              {invalidFieldNames.includes("postalCode") && (
                <FieldError id={POSTAL_CODE_ERROR_ID}>
                  {PAYMENT_FIELD_ERROR_MESSAGES.postalCode}
                </FieldError>
              )}
            </Field>
          </FieldGroup>
        )}

        {feedback?.kind === "success" && (
          <div className={checkoutPaymentStyles.feedback} role='status'>
            <Badge variant='secondary'>Sandbox approved</Badge>
            <p>
              Simulated {feedback.amount} {feedback.currency} transaction with
              status “{feedback.status}”. No real funds were moved.
            </p>
            <p className={checkoutPaymentStyles.transactionId}>
              Transaction {feedback.transactionId}
            </p>
            <Button type='button' variant='outline' onClick={onResetAttempt}>
              Start another sandbox test
            </Button>
          </div>
        )}

        {feedback?.kind === "error" && (
          <p className={checkoutPaymentStyles.error} role='alert'>
            {feedback.message}
          </p>
        )}

        {feedback?.kind === "unknown" && (
          <div className={checkoutPaymentStyles.feedback}>
            <p className={checkoutPaymentStyles.error} role='alert'>
              {feedback.message}
            </p>
            <Button type='button' variant='outline' onClick={onResetAttempt}>
              I checked — start a new sandbox test
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className={checkoutPaymentStyles.footer}>
        <Button
          type='submit'
          form={formId}
          size='lg'
          className={checkoutPaymentStyles.button}
          disabled={isButtonDisabled}
          aria-busy={isSubmitting}
        >
          {isSubmitting && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className='animate-spin'
              data-icon='inline-start'
              aria-hidden='true'
            />
          )}
          {buttonLabel}
        </Button>
        <p className={checkoutPaymentStyles.explanation}>
          This creates a simulated Sandbox transaction only. No real money can
          be charged. Use a USD Sandbox merchant account to match the displayed
          prices.
        </p>
      </CardFooter>
    </Card>
  );
});
