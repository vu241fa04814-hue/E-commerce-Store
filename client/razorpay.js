/* Author: VIJAYKUMAR */
window.onload = function () {
  renderCheckoutPage();
  document
    .getElementById("apply-promo")
    .addEventListener("click", applyPromoCode);

  document.querySelectorAll("input[name=payment-method]").forEach((input) => {
    input.addEventListener("change", renderPaymentMethodNote);
  });
  document
    .getElementById("pay-button")
    .addEventListener("click", startRazorpay);
  document
    .getElementById("payment-modal-close")
    .addEventListener("click", closePaymentModal);
  document
    .getElementById("payment-modal-ok")
    .addEventListener("click", closePaymentModal);
  window.paymentModalOnClose = null;
  renderPaymentMethodNote();
};

function loadShippingAddress() {
  try {
    const saved = localStorage.getItem("shippingAddress");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn("Could not load shipping address", error);
    return null;
  }
}

// FIX: Hardcoded directly to your backend server port to bypass Live Server 405 blocks
const API_BASE_URL = "http://localhost:5000";

function isValidString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parseAmount(priceText) {
  return parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;
}

function formatRupees(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function renderCheckoutPage() {
  const params = new URLSearchParams(window.location.search);
  const item =
    params.get("item") ||
    localStorage.getItem("selectedItem") ||
    "Unknown item";
  const priceText =
    params.get("price") || localStorage.getItem("selectedPrice") || "₹0";
  const basePrice = parseAmount(priceText);
  const deliveryCharge = basePrice > 0 ? 50 : 0;
  const taxAmount = Math.round(basePrice * 0.05);
  const orderId = generateOrderId();
  const totalAmount = basePrice + taxAmount + deliveryCharge;

  localStorage.setItem("selectedItem", item);
  localStorage.setItem("selectedPrice", priceText);

  document.getElementById("order-id").textContent = orderId;
  document.getElementById("delivery-date").textContent =
    getEstimatedDeliveryDate();
  document.getElementById("product-name").textContent = item;
  document.getElementById("subtotal-amount").textContent =
    formatRupees(basePrice);
  document.getElementById("tax-amount").textContent = formatRupees(taxAmount);
  document.getElementById("delivery-amount").textContent =
    formatRupees(deliveryCharge);
  document.getElementById("discount-amount").textContent = "-₹0";
  document.querySelector(".discount-row").classList.add("hidden");
  document.getElementById("total-amount").textContent =
    formatRupees(totalAmount);
  document.getElementById("pay-button-value").textContent =
    totalAmount.toLocaleString("en-IN");
  document.getElementById("pay-button-label").textContent =
    totalAmount.toLocaleString("en-IN");

  const shipping = loadShippingAddress();
  if (shipping) {
    document.getElementById("shipping-line").textContent =
      `${shipping.line1}, ${shipping.city}, ${shipping.state}, ${shipping.country}`;
    document.getElementById("shipping-city").textContent =
      `PIN: ${shipping.postal}`;
    document.getElementById("shipping-phone").textContent =
      `Phone: ${shipping.phone}`;
  }
}

function generateOrderId() {
  const prefix = "ORD";
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random}`;
}

function getEstimatedDeliveryDate() {
  const today = new Date();
  const delivery = new Date(today.setDate(today.getDate() + 5));
  const options = { day: "numeric", month: "short" };
  return delivery.toLocaleDateString("en-IN", options);
}

function renderPaymentMethodNote() {
  const checkedInput = document.querySelector(
    "input[name=payment-method]:checked",
  );
  const selected = checkedInput ? checkedInput.value : "card";
  const note = document.getElementById("payment-method-note");

  const messages = {
    card: "Card payments are secured with 256-bit encryption.",
    upi: "You will be redirected to your UPI app for instant checkout.",
    netbanking: "Choose your bank and complete payment on the bank gateway.",
    wallet: "Pay easily with popular wallets and instant cashback offers.",
    emi: "Select an eligible EMI plan during Razorpay checkout.",
  };

  if (note) {
    note.textContent =
      messages[selected] || "Select a method to see payment instructions.";
  }
}

function applyPromoCode() {
  const code = document.getElementById("promo-code").value.trim().toUpperCase();
  const basePrice = parseAmount(localStorage.getItem("selectedPrice") || "₹0");
  const deliveryCharge = basePrice > 0 ? 50 : 0;
  const taxAmount = Math.round(basePrice * 0.05);
  const promoMessage = document.getElementById("promo-message");

  const promoCodes = {
    SAVE10: {
      discount: Math.round(basePrice * 0.1),
      message: "Coupon applied! 10% off on subtotal.",
    },
    RAZORPAY5: {
      discount: 50,
      message: "Coupon applied! ₹50 off on your order.",
    },
  };

  let discount = 0;

  if (!code) {
    promoMessage.textContent = "Enter a coupon code.";
    promoMessage.style.color = "#d32f2f";
  } else if (promoCodes[code]) {
    discount = promoCodes[code].discount;
    promoMessage.textContent = promoCodes[code].message;
    promoMessage.style.color = "#2e7d32";
  } else {
    promoMessage.textContent = "Invalid coupon code. Try SAVE10 or RAZORPAY5.";
    promoMessage.style.color = "#d32f2f";
  }

  const totalAmount = basePrice + taxAmount + deliveryCharge - discount;
  const finalAmount = Math.max(totalAmount, 0);

  if (discount > 0) {
    document.querySelector(".discount-row").classList.remove("hidden");
    document.getElementById("discount-amount").textContent =
      `- ${formatRupees(discount)}`;
  } else {
    document.querySelector(".discount-row").classList.add("hidden");
    document.getElementById("discount-amount").textContent = "-₹0";
  }

  document.getElementById("total-amount").textContent =
    formatRupees(finalAmount);
  document.getElementById("pay-button-value").textContent =
    finalAmount.toLocaleString("en-IN");
  document.getElementById("pay-button-label").textContent =
    finalAmount.toLocaleString("en-IN");
}

async function createRazorpayOrder(amount) {
  const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amount }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const serverMessage =
      errorData.message ||
      errorData.error ||
      (errorData.code ? `Error code: ${errorData.code}` : null);
    throw new Error(
      serverMessage || "Unable to create Razorpay order. Check server logs.",
    );
  }

  const payload = await response.json();
  if (!payload.order || !payload.order.id) {
    throw new Error("Razorpay order response is invalid.");
  }

  return payload;
}

async function verifyRazorpayPayment(payload) {
  // FIX: Linked explicitly to match your backend route string endpoint precisely
  const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Payment verification failed on server.",
    );
  }

  return response.json();
}

async function handlePaymentSuccess(response) {
  if (
    !response.razorpay_payment_id ||
    !response.razorpay_order_id ||
    !response.razorpay_signature
  ) {
    showToast("❌ Payment response was incomplete. Please retry.");
    return;
  }

  showToast("🔎 Verifying payment...");
  try {
    const verification = await verifyRazorpayPayment(response);

    if (verification && verification.verified) {
      showToast("✅ Payment verified! Success.");
      showPaymentModal(
        "Payment completed",
        "Your payment has been completed successfully. Thank you for shopping with us.",
        true,
        () => {
          localStorage.removeItem("selectedItem");
          localStorage.removeItem("selectedPrice");
          window.location.href = "index.html";
        },
      );
    } else {
      showPaymentModal(
        "Payment failed",
        "Payment verification failed. Please contact support.",
        false,
      );
      showToast("❌ Payment verification failed.");
    }
  } catch (error) {
    console.error("verifyRazorpayPayment error:", error);
    showToast(`❌ ${error.message}`);
  }
}

function showPaymentModal(title, message, isSuccess = true, onClose = null) {
  const modal = document.getElementById("payment-modal");
  const status = document.getElementById("payment-modal-status");
  const modalTitle = document.getElementById("payment-modal-title");
  const modalMessage = document.getElementById("payment-modal-message");

  if (!modal || !status || !modalTitle || !modalMessage) return;

  status.textContent = isSuccess ? "Success" : "Failed";
  status.style.background = isSuccess ? "#e8f5e9" : "#ffebee";
  status.style.color = isSuccess ? "#2e7d32" : "#c62828";
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  window.paymentModalOnClose = onClose;
  modal.classList.add("active");
}

function closePaymentModal() {
  const modal = document.getElementById("payment-modal");
  if (!modal) return;

  modal.classList.remove("active");
  if (typeof window.paymentModalOnClose === "function") {
    const callback = window.paymentModalOnClose;
    window.paymentModalOnClose = null;
    setTimeout(callback, 150);
  }
}

async function startRazorpay() {
  const totalText = document.getElementById("total-amount").textContent || "₹0";
  const amountValue = parseAmount(totalText);

  // FIX: Generates dynamic fallback mock profiles if localStorage is blank during local sandbox tests
  const shipping = loadShippingAddress() || {
    name: "Guest Checkout User",
    phone: "9999999999",
    line1: "Plot No. 14, Tech Park Area",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postal: "400001",
  };

  if (amountValue <= 0) {
    showToast("❌ Cannot pay: invalid total amount.");
    return;
  }

  const checkedInput = document.querySelector(
    "input[name=payment-method]:checked",
  );
  const paymentMethod = checkedInput ? checkedInput.value : "card";
  const selectedItem = localStorage.getItem("selectedItem") || "Order Item";

  try {
    showToast("🔄 Creating payment order...");
    const orderData = await createRazorpayOrder(amountValue);
    const order = orderData.order;

    const options = {
      key: orderData.key_id,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "CodeAlpha Store",
      description: `Payment for ${selectedItem}`,
      order_id: order.id,
      image: "https://yourdomain.com/logo.png",
      handler: function (response) {
        if (
          !isValidString(response.razorpay_payment_id) ||
          !isValidString(response.razorpay_order_id) ||
          !isValidString(response.razorpay_signature)
        ) {
          showToast("❌ Payment response incomplete. Check transaction logs.");
          return;
        }
        handlePaymentSuccess(response);
      },
      prefill: {
        name: shipping.name || "",
        contact: shipping.phone || "",
      },
      notes: {
        shipping_address: `${shipping.line1}, ${shipping.city}, ${shipping.state}, ${shipping.country}`,
        payment_method: paymentMethod,
      },
      theme: {
        color: "#2D8CFF",
      },
      modal: {
        escape: true,
        ondismiss: function () {
          showToast("⚠️ Payment window closed. You can retry anytime.");
        },
      },
    };

    const instance = new Razorpay(options);

    instance.on("payment.failed", function (response) {
      console.error("Razorpay failure exception details:", response.error);
      showToast("❌ Payment processing dropped or canceled.");
    });

    instance.open();
  } catch (error) {
    console.error("startRazorpay runtime error:", error);
    showToast(`❌ ${error.message}`);
  }
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-alert";
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.5s ease";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 2500);
}
