const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|in)$/i;

  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email Address",
    });
    return;
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      Swal.fire({
        icon: "error",
        title: data.message,
      });
    }
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Something went wrong",
    });
  }
});
