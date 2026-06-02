/* Author: VIJAYKUMAR */

function login() {
  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();
  const messageDisplay = document.getElementById("message");

  messageDisplay.textContent = "";

  if (!emailInput || !passwordInput) {
    messageDisplay.style.color = "#e74c3c";
    messageDisplay.textContent = "Error: All fields are required.";
    return;
  }

  if (!emailInput.includes("@") || !emailInput.includes(".")) {
    messageDisplay.style.color = "#e74c3c";
    messageDisplay.textContent = "Error: Please enter a valid email address.";
    return;
  }

  messageDisplay.style.color = "#4CAF50";
  messageDisplay.textContent = "Success! Entering storefront...";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}
