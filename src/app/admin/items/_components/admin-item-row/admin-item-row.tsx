"use client";

import { useForm, useSelector } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateItem } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UpdateItemSchema } from "@/schemas";
import { formatBasketPrice } from "@/utils";
import { checkIfFormFieldInvalid } from "@/utils/client";
import { adminItemRowStyles } from "./admin-item-row.styles";
import type {
  AdminItemEditableFieldProps,
  AdminItemRowProps,
} from "./admin-item-row.types";

// Price, discount, and quantity are all validated strings (see
// UpdateItemSchema), so they share the same input/error rendering shape.
function AdminItemEditableField({
  errorIdPrefix,
  field,
  inputMode,
}: AdminItemEditableFieldProps) {
  const isInvalid = checkIfFormFieldInvalid(field);
  const errorId = `${errorIdPrefix}-error`;

  return (
    <>
      <Input
        aria-describedby={isInvalid ? errorId : undefined}
        aria-invalid={isInvalid}
        className={adminItemRowStyles.input}
        inputMode={inputMode}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {isInvalid && (
        <FieldError
          id={errorId}
          className={adminItemRowStyles.error}
          errors={field.state.meta.errors}
        />
      )}
    </>
  );
}

export function AdminItemRow({ item }: AdminItemRowProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      itemId: item.id,
      price: item.price,
      discount: item.discount,
      quantity: String(item.quantity),
    },
    validators: {
      onBlur: UpdateItemSchema,
      onSubmit: UpdateItemSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await updateItem(value);

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success(response.message ?? "Item updated");
      router.refresh();
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);
  const isDirty = useSelector(form.store, (state) => state.isDirty);
  const canSubmit = useSelector(form.store, (state) => state.canSubmit);
  const previewSalePrice = useSelector(form.store, (state) => {
    const parsedPrice = Number(state.values.price);
    const parsedDiscount = Number(state.values.discount);

    if (
      Number.isNaN(parsedPrice) ||
      Number.isNaN(parsedDiscount) ||
      parsedDiscount < 0 ||
      parsedDiscount > 1
    ) {
      return item.salePrice;
    }

    return (parsedPrice * (1 - parsedDiscount)).toFixed(2);
  });

  return (
    <tr>
      <td className={adminItemRowStyles.nameCell}>{item.name}</td>
      <td>
        <form.Field name='price'>
          {(field) => (
            <AdminItemEditableField
              errorIdPrefix={`${field.name}-${item.id}`}
              field={field}
              inputMode='decimal'
            />
          )}
        </form.Field>
      </td>
      <td>
        <form.Field name='discount'>
          {(field) => (
            <AdminItemEditableField
              errorIdPrefix={`${field.name}-${item.id}`}
              field={field}
              inputMode='decimal'
            />
          )}
        </form.Field>
      </td>
      <td>
        <form.Field name='quantity'>
          {(field) => (
            <AdminItemEditableField
              errorIdPrefix={`${field.name}-${item.id}`}
              field={field}
              inputMode='numeric'
            />
          )}
        </form.Field>
      </td>
      <td className={adminItemRowStyles.salePriceCell}>
        {formatBasketPrice(previewSalePrice)}
      </td>
      <td className={adminItemRowStyles.actionsCell}>
        <Button
          type='button'
          size='sm'
          disabled={isSubmitting || !isDirty || !canSubmit}
          onClick={() => form.handleSubmit()}
        >
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </td>
    </tr>
  );
}
