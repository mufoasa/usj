// Confirmation page functionality
class OrderConfirmation {
  constructor() {
    this.init()
  }

  init() {
    this.updateLanguage("en")
    this.displayOrderDetails()
    this.setupEventListeners()
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

  displayOrderDetails() {
    const orderData = JSON.parse(localStorage.getItem("lastOrder"))

    if (!orderData) {
      window.location.href = "index.html"
      return
    }

    // Update order details
    document.getElementById("orderNumber").textContent = orderData.orderNumber
    document.getElementById("paymentMethod").textContent = orderData.paymentMethod
    document.getElementById("totalAmount").textContent = `${orderData.total} den`
  }

  setupEventListeners() {
    // Language switcher
    const languageSelect = document.getElementById("languageSelect")
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        this.updateLanguage(e.target.value)
      })
    }
  }
}

// Initialize confirmation page
document.addEventListener("DOMContentLoaded", () => {
  new OrderConfirmation()
})
