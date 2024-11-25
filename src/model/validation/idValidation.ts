import { Types } from "mongoose";
import { z } from "zod";

const idSchema = z.object({
  id: z
    .string()
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "El id no es válido como ObjectId.",
    })
    .transform((id) => new Types.ObjectId(id)),
});

export const validateId = (params: any) => idSchema.safeParseAsync(params);
