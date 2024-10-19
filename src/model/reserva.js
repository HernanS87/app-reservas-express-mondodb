import { Schema, model } from "mongoose";

const reservaSchema = new Schema({
  nombreCliente: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Expresión regular para validar formato de email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} no es un email válido!`,
    },
  },
  cantidadPersonas: {
    type: Number,
    required: true,
    min: [1, "Debe haber al menos 1 persona."], // Mínimo 1 persona
    max: [6, "No puede haber más de 6 personas."], // Máximo 6 personas
  },
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Asegura formato "HH:MM"
      },
      message: (props) => `${props.value} no es un formato de hora válido!`,
    },
  },
  estado: {
    type: String,
    enum: ["Confirmada", "Cancelada"],
    required: true,
  },
  mesa: {
    type: Schema.Types.ObjectId,
    ref: "Mesa",
    required: true,
  },
});

reservaSchema.index({ fecha: -1, hora: 1 }); // Un índice compuesto mejora el rendimiento de las consultas que filtran por ambos campos o al menos por el primer campo (fecha en este caso)

reservaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});


export const Reserva = model("Reserva", reservaSchema);
