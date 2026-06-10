const eventDate = new Date("2026-06-14T16:00:00-07:00");
const countdown = document.querySelector("#countdown");

function updateCountdown() {
  const distance = eventDate.getTime() - Date.now();
  if (distance <= 0) {
    countdown.innerHTML = "<strong>Today is the day!</strong>";
    return;
  }

  const units = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };

  Object.entries(units).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.querySelector("#rsvp-form");
const guestField = document.querySelector("#guest-field");
const success = document.querySelector("#success");
const formHelp = document.querySelector("#form-help");
const submitButton = form.querySelector('button[type="submit"]');
const formspreeEndpoint = "https://formspree.io/f/xykapwdp";

form.addEventListener("change", (event) => {
  if (event.target.name === "attendance") {
    guestField.classList.toggle("visible", event.target.value === "yes");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name").trim();
  const attending = data.get("attendance") === "yes";
  const guests = data.get("guests");

  submitButton.disabled = true;
  submitButton.innerHTML = "Saving RSVP…";
  formHelp.textContent = "Saving your response…";
  formHelp.classList.remove("error");

  try {
    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      body: JSON.stringify({
        name,
        attendance: attending ? "Attending" : "Not attending",
        guests: attending ? guests : "0",
        event: "Anthony's Graduation Party",
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Unable to save RSVP");

    localStorage.setItem("anthony-rsvp", JSON.stringify({ name, attending, guests }));
    document.querySelector("#success-name").textContent = name.split(" ")[0];
    document.querySelector("#success-copy").textContent = attending
      ? `Your RSVP is saved. We’re excited to celebrate with you${guests !== "0" ? ` and your ${guests} guest${guests === "1" ? "" : "s"}` : ""}.`
      : "Your RSVP is saved. You’ll be missed!";
    form.hidden = true;
    success.classList.add("visible");
  } catch (error) {
    formHelp.textContent = "We couldn’t save your RSVP. Please check your connection and try again.";
    formHelp.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "Send my RSVP <span>→</span>";
  }
});

document.querySelector("#edit-rsvp").addEventListener("click", () => {
  success.classList.remove("visible");
  form.hidden = false;
});

const saved = JSON.parse(localStorage.getItem("anthony-rsvp") || "null");
if (saved) {
  document.querySelector("#name").value = saved.name || "";
  document.querySelector("#guests").value = saved.guests || "0";
  const attendance = document.querySelector(`[name="attendance"][value="${saved.attending ? "yes" : "no"}"]`);
  if (attendance) attendance.checked = true;
  guestField.classList.toggle("visible", saved.attending);
}
