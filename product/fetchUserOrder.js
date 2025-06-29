async function fetchUserOrders() {
  try {
    const response = await fetch("http://localhost:4000/api/v1/orders/me", {
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
