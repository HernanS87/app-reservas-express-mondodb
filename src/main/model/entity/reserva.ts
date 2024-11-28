import { InferSchemaType, Schema, model } from "mongoose";
import { TipoTurno } from "../../enum/tipoTurnoEnum";
import { HorasAlmuerzo } from "../../enum/horasAlmuerzoEnum";
import { HorasCena } from "../../enum/horasCenaEnum";

const validHours = [...Object.values(HorasCena), ...Object.values(HorasAlmuerzo)];

const reservaSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  turno: {
    type: String,
    enum: Object.values(TipoTurno),
    required: true,
  },
  cantidadPersonas: {
    type: Number,
    required: true,
    min: [1, "Debe haber al menos 1 persona."], // Mínimo 1 persona
    max: [10, "No puede haber más de 10 personas."], // Máximo 10 personas
  },
  fecha: {
    type: Date,
    required: true,
  },
  fechaBaja: {
    type: Date,
    default: null,
  },
  hora: {
    type: String,
    enum: validHours,
    required: true,
  },
  estado: {
    type: String,
    enum: ["CONFIRMADA", "CANCELADA", "FINALIZADA"], // El estado FINALIZADA indica que asistieron al restaurante y ya liberaron la mesa
    default: "CONFIRMADA",
  },
  mesa: [
    {
      type: Schema.Types.ObjectId,
      ref: "Mesa",
    },
  ],
});

reservaSchema.index({ fecha: -1, hora: 1 }); // Un índice compuesto mejora el rendimiento de las consultas que filtran por ambos campos o al menos por el primer campo (fecha en este caso)

reservaSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export type ReservaModelType = InferSchemaType<typeof reservaSchema>;

export const Reserva = model<ReservaModelType>("Reserva", reservaSchema);
