"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib";
import {
  CHECKOUT_PAYMENT_COPY,
  CheckoutPaymentFeedbackKind,
  CheckoutPaymentInitializationState,
  getCheckoutPaymentButtonLabel,
  HOSTED_FIELD_DEFINITIONS,
  PAYPAL_PRIVACY_NOTICE,
} from "@/constants";
import { getHostedFieldSlotClassName } from "@/utils/client";
import { checkoutPaymentStyles } from "./checkout-payment.styles";
import type {
  CheckoutPaymentHandle,
  CheckoutPaymentProps,
} from "./checkout-payment.types";
import { HostedFieldSlot } from "./hosted-field-slot";
import { useCheckoutHostedFields } from "./use-checkout-hosted-fields";

export const CheckoutPayment = forwardRef<
  CheckoutPaymentHandle,
  CheckoutPaymentProps
>(function CheckoutPayment(props, ref) {
  const [hostedFieldsKey, setHostedFieldsKey] = useState(0);

  return (
    <CheckoutPaymentContent
      key={hostedFieldsKey}
      ref={ref}
      onRetryInitialization={() => setHostedFieldsKey((value) => value + 1)}
      {...props}
    />
  );
});

const CheckoutPaymentContent = forwardRef<
  CheckoutPaymentHandle,
  CheckoutPaymentProps & { onRetryInitialization: () => void }
>(function CheckoutPaymentContent(
  {
    feedback,
    formId,
    isLocked,
    isPaymentValid,
    isSubmitting,
    onReadyChange,
    onResetAttempt,
    onRetryAttempt,
    onRetryInitialization,
    onValidityChange,
  },
  ref,
) {
  const {
    clear,
    initializationState,
    invalidFieldNames,
    isReady,
    tokenize,
  } = useCheckoutHostedFields({
    formId,
    isLocked,
    isSubmitting,
    onReadyChange,
    onValidityChange,
  });

  useImperativeHandle(ref, () => ({
    clear,
    tokenize,
  }));

  const isButtonDisabled =
    !isReady ||
    !isPaymentValid ||
    isSubmitting ||
    isLocked ||
    feedback?.kind === CheckoutPaymentFeedbackKind.Success;
  const buttonLabel = getCheckoutPaymentButtonLabel({
    feedbackKind: feedback?.kind,
    isPaymentValid,
    isReady,
    isSubmitting,
  });
  const isFieldsDisabled = !isReady || isSubmitting || isLocked;

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
        aria-busy={initializationState === CheckoutPaymentInitializationState.Loading}
      >
        <p className={checkoutPaymentStyles.notice}>
          {PAYPAL_PRIVACY_NOTICE.intro}{" "}
          <a
            href={PAYPAL_PRIVACY_NOTICE.linkHref}
            target='_blank'
            rel='noreferrer'
          >
            {PAYPAL_PRIVACY_NOTICE.linkLabel}
          </a>
          .
        </p>

        {initializationState === CheckoutPaymentInitializationState.Loading && (
          <p className={checkoutPaymentStyles.status} role='status'>
            {CHECKOUT_PAYMENT_COPY.loadingFields}
          </p>
        )}

        {initializationState === CheckoutPaymentInitializationState.Error && (
          <FieldGroup>
            <Field>
              <p className={checkoutPaymentStyles.error} role='alert'>
                {CHECKOUT_PAYMENT_COPY.initializationError}
              </p>
              <Button
                type='button'
                variant='outline'
                className={checkoutPaymentStyles.retry}
                onClick={onRetryInitialization}
              >
                {CHECKOUT_PAYMENT_COPY.retryFields}
              </Button>
            </Field>
          </FieldGroup>
        )}

        {initializationState !== CheckoutPaymentInitializationState.Error && (
          <FieldGroup
            className={cn(
              checkoutPaymentStyles.fields,
              initializationState === CheckoutPaymentInitializationState.Loading &&
                checkoutPaymentStyles.fieldsLoading,
            )}
            aria-hidden={
              initializationState === CheckoutPaymentInitializationState.Loading ||
              undefined
            }
            inert={
              initializationState === CheckoutPaymentInitializationState.Loading ||
              undefined
            }
          >
            {HOSTED_FIELD_DEFINITIONS.map(
              ({
                description,
                errorId,
                fieldId,
                fieldName,
                isNumberField,
                label,
              }) => (
                <HostedFieldSlot
                  key={fieldName}
                  className={getHostedFieldSlotClassName(isNumberField)}
                  description={description}
                  errorId={errorId}
                  fieldId={fieldId}
                  fieldName={fieldName}
                  isDisabled={isFieldsDisabled}
                  isInvalid={invalidFieldNames.includes(fieldName)}
                  label={label}
                />
              ),
            )}
          </FieldGroup>
        )}

        {feedback?.kind === CheckoutPaymentFeedbackKind.Success && (
          <div className={checkoutPaymentStyles.feedback} role='status'>
            <Badge variant='secondary'>
              {CHECKOUT_PAYMENT_COPY.sandboxApproved}
            </Badge>
            <p>
              Simulated {feedback.amount} {feedback.currency} transaction with
              status “{feedback.status}”. No real funds were moved.
            </p>
            <p className={checkoutPaymentStyles.transactionId}>
              Transaction {feedback.transactionId}
            </p>
            <Button type='button' variant='outline' onClick={onResetAttempt}>
              {CHECKOUT_PAYMENT_COPY.startAnotherTest}
            </Button>
          </div>
        )}

        {feedback?.kind === CheckoutPaymentFeedbackKind.Error && (
          <p className={checkoutPaymentStyles.error} role='alert'>
            {feedback.message}
          </p>
        )}

        {feedback?.kind === CheckoutPaymentFeedbackKind.Unknown && (
          <div className={checkoutPaymentStyles.feedback}>
            <p className={checkoutPaymentStyles.error} role='alert'>
              {feedback.message}
            </p>
            <Button type='button' variant='outline' onClick={onRetryAttempt}>
              {CHECKOUT_PAYMENT_COPY.retryUnknownAttempt}
            </Button>
            <Button type='button' variant='ghost' onClick={onResetAttempt}>
              {CHECKOUT_PAYMENT_COPY.resetUnknownAttempt}
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
          {CHECKOUT_PAYMENT_COPY.footerExplanation}
        </p>
      </CardFooter>
    </Card>
  );
});
