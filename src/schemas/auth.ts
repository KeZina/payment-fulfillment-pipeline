import * as v from "valibot";

export const SignInSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password must contain at least 8 symbols"),
  ),
});

export const SignUpSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must contain at least 2 symbols"),
  ),
  email: v.pipe(v.string(), v.email("Invalid email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password must contain at least 8 symbols"),
  ),
});
