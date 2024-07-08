const mongoose = require("mongoose");

// Check command-line arguments
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// MongoDB connection URL
const url = `mongodb+srv://mtauhidul:${password}@phonebook.8wbap8l.mongodb.net/persons?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(url);

// Define schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// Adding a new entry
if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  // Listing all entries
  Person.find({}).then((result) => {
    console.log("Persons:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
