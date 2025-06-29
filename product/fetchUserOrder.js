async function fetchUserOrders() {
  try {
    const response = await fetch("https://versatile-aqao.onrender.com/api/v1/orders/me", {
    method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await response.json();
    return data

  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
}
