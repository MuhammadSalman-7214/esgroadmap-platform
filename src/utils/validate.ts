import { ZodSchema } from "zod";
import { HttpBadRequestError } from "@/errors";

const validate = async <T>(schema: ZodSchema<T>, data: T): Promise<T> => {
  const result = await schema.safeParseAsync(data);
  if (!result.success) {
    throw new HttpBadRequestError('Validation Failed!', result.error.format()._errors);
  }
  return result.data;
};

export default validate;
