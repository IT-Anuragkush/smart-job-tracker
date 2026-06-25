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
  const response = await fetch("/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    document.getElementById(
      "welcome"
    ).innerText = `Welcome ${data.user.name}`;
  }
}

async function getStats() {
  const response = await fetch("/api/jobs/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    document.getElementById("total").innerText = data.stats.total;
    document.getElementById("applied").innerText = data.stats.applied;
    document.getElementById("interview").innerText = data.stats.interview;
    document.getElementById("offer").innerText = data.stats.offer;
    document.getElementById("rejected").innerText = data.stats.rejected;

    const ctx = document.getElementById("jobChart");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Applied", "Interview", "Offer", "Rejected"],
        datasets: [
          {
            data: [
              data.stats.applied,
              data.stats.interview,
              data.stats.offer,
              data.stats.rejected,
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}

async function init() {
  try {
    showLoader();

    await getProfile();
    await getStats();
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
}

init();

const addJobBtn = document.getElementById("addJobBtn");

if (addJobBtn) {
  addJobBtn.addEventListener("click", () => {
    window.location.href = "/jobs";
  });
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});