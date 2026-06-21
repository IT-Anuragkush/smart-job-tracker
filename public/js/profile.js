const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

async function getProfile() {
  try {
    showLoader();

    const response = await fetch("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("name").innerText =
        data.user.name;

      document.getElementById("email").innerText =
        data.user.email;

      // Avatar First Letter
      document.querySelector(".avatar").innerText =
        data.user.name.charAt(0).toUpperCase();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
}

document
  .getElementById("editBtn")
  .addEventListener("click", async () => {

    const newName = prompt(
      "Enter New Name",
      document.getElementById("name").innerText
    );

    const newEmail = prompt(
      "Enter New Email",
      document.getElementById("email").innerText
    );

    if (!newName || !newEmail) return;

    try {
      showLoader();

      const response = await fetch(
        "/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newName,
            email: newEmail,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Profile Updated Successfully");
        getProfile();
      }
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  });

  document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", async () => {

    const confirmDelete = confirm(
      "Are you sure? This will permanently delete your account."
    );

    if (!confirmDelete) return;

    const response = await fetch(
      "/api/auth/delete-account",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.removeItem("token");
      window.location.href = "/register";
    }
  });

  document
  .getElementById("changePasswordBtn")
  .addEventListener("click", async () => {

    const oldPassword = prompt(
      "Enter Old Password"
    );

    const newPassword = prompt(
      "Enter New Password"
    );

    if (!oldPassword || !newPassword) return;

    try {
      showLoader();

      const response = await fetch(
        "/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Password Changed Successfully");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  });

window.addEventListener("DOMContentLoaded", () => {
  getProfile();
});

document
  .getElementById("logoutBtn")
  .addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  });