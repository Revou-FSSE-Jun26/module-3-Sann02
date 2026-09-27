// Profile page — progressive enhancement for the contact form.
// Prevents the default page reload on submit and shows a status message.
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser's default form submission

  // Basic manual validation (form uses novalidate so we control the flow)
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  if (!name || !email || !message) {
    status.textContent = "Please fill in your name, email, and message.";
    status.style.color = "#dc2626";
    return;
  }

  status.textContent = `Thanks, ${name}! Your message has been captured.`;
  status.style.color = "#059669";
  form.reset();
});
