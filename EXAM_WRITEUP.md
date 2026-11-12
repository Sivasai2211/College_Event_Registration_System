# FSD-II External Lab Record

## AIM
To design and develop a College Event Registration System using HTML, CSS, JavaScript, Node.js and Express.

## PROCEDURE
1. Create the project folder and open it in VS Code.
2. Create frontend files using HTML, CSS and JavaScript.
3. Create the backend using Node.js and Express.
4. Connect frontend and backend using fetch API.
5. Store student registration details in a JSON file.
6. Run the application using `npm install` and `npm start`.
7. Open `http://localhost:3000` and test registration.

## MAIN CODE — FRONTEND (public/app.js)
```javascript
const eventsBox = document.getElementById("events");
const eventSelect = document.getElementById("event");
const form = document.getElementById("regForm");
const message = document.getElementById("message");
const list = document.getElementById("registrations");

async function loadEvents() {
  const res = await fetch("/api/events");
  const events = await res.json();
  eventsBox.innerHTML = events.map(e =>
    `<article><h3>${e.name}</h3><p>${e.date} - ${e.venue}</p></article>`
  ).join("");
  eventSelect.innerHTML = '<option value="">Select event</option>' +
    events.map(e => `<option>${e.name}</option>`).join("");
}

async function loadRegistrations() {
  const res = await fetch("/api/registrations");
  const data = await res.json();
  list.innerHTML = data.map(x =>
    `<p>${x.name} - ${x.roll} - ${x.event}</p>`
  ).join("") || "No registrations yet";
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const student = {
    name: document.getElementById("name").value,
    roll: document.getElementById("roll").value,
    email: document.getElementById("email").value,
    event: eventSelect.value
  };
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  const result = await res.json();
  message.innerText = result.message;
  if (res.ok) { form.reset(); loadRegistrations(); }
};

loadEvents();
loadRegistrations();
```

## MAIN CODE — BACKEND (server.js)
```javascript
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const file = "data/registrations.json";
const read = () => JSON.parse(fs.readFileSync(file));
const save = data => fs.writeFileSync(file, JSON.stringify(data, null, 2));

app.get("/api/events", (req, res) => {
  res.json([
    { name: "Tech Fest", date: "20 November 2026", venue: "Auditorium" },
    { name: "Cultural Day", date: "25 November 2026", venue: "Open Ground" },
    { name: "Sports Meet", date: "30 November 2026", venue: "Sports Complex" }
  ]);
});

app.get("/api/registrations", (req, res) => res.json(read()));

app.post("/api/register", (req, res) => {
  const { name, roll, email, event } = req.body;
  if (!name || !roll || !email || !event)
    return res.status(400).json({ message: "Fill all fields" });
  const data = read();
  data.push({ id: Date.now(), name, roll, email, event });
  save(data);
  res.json({ message: "Registration successful" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

## EXPECTED OUTPUT
A college event website should display upcoming events and a student registration form. After entering student details and selecting an event, the system should display a success message and show the registered student.

## ORIGINAL OUTPUT
The application runs successfully in the browser at `http://localhost:3000`. It displays Tech Fest, Cultural Day and Sports Meet. Student details are saved and displayed in the Registered Students section.

## IMPORTANT RUN COMMANDS
```bash
npm install
npm start
```

## IMPORTANT GIT COMMANDS
```bash
git clone YOUR-GITHUB-REPOSITORY-URL
cd College_Event_Registration_System
npm install
npm start
```
