const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent the form from submitting

  const email = loginForm.elements.email.value;
  const password = loginForm.elements.password.value;

  if (!email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // If login was successful, save the JWT in localStorage and redirect to the home page
      localStorage.setItem('token', data.token);
      location.replace('../index.html');
    } else {
      alert(data.msg);
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while attempting to login.');
  }
});

const btn = document.querySelector(".register-btn");
const emailInput = document.querySelector("#email");

btn.addEventListener("click", () => {
  localStorage.setItem("email", emailInput.value);
});
