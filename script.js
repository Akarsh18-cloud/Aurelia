const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

function closeMenu() {
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    closeMenu();
    navToggle.focus();
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const pricing = {
  ugc: {
    label: "UGC Ads",
    title: "Creator-style ads for fast campaign testing.",
    description: "Start lean, test creative angles, and scale the winners without mixing services into one generic package.",
    cards: [["Starter", "&#8377;999"], ["Growth", "&#8377;2,499"], ["Scale", "&#8377;4,499"]]
  },
  commercials: {
    label: "Product Commercials",
    title: "Premium product videos for launch moments.",
    description: "Built for brands that need sharper product storytelling, stronger visual polish, and campaign-ready edits.",
    cards: [["Starter", "&#8377;1,999"], ["Growth", "&#8377;4,499"], ["Custom Campaign", "Custom Quote"]]
  },
  websites: {
    label: "Website Design",
    title: "Modern pages that make your offer easy to choose.",
    description: "Landing pages, business websites, and premium sites designed around clarity, trust, and conversion.",
    cards: [["Landing Page", "&#8377;4,999"], ["Business Website", "&#8377;9,999"], ["Premium Website", "&#8377;19,999"]]
  },
  carousels: {
    label: "Carousel Design",
    title: "Swipe-ready content for social authority.",
    description: "Clean, structured carousel sets for education, product offers, launches, and brand storytelling.",
    cards: [["5 Carousels", "&#8377;999"], ["10 Carousels", "&#8377;1,799"], ["20 Carousels", "&#8377;2,999"]]
  },
  reels: {
    label: "Reels & Shorts",
    title: "Short videos for consistent brand visibility.",
    description: "Fast, polished vertical clips for Instagram Reels, YouTube Shorts, product education, and campaigns.",
    cards: [["5 Videos", "&#8377;1,499"], ["10 Videos", "&#8377;2,799"], ["20 Videos", "&#8377;4,999"]]
  },
  social: {
    label: "Social Media Management",
    title: "Monthly creative support for consistent growth.",
    description: "Strategy, content planning, post design, and creative management for active brands.",
    cards: [["Basic", "&#8377;4,999/month"], ["Growth", "&#8377;9,999/month"], ["Custom", "Custom Quote"]]
  }
};

const tabButtons = document.querySelectorAll(".pricing-tabs button");
const pricingLabel = document.querySelector("#pricingLabel");
const pricingTitle = document.querySelector("#pricingTitle");
const pricingDescription = document.querySelector("#pricingDescription");
const priceGrid = document.querySelector("#priceGrid");

function renderPricing(key) {
  const data = pricing[key];
  pricingLabel.textContent = data.label;
  pricingTitle.textContent = data.title;
  pricingDescription.textContent = data.description;
  priceGrid.innerHTML = data.cards.map(([name, price], index) => `
    <article class="price-card ${index === 1 ? "popular" : ""}">
      <small>${name}</small>
      <strong>${formatPrice(price)}</strong>
      <p>Starting from</p>
      <a class="button ${index === 1 ? "button-orange" : "button-dark"}" href="#contact">Get Quote</a>
    </article>
  `).join("");
}

function formatPrice(price) {
  if (price.includes("/month")) {
    return price.replace("/month", "<span>/month</span>");
  }

  if (price === "Custom Quote") {
    return "Custom<span>Quote</span>";
  }

  return price;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.remove("active"));
    tabButtons.forEach((item) => item.setAttribute("aria-selected", "false"));
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    renderPricing(button.dataset.category);
  });
});

renderPricing("ugc");

document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const form = document.querySelector(".contact-form");
const note = document.querySelector(".form-note");
const submitButton = form.querySelector(".form-submit");
const submitLabel = form.querySelector(".submit-label");
const formFields = form.querySelectorAll("input:not([type='hidden']):not(.bot-field), select, textarea");
const errorActions = form.querySelector(".form-error-actions");
const successCard = document.querySelector(".success-card");
let isSubmitting = false;

formFields.forEach((field) => {
  field.addEventListener("input", () => field.classList.remove("field-invalid"));
  field.addEventListener("change", () => field.classList.remove("field-invalid"));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isSubmitting) return;

  note.className = "form-note full";
  note.textContent = "";
  errorActions.hidden = true;

  if (!form.checkValidity()) {
    formFields.forEach((field) => {
      field.classList.toggle("field-invalid", !field.checkValidity());
    });
    note.classList.add("error");
    note.textContent = "Please complete all fields with valid details.";
    form.querySelector(":invalid")?.focus();
    return;
  }

  const accessKey = form.elements.access_key.value.trim();

  // WEB3FORMS SETUP: Paste your real access key in the hidden access_key field in index.html.
  if (accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    note.classList.add("error");
    note.textContent = "Form setup is incomplete. Add your Web3Forms access key before publishing.";
    return;
  }

  isSubmitting = true;
  submitButton.disabled = true;
  submitButton.classList.add("is-loading");
  submitButton.setAttribute("aria-busy", "true");
  submitLabel.textContent = "Sending...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Web3Forms could not send the message.");
    }

    form.reset();
    form.hidden = true;
    successCard.hidden = false;
    successCard.focus({ preventScroll: true });
  } catch (error) {
    note.classList.add("error");
    note.textContent = "Something went wrong. Please try again in a few minutes.";
    errorActions.hidden = false;
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");
    submitButton.removeAttribute("aria-busy");
    submitLabel.textContent = "Send Message";
  }
});
