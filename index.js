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

// Route Handlers
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Phonebook Backend!<h1/>");
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch(next);
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const totalPersons = persons.length;
      const requestTime = new Date();
      res.send(
        `<p>Phonebook has info for ${totalPersons} people <br/> ${requestTime}<p/>`
      );
    })
    .catch(next);
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        existingPerson.number = number;
        return existingPerson.save().then((updatedPerson) => {
          res.json(updatedPerson);
        });
      } else {
        const person = new Person({ name, number });
        return person.save().then((savedPerson) => res.json(savedPerson));
      }
    })
    .catch(next);
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  const person = { name, number };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch(next);
});

// Unknown Endpoint Middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Error Handling Middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformed id!" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

// Server Initialization
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Phonebook backend server running on port ${PORT}`);
});
