/* Author: VIJAYKUMAR */

const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://e-commerce-store-3-guwg.onrender.com";

function setMessage(text, isError = false) {
  const messageDisplay = document.getElementById("message");
  messageDisplay.style.color = isError ? "#e74c3c" : "#4CAF50";
  messageDisplay.textContent = text;
}

async function login() {
  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  setMessage("");

  if (!emailInput || !passwordInput) {
    setMessage("All fields are required.", true);
    return;
  }

  if (!emailInput.includes("@") || !emailInput.includes(".")) {
    setMessage("Please enter a valid email address.", true);
    return;
  }

  try {
    setMessage("Signing you in...");
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setMessage("Login successful. Opening store...");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  } catch (error) {
    setMessage(error.message, true);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    login();
  }
});
