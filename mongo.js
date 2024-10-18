import mongoose, { model, Schema } from "mongoose";

const connectionString = "mongodb://localhost:27017/test";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Conectado a la base guey");
  })
  .catch((error) => console.log(error));

const noteSchema = new Schema({
  mensaje: String,
});

const Note = model("Note", noteSchema);

// const newNote = new Note({
//   mensaje: "Este es el ultimo mjs antes de dormir gracias a dios",
// });

// newNote
//   .save()
//   .then((result) => console.log("Cree este doc: ", result))
//   .catch((error) => console.log(error));

Note.find()
  .then((result) => {
    console.log(result);
    mongoose.connection.close();
  })
  .catch((error) => console.log(error));
