import { InferSchemaType, Schema, model } from "mongoose";

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
  cantidadPersonas: {
    type: Number,
    required: true,
    min: [1, "Debe haber al menos 1 persona."], // Mínimo 1 persona
    max: [12, "No puede haber más de 12 personas."], // Máximo 12 personas
  },
  fecha: {
    type: Date,
    required: true,
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
    enum: ["CONFIRMADA", "CANCELADA"],
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

export type ReservaType = InferSchemaType<typeof reservaSchema>;

export const Reserva = model<ReservaType>("Reserva", reservaSchema);
