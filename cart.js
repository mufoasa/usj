// Shopping Cart functionality
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || []
    this.init()
  }

  init() {
    this.updateCartCount()
    this.renderCartItems()
    this.updateCartSummary()
    this.setupEventListeners()

    // Initialize language
    this.updateLanguage("en")
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
    this.renderCartItems()
    this.updateCartSummary()
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId)
    this.saveCart()
    this.updateCartCount()
    this.renderCartItems()
    this.updateCartSummary()
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      this.saveCart()
      this.updateCartCount()
      this.renderCartItems()
      this.updateCartSummary()
    }
  }

  updateCartCount() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
    const cartCountElements = document.querySelectorAll("#cartCount, .cart-count")
    cartCountElements.forEach((element) => {
      element.textContent = totalItems
    })
  }

  renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems")
    const emptyCart = document.getElementById("emptyCart")

    if (!cartItemsContainer) return

    if (this.items.length === 0) {
      cartItemsContainer.style.display = "none"
      if (emptyCart) emptyCart.style.display = "block"
      return
    }

    if (emptyCart) emptyCart.style.display = "none"
    cartItemsContainer.style.display = "block"

    cartItemsContainer.innerHTML = this.items
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h4 class="item-name">${item.name}</h4>
          <p class="item-price">${item.price} den</p>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `,
      )
      .join("")
  }

  updateCartSummary() {
    const subtotal = this.items.reduce((sum, item) => {
      const price = Number.parseInt(item.price.replace(/[^\d]/g, ""))
      return sum + price * item.quantity
    }, 0)

    const shipping = this.items.length > 0 ? 200 : 0
    const total = subtotal + shipping

    const subtotalElement = document.getElementById("subtotal")
    const shippingElement = document.getElementById("shipping")
    const totalElement = document.getElementById("total")
    const checkoutBtn = document.getElementById("checkoutBtn")

    if (subtotalElement) subtotalElement.textContent = `${subtotal} den`
    if (shippingElement) shippingElement.textContent = `${shipping} den`
    if (totalElement) totalElement.textContent = `${total} den`

    if (checkoutBtn) {
      checkoutBtn.disabled = this.items.length === 0
    }
  }

  setupEventListeners() {
    // Language switcher
    const languageSelect = document.getElementById("languageSelect")
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        this.updateLanguage(e.target.value)
      })
    }

    // Cart item interactions
    document.addEventListener("click", (e) => {
      const productId = e.target.dataset.id

      if (e.target.classList.contains("decrease")) {
        const item = this.items.find((item) => item.id === productId)
        if (item && item.quantity > 1) {
          this.updateQuantity(productId, item.quantity - 1)
        }
      }

      if (e.target.classList.contains("increase")) {
        const item = this.items.find((item) => item.id === productId)
        if (item) {
          this.updateQuantity(productId, item.quantity + 1)
        }
      }

      if (e.target.classList.contains("remove-btn")) {
        this.removeItem(productId)
      }
    })

    // Quantity input changes
    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("quantity-input")) {
        const productId = e.target.dataset.id
        const quantity = Number.parseInt(e.target.value)
        if (quantity > 0) {
          this.updateQuantity(productId, quantity)
        }
      }
    })

    // Checkout button
    const checkoutBtn = document.getElementById("checkoutBtn")
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (this.items.length > 0) {
          window.location.href = "checkout.html"
        }
      })
    }
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

  clearCart() {
    this.items = []
    this.saveCart()
    this.updateCartCount()
    this.renderCartItems()
    this.updateCartSummary()
  }
}

// Initialize cart
const cart = new ShoppingCart()

// Make cart available globally
window.cart = cart
