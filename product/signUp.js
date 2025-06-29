
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const userData = {
      name: name,
      role: role,
      email: email,
      password: password
    };

    // Async function to send POST request
    const userSignUp = async (userData) => {
      try {
        const response = await fetch("https://versatile-aqao.onrender.com/api/v1/register", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
          // Optionally store in localStorage only on success
         localStorage.setItem("token", result.token);

          localStorage.setItem("user", JSON.stringify(result.user || userData));
          alert("Account created successfully!");
          window.location.href = "Login.html";
        } else {
          alert("Registration failed: " + result.message);
        }

      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred while creating the account.");
      }
    };

    // Call the function
    userSignUp(userData);
  });

