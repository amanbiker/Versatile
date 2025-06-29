  
  const cart = {}

 async function getProducts() {
      try {
        const response = await fetch("https://versatile-aqao.onrender.com/api/v1/products", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        const result = await response.json();
        return result;

      } catch (error) {
        console.error("Error during Fetching Products:", error);
        alert("An error occurred while fetching the products.");
        return null;
      }
    }

 
window.addEventListener("DOMContentLoaded", async () => {

  let result = await getProducts();  
  let finalProducts = result.products;

  const productItems = document.getElementById('productList');

  finalProducts.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.textContent = product.name;
        div.dataset.id = product.id; 
        div.onclick = () => showProductLevels(product);
        productItems.appendChild(div);
  });
});

async function fetchProductLevels() {
    try {
    const response = await fetch("https://versatile-aqao.onrender.com/api/v1/permit-levels", {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });

    result = await response.json();
    return result;
    } catch (error) {
    console.error("Error during Fetching Products:", error);
    alert("An error occurred while fetching the products.");
    }
}

async function showProductLevels(product) {
  // Remove previous active class
  document.querySelectorAll('.product-card').forEach(card => card.classList.remove('active'));

  const activeCard = document.querySelector(`.product-card[data-id="${product._id}"]`);
  if (activeCard) activeCard.classList.add('active');

  const productLevelResponse = await fetchProductLevels();
  const levelsContainer = document.querySelector(".levels");
  levelsContainer.innerHTML = "";

  const permittedLevels = productLevelResponse.permittedLevels;
  let productLevels = [];

  // Collect only levels for selected product
  for (const subject in permittedLevels) {
    productLevels.push(...permittedLevels[subject].filter(level => level.product._id === product._id));
  }

  // Store prices per level for cart logic
  const levelPrices = productLevels.map(level => level.price);
  const levelNumbers = productLevels.map(level => level.levelNumber);

  if (!cart[product._id]) {
    cart[product._id] = {
      quantities: Array(productLevels.length).fill(0),
      levelPrices: levelPrices,
      levels: levelNumbers 
    };
  }

  // ${level.levelNumber>1?"Level "+level.levelNumber:"Beginner Level"}

  const renderId = ++showProductLevels.renderId || (showProductLevels.renderId = 1);

  productLevels.forEach((level, index) => {
    setTimeout(() => {
      if (renderId !== showProductLevels.renderId) return;

      const div = document.createElement('div');
      div.className = 'level-card';
      div.innerHTML = `
        <div class="level-container">
          <div class="product-label">
           <h3>Level ${level.levelNumber}</h3>
          </div>

          <div class="product-image">
            <img src="${level.images[0]?.url}" alt="${level.levelNumber}"></img>
          </div>

          <div class="product-info">
            <div class="quantity-control">
              <button onclick="decrease('${product._id}', ${index})">-</button>
              <span id="qty-${product._id}-${index}">${cart[product._id].quantities[index]}</span>
              <button onclick="increase('${product._id}', ${index})">+</button>
            </div>

            <div class="level-cost">₹${level.price}</div>

            <div class="level-desc">
              <p>${level.description}</p>
            </div>
          </div>
        </div>
      `;
      levelsContainer.appendChild(div);
    }, index * 200);
  });

  updateTotal();
}

 function increase(productId, index) {
  cart[productId].quantities[index]++;
  document.getElementById(`qty-${productId}-${index}`).textContent = cart[productId].quantities[index];
  updateTotal();
}

function decrease(productId, index) {
  if (cart[productId].quantities[index] > 0) {
    cart[productId].quantities[index]--;
    document.getElementById(`qty-${productId}-${index}`).textContent = cart[productId].quantities[index];
    updateTotal();
  }
}

function updateTotal() {
  let total = 0;
  for (let productId in cart) {
    const product = cart[productId];
    for (let i = 0; i < product.quantities.length; i++) {
      total += product.quantities[i] * product.levelPrices[i];
    }
  }
  document.getElementById('total').textContent = total;
}


function saveCartToLocalStorage() {
  const selectedItems = [];

  for (let productId in cart) {
    
    const { quantities, levelPrices, levels } = cart[productId];

for (let i = 0; i < quantities.length; i++) {
  if (quantities[i] > 0) {
    selectedItems.push({
      productId: productId,
      quantity: quantities[i],
      price: levelPrices[i],
      levelNumber: levels[i]  // ✅ accurate level number
    });
  }
}
  }

  localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
  alert("Cart saved to localStorage!");
  window.location.href="shippingDetail.html"
}
