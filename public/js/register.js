const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Name Validation
  if (name.length < 3) {
    Swal.fire({
      icon: "error",
      title: "Name must be at least 3 characters",
    });
    return;
  }

  const nameRegex = /^[A-Za-z ]+$/;

  if (!nameRegex.test(name)) {
    Swal.fire({
      icon: "error",
      title: "Name can only contain letters and spaces",
    });
    return;
  }

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Please enter a valid email address",
    });
    return;
  }

  // Password Validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!passwordRegex.test(password)) {
    Swal.fire({
      icon: "error",
      title: "Password must contain uppercase, lowercase and a number",
    });
    return;
  }

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
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/login";
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
