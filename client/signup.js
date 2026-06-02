/* Author: VIJAYKUMAR */
/**
 * Handles account creation.
 * Redirects back to the login gateway.
 */
function signup() {
  const username = document.getElementById("new-username").value.trim();
  const email = document.getElementById("new-email").value.trim();
  const password = document.getElementById("new-password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();
  const messageDisplay = document.getElementById("message");

  messageDisplay.textContent = "";

  if (!username || !email || !password || !confirmPassword) {
    messageDisplay.style.color = "#e74c3c";
    messageDisplay.textContent = "All fields are required.";
    return;
  }

  if (password !== confirmPassword) {
    messageDisplay.style.color = "#e74c3c";
    messageDisplay.textContent = "Passwords do not match.";
    return;
  }

  messageDisplay.style.color = "#4CAF50";
  messageDisplay.textContent =
    "Registration successful! Routing to login screen...";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}
