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

async function signup() {
  const username = document.getElementById("new-username").value.trim();
  const email = document.getElementById("new-email").value.trim();
  const password = document.getElementById("new-password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();

  setMessage("");

  if (!username || !email || !password || !confirmPassword) {
    setMessage("All fields are required.", true);
    return;
  }

  if (password.length < 6) {
    setMessage("Password must be at least 6 characters long.", true);
    return;
  }

  if (password !== confirmPassword) {
    setMessage("Passwords do not match.", true);
    return;
  }

  try {
    setMessage("Creating your account...");
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        email,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setMessage("Registration successful. Opening store...");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  } catch (error) {
    setMessage(error.message, true);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    signup();
  }
});
