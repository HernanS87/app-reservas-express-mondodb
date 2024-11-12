import { z } from 'zod';

// Esquema Zod para validar los datos de una mesa
const mesaSchema = z.object({
  numero: z.number().min(1), // Validación para número mínimo
  capacidad: z.union([z.literal(2), z.literal(4), z.literal(6), z.literal(10)]), // Validación con números
  fechaBaja: z.date().nullable().default(null), // Validación para fecha o null
});

// Inferir el tipo de TypeScript a partir del esquema de Zod
export type MesaValidation = z.infer<typeof mesaSchema>;

export const validateMesa = (mesa: MesaValidation) => mesaSchema.safeParseAsync(mesa);