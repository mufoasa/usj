// Products page functionality
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const productCards = document.querySelectorAll(".product-card")
  const languageSelect = document.getElementById("languageSelect")
  const body = document.body

  // Define ShoppingCart class if not already defined
  class ShoppingCart {
    constructor() {
      this.items = []
    }

    addItem(product) {
      this.items.push(product)
      console.log(`${product.name} added to cart!`)
    }
  }

  // Initialize language
  updateLanguage("en")

  // Language switcher
  languageSelect.addEventListener("change", function () {
    const selectedLang = this.value
    updateLanguage(selectedLang)
  })

  function updateLanguage(lang) {
    body.setAttribute("data-lang", lang)

    // Update all elements with data attributes
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

    languageSelect.value = lang
  }

  // Product filtering
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      const category = button.getAttribute("data-category")

      // Filter products
      productCards.forEach((card) => {
        if (category === "all") {
          card.classList.remove("hidden")
          card.style.display = "block"
        } else {
          const cardCategories = card.getAttribute("data-category")
          if (cardCategories && cardCategories.includes(category)) {
            card.classList.remove("hidden")
            card.style.display = "block"
          } else {
            card.classList.add("hidden")
            card.style.display = "none"
          }
        }
      })

      // Add animation effect
      setTimeout(() => {
        const visibleCards = document.querySelectorAll(".product-card:not(.hidden)")
        visibleCards.forEach((card, index) => {
          card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`
        })
      }, 100)
    })
  })

  // Quick view functionality
  const quickViewButtons = document.querySelectorAll(".quick-view")

  quickViewButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()

      const productCard = button.closest(".product-card")
      const productName = productCard.querySelector(".product-name").textContent
      const productPrice = productCard.querySelector(".product-price").textContent

      // Get current language for alert message
      const currentLang = body.getAttribute("data-lang")
      const message =
        currentLang === "en"
          ? `Quick view for: ${productName} - ${productPrice}`
          : `Shiko shpejt për: ${productName} - ${productPrice}`

      alert(message)
    })
  })

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll(".product-btn")

  // Shopping cart integration
  const cart = window.cart || new ShoppingCart()

  // Update the add to cart functionality
  addToCartButtons.forEach((button) => {
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
      button.textContent = currentLang === "en" ? "Added!" : "U Shtua!"
      button.style.background = "#10b981"

      setTimeout(() => {
        button.textContent = currentLang === "en" ? "Add to Cart" : "Shto në Shportë"
        button.style.background = "#1e3a8a"
      }, 2000)

      // Show success message
      alert(message)
    })
  })

  // Smooth scroll for navigation links
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
})

// Add CSS animation keyframes
const style = document.createElement("style")
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
document.head.appendChild(style)
