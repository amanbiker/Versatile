
async function submitOrder() {

  const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  const cartItems = JSON.parse(localStorage.getItem("selectedCartItems"));
  
  

  if (!shippingInfo || !cartItems || cartItems.length === 0) {
    alert("Missing order details. Please go back and complete your cart and shipping info.");
    return;
  }


  const orderItems = cartItems.map(item => ({
    price: item.price,
    quantity: item.quantity,
    image: item.image || "",
    product: item.productId,
    levelNumber: item.levelNumber
  }));

  

  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxPrice = +(itemsPrice * 0.18).toFixed(2);  // 18% GST
  const shippingPrice = itemsPrice > 500 ? 0 : 50;  // Free shipping over ₹500
  const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);

  const paymentInfo = {
    id: "FAKE_PAYMENT_ID_123",   // Replace with real payment ID after integration
    status: "Paid"
  };

  const orderData = {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  };

  try {
    const response = await fetch("https://versatile-aqao.onrender.com/api/v1/order/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      alert("Order placed successfully!");
      localStorage.removeItem("selectedCartItems");
      localStorage.removeItem("shippingInfo");
      window.location.href = "thankyou.html"; // or any success page
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Order submission error:", error);
    alert("An error occurred while placing the order.");
  }
}

// Call this on your payment confirmation or button click
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("confirmOrderBtn")?.addEventListener("click", submitOrder);
});
