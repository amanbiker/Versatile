function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

 
 document.getElementById("createProduct").addEventListener("submit", async function(event) {
      event.preventDefault(); // Prevent default form submission

       const select = document.getElementById('userSelect');
        const selectedEmails = Array.from(select.selectedOptions).map(option => option.value);

        // Map selected emails to MongoDB ObjectIDs
        const selectedUserIds = selectedEmails.map(email => emailToIdMap[email]);
         const file = document.getElementById('imageInput').files[0];
          if (!file) {
            alert("Please select an image.");
            return;
          }

          const imageBase = await getBase64(file); // wait for base64


      //const name = document.getElementById("level-name").value;
      const levelNumber = document.getElementById("level-number").value;
      const description = document.getElementById("level-description").value;
      const price = document.getElementById("price").value;
      const stock = document.getElementById("stock").value;
      const images = imageBase;
      const product = document.getElementById("product").value;
      const permittedUsers = selectedUserIds;

    
    const createLevelData = {
      // name: name,
      levelNumber: levelNumber,
      description: description,
      price: price,
      stock: stock,
      images: images,
      product: product,
      permittedUsers: permittedUsers
    };



    // Async function to send POST request
    const createLevel = async (createLevelData) => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/admin/new-level", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(createLevelData)
        });

        const result = await response.json();
       

        if (response.ok) {
          // Optionally store in localStorage only on success
  
          
          alert("Level Created Successfully!");
         
        } else {
          alert("Level creation failed: " + result.message);
        }

      } catch (error) {
        console.error("Error during Level creation:", error);
        alert("An error occurred while creating the level.");
      }
    };

    // Call the function
    createLevel(createLevelData);
    });
    
