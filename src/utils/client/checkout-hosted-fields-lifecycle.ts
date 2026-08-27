import "client-only";

import type { Client } from "braintree-web/client";
import type { HostedFields } from "braintree-web/hosted-fields";
import { HOSTED_FIELD_DEFINITIONS, PAYMENT_FIELD_NAMES } from "@/constants";
import type {
  CheckoutHostedFieldsOptions,
  HostedFieldsSessionState,
} from "@/types/hosted-fields-session";
import {
  areAllHostedFieldsValid,
  getInvalidHostedFieldNames,
  syncHostedFieldValidationMessages,
} from "./checkout-hosted-fields";

type CheckoutPaymentFieldName = (typeof PAYMENT_FIELD_NAMES)[number];

export function createHostedFieldsSessionState(): HostedFieldsSessionState {
  return { client: null, hostedFields: null, tornDown: false };
}

export async function teardownHostedFieldsSession(
  session: HostedFieldsSessionState,
) {
  if (session.tornDown) {
    return;
  }

  session.tornDown = true;

  await session.hostedFields?.teardown().catch(() => undefined);
  await Promise.resolve(session.client?.teardown(() => undefined)).catch(
    () => undefined,
  );

  session.hostedFields = null;
  session.client = null;
}

function buildHostedFieldsOptions(client: Client): CheckoutHostedFieldsOptions {
  const inputColor = getComputedStyle(document.body).color;

  return {
    client,
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
    fields: Object.fromEntries(
      HOSTED_FIELD_DEFINITIONS.map(({ fieldName, fieldId, placeholder }) => [
        fieldName,
        {
          container: `#${fieldId}`,
          placeholder,
        },
      ]),
    ),
  };
}

export async function initializeHostedFieldsSession(
  session: HostedFieldsSessionState,
  clientToken: string,
) {
  const [clientSdk, hostedFieldsSdk] = await Promise.all([
    import("braintree-web/client"),
    import("braintree-web/hosted-fields"),
  ]);

  session.client = await clientSdk.create({ authorization: clientToken });
  session.hostedFields = await hostedFieldsSdk.create(
    buildHostedFieldsOptions(session.client),
  );

  return session.hostedFields;
}

type BindHostedFieldsEventsParams = {
  formId: string;
  hostedFields: HostedFields;
  onValidityChange: (isValid: boolean) => void;
  setInvalidFieldNames: (fieldNames: CheckoutPaymentFieldName[]) => void;
  touchedFields: Set<CheckoutPaymentFieldName>;
};

export function bindHostedFieldsEvents({
  formId,
  hostedFields,
  onValidityChange,
  setInvalidFieldNames,
  touchedFields,
}: BindHostedFieldsEventsParams) {
  let isDisposed = false;

  const updateValidity = (showAllErrors = false) => {
    if (isDisposed) {
      return;
    }

    const state = hostedFields.getState();

    if (!state) {
      onValidityChange(false);
      return;
    }

    const nextInvalidFieldNames = getInvalidHostedFieldNames(
      state,
      touchedFields,
      showAllErrors,
    );

    setInvalidFieldNames(nextInvalidFieldNames);
    syncHostedFieldValidationMessages(hostedFields, nextInvalidFieldNames);
    onValidityChange(areAllHostedFieldsValid(state));
  };

  hostedFields.on("validityChange", () => updateValidity());
  hostedFields.on("blur", (event) => {
    if (isDisposed) {
      return;
    }

    const fieldName = PAYMENT_FIELD_NAMES.find(
      (name) => name === event.emittedBy,
    );

    if (fieldName) {
      touchedFields.add(fieldName);
    }

    updateValidity();
  });
  hostedFields.on("inputSubmitRequest", () => {
    if (isDisposed) {
      return;
    }

    updateValidity(true);

    const form = document.getElementById(formId);

    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  });

  for (const fieldName of PAYMENT_FIELD_NAMES) {
    hostedFields.setAttribute(
      {
        field: fieldName,
        attribute: "aria-required",
        value: true,
      },
      () => undefined,
    );
  }

  return {
    dispose: () => {
      isDisposed = true;
    },
    updateValidity,
  };
}
