// DOM elements
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authMessage = document.getElementById("auth-message");

// Switch between login and registration forms
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.style.display = "block";
  registerForm.style.display = "none";
});

registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.style.display = "block";
  loginForm.style.display = "none";
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await loginUser(email, password);
    if (response.success) {
      window.location.href = "index.html"; // Redirect to the game
    } else {
      authMessage.textContent = "Login failed. Please check your credentials.";
    }
  } catch (error) {
    authMessage.textContent = "An error occurred. Please try again.";
  }
});

// Handle registration form submission
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const response = await registerUser(email, password);
    if (response.success) {
      authMessage.textContent = "Registration successful! Please log in.";
      loginTab.click(); // Switch to the login form
    } else {
      authMessage.textContent = "Registration failed. Please try again.";
    }
  } catch (error) {
    authMessage.textContent = "An error occurred. Please try again.";
  }
});
