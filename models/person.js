const { ReturnDocument } = require("mongodb");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log(`connecting to mongo database...`);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("connected to mongo database!");
  })
  .catch((error) => {
    console.log("error connecting to mongo database!", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
