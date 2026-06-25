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
      document.getElementById("name").innerText = data.user.name;

      document.getElementById("email").innerText = data.user.email;

      // Avatar First Letter
      document.querySelector(".avatar").innerText = data.user.name
        .charAt(0)
        .toUpperCase();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
}

// edit profile

document.getElementById("editBtn").addEventListener("click", async () => {
  const newName = prompt(
    "Enter New Name",
    document.getElementById("name").innerText,
  );

  const newEmail = prompt(
    "Enter New Email",
    document.getElementById("email").innerText,
  );

  if (!newName || !newEmail) return;

  try {
    showLoader();

    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
      }),
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Profile Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      getProfile();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
});

// change password

document
  .getElementById("changePasswordBtn")
  .addEventListener("click", async () => {
    const oldPassword = prompt("Enter Old Password");

    const newPassword = prompt("Enter New Password");

    if (!oldPassword || !newPassword) return;

    try {
      showLoader();

      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Changed Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  });

// delete account

document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      showLoader();

      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Account Deleted Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        localStorage.removeItem("token");
        window.location.href = "/register";
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
    } finally {
      hideLoader();
    }
  });

window.addEventListener("DOMContentLoaded", () => {
  getProfile();
});

// logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const result = await Swal.fire({
    title: "Logout?",
    text: "You will need to login again.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Logout",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("token");

    await Swal.fire({
      icon: "success",
      title: "Logged Out Successfully",
      timer: 1000,
      showConfirmButton: false,
    });

    window.location.href = "/login";
  }
});
