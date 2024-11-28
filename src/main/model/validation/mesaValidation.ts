import { z } from "zod";
import { convertirAFechaLocal } from "../../util/dateUtil";
import { isAfter } from "date-fns";

// Esquema Zod para validar los datos de una mesa
const mesaSchema = z.object({
  numero: z.number().min(1, { message: "El número debe ser mayor o igual a 1." }).optional(),
  capacidad: z
    .number()
    .refine((val) => [2, 4, 6, 10].includes(val), {
      message: "La capacidad debe ser uno de los valores permitidos: 2, 4, 6 o 10.",
    })
    .transform((val) => Number(val)), // Validación con números
  fechaBaja: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)), {
      message: "El parámetro fecha debe ser una fecha válida en formato YYYY-MM-DD.",
    })
    .refine((val) => isAfter(convertirAFechaLocal(val), new Date()), {
      message: "La fecha debe ser mayor al día de hoy.",
    })
    .transform((val) => convertirAFechaLocal(val))
    .optional(), // Validación para fecha o null
});

// Inferir el tipo de TypeScript a partir del esquema de Zod
export type MesaValidation = z.infer<typeof mesaSchema>;

export const validateMesa = (mesa: MesaValidation) => mesaSchema.safeParseAsync(mesa);
