const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
const format =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(morgan(format));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Welcome to Phonebook Backend!<h1/>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
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
  const person = persons.find((p) => p.id == id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((person) => person.id != id);

  response.status(204).end();
});

function generateId() {
  return String(Math.floor(Math.random() * 100) + 1);
}

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const isDuplicate = persons.find((person) => person.name == body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  if (isDuplicate) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Phonebook backend server running on port ${PORT}`);
});
