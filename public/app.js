// Frontend: communicates with the backend using fetch()

const eventsBox = document.getElementById("events");
const eventSelect = document.getElementById("event");
const form = document.getElementById("regForm");
const message = document.getElementById("message");
const list = document.getElementById("registrations");

async function loadEvents() {
  const res = await fetch("/api/events");
  const events = await res.json();
  eventsBox.innerHTML = events.map(e =>
    `<article class="event"><h3>${e.name}</h3><p>📅 ${e.date}</p><p>📍 ${e.venue}</p></article>`
  ).join("");
  eventSelect.innerHTML = '<option value="">Select an event</option>' +
    events.map(e => `<option>${e.name}</option>`).join("");
}

async function loadRegistrations() {
  const res = await fetch("/api/registrations");
  const data = await res.json();
  list.innerHTML = data.length ? data.map(x =>
    `<div class="student"><b>${x.name}</b> (${x.roll}) - ${x.event}
     <button onclick="deleteRegistration(${x.id})">Delete</button></div>`
  ).join("") : "<p>No registrations yet.</p>";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const student = {
    name: document.getElementById("name").value.trim(),
    roll: document.getElementById("roll").value.trim(),
    email: document.getElementById("email").value.trim(),
    event: eventSelect.value
  };
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  const result = await res.json();
  message.textContent = result.message;
  message.className = res.ok ? "success" : "error";
  if (res.ok) { form.reset(); loadRegistrations(); }
});

async function deleteRegistration(id) {
  await fetch("/api/registrations/" + id, { method: "DELETE" });
  loadRegistrations();
}

document.getElementById("refresh").addEventListener("click", loadRegistrations);
loadEvents();
loadRegistrations();