export const CHECKOUT_FORM_COPY = {
  unknownStatus:
    "The sandbox result could not be confirmed. Check the Braintree Sandbox Control Panel before trying again.",
  signInRequired: "Sign in again before using the sandbox checkout.",
  completeCardFields:
    "Complete the secure sandbox card fields before submitting.",
  retryGuardStorageFailed:
    "The browser could not save the sandbox retry guard. Enable local storage before trying again.",
  tokenizeFailed:
    "The sandbox card details could not be secured. Review them and try again.",
} as const;
