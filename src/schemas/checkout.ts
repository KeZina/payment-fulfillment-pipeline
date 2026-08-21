import * as v from "valibot";

export const CheckoutDetailsSchema = v.object({
  fullName: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "Enter your full name"),
    v.maxLength(120, "Name must be 120 characters or fewer"),
  ),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Enter your email address"),
    v.email("Enter a valid email address"),
    v.maxLength(254, "Email must be 254 characters or fewer"),
  ),
  phone: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(7, "Enter a valid phone number"),
    v.maxLength(30, "Phone number must be 30 characters or fewer"),
    v.regex(
      /^[+0-9()\-.\s]+$/,
      "Phone number can only contain numbers and common phone symbols",
    ),
  ),
  deliveryAddress: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "Enter a complete delivery address"),
    v.maxLength(300, "Address must be 300 characters or fewer"),
  ),
  deliveryInstructions: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(500, "Instructions must be 500 characters or fewer"),
  ),
});
