async function fetchAdminOrders() {
  try {
    const response = await fetch(" https://versatile-aqao.onrender.com/api/v1/admin/orders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await response.json();

    let orders = data.orders;
    orders = data.orders.reverse();

    const tbody = document.querySelector(".tbody");
    tbody.innerHTML = "";
    orders.forEach(order => {
      const tr = document.createElement("div");
      tr.className = "tr" + (order.orderStatus === "Delivered" ? " delivered-order" : "");

      //const date = new Date(order.createdAt).toLocaleDateString("en-IN");
      const date = new Date(order.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });


      const customerName = order.user?.name || "Unknown";
      const total = `₹${order.totalPrice}`;
      const orderId = order._id;

      const productName = order.orderItems.map(item => item.product?.name).join("<br>");

      const levelQtyHTML = order.orderItems.map(item => {
        const levelNumber = item.levelNumber ?? "N/A";
        return `
      <div class="level-container">
        <h5>Level ${levelNumber}</h5>
        <h5>${item.quantity}</h5>
      </div>`;
      }).join("");

      const s = order.shippingInfo;
      const address = `${s.house}, ${s.area}, ${s.landmark}, ${s.city}, ${s.state}, ${s.country} - ${s.pincode}<br/>Phone: ${s.phoneNo}`;

      tr.innerHTML = `
    <div class="td">#${orderId.slice(-6).toUpperCase()}</div>
    <div class="td">${date}</div>
    <div class="td">${customerName}</div>
    <div class="td">${productName}</div>
    <div class="td-level">${levelQtyHTML}</div>
    <div class="td-address">${address}</div>
    <div class="td" style="text-align: center;">${total}</div>
    <div class="td">
      <div class="btn-container">
        <button class="btn btn-view" data-id="${orderId}" data-status="Shipped">Shipped</button>
        <button class="btn btn-delete" data-id="${orderId}" data-status="Delivered">Delivered</button>
      </div>
    </div>
  `;

      tbody.appendChild(tr);
    });


    document.querySelector(".tbody").addEventListener("click", async function (e) {
      if (e.target.tagName === "BUTTON" && e.target.dataset.status) {
        const orderId = e.target.dataset.id;
        const newStatus = e.target.dataset.status;

        try {
          const response = await fetch(`https://versatile-aqao.onrender.com/api/v1/admin/order/${orderId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ status: newStatus })
          });

          const result = await response.json();
          if (result.success) {
            alert(`Order ${orderId.slice(-6).toUpperCase()} marked as ${newStatus}`);
            fetchAdminOrders(); // Refresh the list
          } else {
            alert("Failed to update order status.");
          }
        } catch (error) {
          console.error("Error updating order status:", error);
          alert("An error occurred while updating the order.");
        }
      }
    });


  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
}
