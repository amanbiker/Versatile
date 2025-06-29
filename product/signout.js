const signout = document.getElementById("signout");

signout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("https://versatile-aqao.onrender.com/api/v1/logout", {
      method: 'GET',
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Sign Out successfully!");
      window.location.href = "Login.html";
    } else {
      alert("Sign out failed: " + result.message);
    }

  } catch (error) {
    console.error("Error during sign out:", error);
    alert("An error occurred while signing out.");
  }
});
