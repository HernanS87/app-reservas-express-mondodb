import { InferSchemaType, Schema, model } from "mongoose";
import { TipoTurno } from "../../enum/tipoTurnoEnum";

const reservaSchema = new Schema({
  nombreCliente: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        // Expresión regular para validar formato de email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props: any) => `${props.value} no es un email válido!`,
    },
  },
  turno: {
    type: String,
    enum: TipoTurno,
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
    required: true,
    validate: {
      validator: function (v: string) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Asegura formato "HH:MM"
      },
      message: (props: any) => `${props.value} no es un formato de hora válido!`,
    },
  },
  estado: {
    type: String,
    enum: ["CONFIRMADA", "CANCELADA", "FINALIZADA"], // El estado FINALIZADA indica que asistieron al restaurante y ya liberaron la mesa
    required: true,
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
