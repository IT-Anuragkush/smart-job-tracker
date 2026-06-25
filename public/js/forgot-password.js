const form = document.getElementById("forgotPasswordForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;

  const response = await fetch("/api/auth/forgot-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      newPassword,
    }),
  });

  const data = await response.json();

  Swal.fire({
    icon: data.success ? "success" : "error",
    title: data.message,
  });

  if (data.success) {
    window.location.href = "/login";
  }
});
