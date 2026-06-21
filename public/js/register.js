const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Registration Successful");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
});