import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v: string) {
        // Expresión regular para validar formato de email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props: any) => `${props.value} no es un email válido!`,
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  }, // Indica si el email fue verificado
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export type UserModelType = InferSchemaType<typeof userSchema>;

export const User = model<UserModelType>("User", userSchema);
