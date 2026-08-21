import { CreditCardIcon } from "@hugeicons/core-free-icons";
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
import { CHECKOUT_DETAILS_FORM_ID } from "../checkout-details-form";
import { checkoutPaymentPlaceholderStyles } from "./checkout-payment-placeholder.styles";

export function CheckoutPaymentPlaceholder() {
  return (
    <Card id='payment'>
      <CardHeader>
        <CardTitle role='heading' aria-level={2}>
          Payment
        </CardTitle>
        <CardDescription>
          Payment is intentionally unavailable in this step.
        </CardDescription>
        <CardAction>
          <Badge variant='secondary'>Coming next</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          className={checkoutPaymentPlaceholderStyles.placeholder}
          data-payment-provider='braintree-sandbox'
          aria-live='polite'
        >
          <HugeiconsIcon
            className={checkoutPaymentPlaceholderStyles.icon}
            icon={CreditCardIcon}
            strokeWidth={1.5}
            aria-hidden='true'
          />
          <p className={checkoutPaymentPlaceholderStyles.copy}>
            Braintree Sandbox payment details will appear here in the next
            step. No card details are collected yet.
          </p>
        </div>
      </CardContent>
      <CardFooter className={checkoutPaymentPlaceholderStyles.footer}>
        <Button
          type='submit'
          form={CHECKOUT_DETAILS_FORM_ID}
          size='lg'
          className={checkoutPaymentPlaceholderStyles.button}
          disabled
        >
          Sandbox payment coming next
        </Button>
        <p className={checkoutPaymentPlaceholderStyles.explanation}>
          The button will be enabled only after the sandbox payment connection
          is added.
        </p>
      </CardFooter>
    </Card>
  );
}
