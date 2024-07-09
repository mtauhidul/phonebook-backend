require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
const format =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(morgan(format));

app.get("/", (request, response) => {
  response.send("<h1>Welcome to Phonebook Backend!<h1/>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const totalPersons = persons.length;
  const requestTime = new Date();

  response.send(
    `<p>Phonebook has info for ${totalPersons} people <br/> ${requestTime}<p/>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.find({ id }).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((person) => person.id != id);

  response.status(204).end();
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  try {
    const existingPerson = await Person.findOne({ name: body.name });

    if (existingPerson) {
      return response.status(400).json({ error: "name must be unique" });
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await newPerson.save();
    response.json(savedPerson);
  } catch (error) {
    response.status(500).json({ error: "something went wrong" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Phonebook backend server running on port ${PORT}`);
});
