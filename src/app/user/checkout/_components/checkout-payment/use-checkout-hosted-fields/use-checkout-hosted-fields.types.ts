export type UseCheckoutHostedFieldsParams = {
  formId: string;
  isLocked: boolean;
  isSubmitting: boolean;
  onReadyChange: (isReady: boolean) => void;
  onValidityChange: (isValid: boolean) => void;
};
