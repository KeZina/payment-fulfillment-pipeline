import { GenericSchema, safeParse } from "valibot";

export const validateSchema = (input: unknown, schema: GenericSchema) => {
  const res = safeParse(schema, input);

  if (!res.success) {
    throw new Error("Invalid data");
  }
};
