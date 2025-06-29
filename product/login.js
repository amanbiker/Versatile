
    // JavaScript to handle login form submission and redirection
    document.getElementById("loginForm").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent default form submission


      const Email = document.getElementById("email").value;
      const Password = document.getElementById("password").value;

    
    const userLoginData = {
      email: Email,
      password: Password
    };

    // Async function to send POST request
    const userLogin = async (userLoginData) => {
      try {
        const response = await fetch("https://versatile-aqao.onrender.com/api/v1/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userLoginData)
        });

        const result = await response.json();
       

        if (response.ok) {
          // Optionally store in localStorage only on success
          localStorage.setItem("token", result.token);

          localStorage.setItem("user", JSON.stringify(result.user || userLoginData));
          alert("Logged In successfully!");
          if(result.user.role==="admin")
          {
             window.location.href = "adminOrder.html";
          }
          else
          {
            window.location.href = "product.html";
          }
         
        } else {
          alert("Login failed: " + result.message);
        }

      } catch (error) {
        console.error("Error during Login:", error);
        alert("An error occurred while login the account.");
      }
    };

    // Call the function
    userLogin(userLoginData);
    });
    
