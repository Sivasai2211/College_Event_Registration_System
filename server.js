// Backend: College Event Registration System
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;
const FILE = "data/registrations.json";

app.use(express.json());
app.use(express.static("public"));

function readData() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/api/events", (req, res) => {
  res.json([
    { id: 1, name: "Tech Fest", date: "20 November 2026", venue: "Auditorium" },
    { id: 2, name: "Cultural Day", date: "25 November 2026", venue: "Open Ground" },
    { id: 3, name: "Sports Meet", date: "30 November 2026", venue: "Sports Complex" }
  ]);
});

app.get("/api/registrations", (req, res) => res.json(readData()));

app.post("/api/register", (req, res) => {
  const { name, roll, email, event } = req.body;
  if (!name || !roll || !email || !event)
    return res.status(400).json({ message: "Please fill all fields." });

  const data = readData();
  if (data.some(x => x.roll === roll && x.event === event))
    return res.status(400).json({ message: "Already registered for this event." });

  data.push({ id: Date.now(), name, roll, email, event });
  saveData(data);
  res.json({ message: "Registration successful!" });
});

app.delete("/api/registrations/:id", (req, res) => {
  const data = readData().filter(x => x.id != req.params.id);
  saveData(data);
  res.json({ message: "Registration deleted." });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));