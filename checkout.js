// Checkout functionality
class Checkout {
  constructor() {
    this.cart = window.cart || new window.ShoppingCart()
    this.init()
  }

  init() {
    this.updateLanguage("en")
    this.renderOrderSummary()
    this.setupEventListeners()
    this.initializePayPal()
  }

  updateLanguage(lang) {
    document.body.setAttribute("data-lang", lang)

    const elementsWithLang = document.querySelectorAll("[data-en], [data-sq]")
    elementsWithLang.forEach((element) => {
      const text = element.getAttribute(`data-${lang}`)
      if (text) {
        if (element.tagName === "INPUT" && element.type === "submit") {
          element.value = text
        } else if (element.tagName === "BUTTON") {
          element.textContent = text
        } else if (element.tagName === "LABEL") {
          element.textContent = text
        } else {
          element.textContent = text
        }
      }
    })

    document.getElementById("languageSelect").value = lang
  }

  renderOrderSummary() {
    const cartData = this.cart.getCartData()
    const orderItemsContainer = document.getElementById("orderItems")

    if (orderItemsContainer) {
      orderItemsContainer.innerHTML = cartData.items
        .map(
          (item) => `
        <div class="order-item">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>Qty: ${item.quantity}</p>
          </div>
          <div class="item-total">${Number.parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity} den</div>
        </div>
      `,
        )
        .join("")
    }

    // Update totals
    const orderSubtotal = document.getElementById("orderSubtotal")
    const orderShipping = document.getElementById("orderShipping")
    const orderTotal = document.getElementById("orderTotal")

    if (orderSubtotal) orderSubtotal.textContent = `${cartData.subtotal} den`
    if (orderShipping) orderShipping.textContent = `${cartData.shipping} den`
    if (orderTotal) orderTotal.textContent = `${cartData.total} den`
  }

  setupEventListeners() {
    // Language switcher
    const languageSelect = document.getElementById("languageSelect")
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        this.updateLanguage(e.target.value)
      })
    }

    // Form validation
    const deliveryForm = document.getElementById("deliveryForm")
    if (deliveryForm) {
      deliveryForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.validateForm()
      })
    }
  }

  validateForm() {
    const form = document.getElementById("deliveryForm")
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Basic validation
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "postalCode", "country"]
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      const currentLang = document.body.getAttribute("data-lang")
      const message =
        currentLang === "en"
          ? "Please fill in all required fields."
          : "Ju lutemi plotësoni të gjitha fushat e kërkuara."
      alert(message)
      return false
    }

    return true
  }

  initializePayPal() {
    const cartData = this.cart.getCartData()

    if (cartData.items.length === 0) {
      window.location.href = "cart.html"
      return
    }

    // Convert MKD to USD for PayPal (approximate rate: 1 USD = 60 MKD)
    const totalUSD = (cartData.total / 60).toFixed(2)

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          if (!this.validateForm()) {
            return Promise.reject("Form validation failed")
          }

          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalUSD,
                  currency_code: "USD",
                },
                description: "USTOP JEANS Order",
              },
            ],
          })
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            this.processPayment(details)
          })
        },
        onError: (err) => {
          console.error("PayPal Error:", err)
          const currentLang = document.body.getAttribute("data-lang")
          const message =
            currentLang === "en" ? "Payment failed. Please try again." : "Pagesa dështoi. Ju lutemi provoni përsëri."
          alert(message)
        },
      })
      .render("#paypal-button-container")
  }

  processPayment(paymentDetails) {
    // Store order details
    const orderData = {
      orderNumber: `UST-${Date.now()}`,
      items: this.cart.getCartData().items,
      total: this.cart.getCartData().total,
      paymentMethod: "PayPal",
      paymentId: paymentDetails.id,
      customerInfo: this.getCustomerInfo(),
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("lastOrder", JSON.stringify(orderData))

    // Clear cart
    this.cart.clearCart()

    // Redirect to confirmation
    window.location.href = "confirmation.html"
  }

  getCustomerInfo() {
    const form = document.getElementById("deliveryForm")
    const formData = new FormData(form)
    return Object.fromEntries(formData)
  }
}

// Initialize checkout
document.addEventListener("DOMContentLoaded", () => {
  new Checkout()
})
