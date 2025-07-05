// Update the script.js file to include the ShoppingCart class and proper integration

// Add the ShoppingCart class at the beginning of the file
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || []
    this.updateCartCount()
  }

  addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    }

    this.saveCart()
    this.updateCartCount()
  }

  updateCartCount() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
    const cartCountElements = document.querySelectorAll("#cartCount, .cart-count")
    cartCountElements.forEach((element) => {
      element.textContent = totalItems
    })
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items))
  }

  getCartData() {
    return {
      items: this.items,
      subtotal: this.items.reduce((sum, item) => {
        const price = Number.parseInt(item.price.replace(/[^\d]/g, ""))
        return sum + price * item.quantity
      }, 0),
      shipping: this.items.length > 0 ? 200 : 0,
      total:
        this.items.reduce((sum, item) => {
          const price = Number.parseInt(item.price.replace(/[^\d]/g, ""))
          return sum + price * item.quantity
        }, 0) + (this.items.length > 0 ? 200 : 0),
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId)
    this.saveCart()
    this.updateCartCount()
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      this.saveCart()
      this.updateCartCount()
    }
  }

  clearCart() {
    this.items = []
    this.saveCart()
    this.updateCartCount()
  }
}

// Initialize cart globally
const cart = new ShoppingCart()
window.cart = cart

// Language switching functionality
document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("languageSelect")
  const body = document.body

  // Set initial language and update content immediately
  updateLanguage("en")

  // Language switcher event listener
  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      const selectedLang = this.value
      updateLanguage(selectedLang)
    })
  }

  function updateLanguage(lang) {
    body.setAttribute("data-lang", lang)

    // Update all elements with data attributes
    const elementsWithLang = document.querySelectorAll("[data-en], [data-sq]")

    elementsWithLang.forEach((element) => {
      const text = element.getAttribute(`data-${lang}`)
      if (text) {
        // Handle different element types
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

    // Update language selector
    if (languageSelect) {
      languageSelect.value = lang
    }
  }

  // Add to cart functionality for homepage products
  const productButtons = document.querySelectorAll(".product-btn")
  productButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card")
      const productName = productCard.querySelector(".product-name").textContent
      const productPrice = productCard.querySelector(".product-price").textContent
      const productImage = productCard.querySelector(".product-image img").src

      // Create product object
      const product = {
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: productName,
        price: productPrice,
        image: productImage,
      }

      // Add to cart
      cart.addItem(product)

      // Get current language for success message
      const currentLang = body.getAttribute("data-lang")
      const message = currentLang === "en" ? `${productName} added to cart!` : `${productName} u shtua në shportë!`

      // Visual feedback
      const originalText = button.textContent
      button.textContent = currentLang === "en" ? "Added!" : "U Shtua!"
      button.style.background = "#10b981"

      setTimeout(() => {
        button.textContent = originalText
        button.style.background = "#1e3a8a"
      }, 2000)

      // Show success message
      alert(message)
    })
  })

  // Rest of the existing functionality...
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetSection.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Contact form submission
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get current language
      const currentLang = body.getAttribute("data-lang")

      // Show success message based on language
      const successMessage =
        currentLang === "en"
          ? "Thank you for your message! We will get back to you soon."
          : "Faleminderit për mesazhin tuaj! Do t'ju përgjigjemi së shpejti."

      alert(successMessage)

      // Reset form
      this.reset()
    })
  }

  // Add scroll effect to header
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")

    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.95)"
      header.style.backdropFilter = "blur(10px)"
    } else {
      header.style.background = "#fff"
      header.style.backdropFilter = "none"
    }
  })

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const nav = document.querySelector(".nav")

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener("click", () => {
      nav.style.display = nav.style.display === "block" ? "none" : "block"
    })
  }

  // Product card hover effects
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })
})
