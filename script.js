// Language switching functionality
document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("languageSelect")
  const body = document.body

  // Set initial language and update content immediately
  updateLanguage("en")

  // Language switcher event listener
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
    languageSelect.value = lang
  }

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

  mobileMenuToggle.addEventListener("click", () => {
    nav.style.display = nav.style.display === "block" ? "none" : "block"
  })

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
