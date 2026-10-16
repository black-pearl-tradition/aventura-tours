(() => {
  const inPagesDirectory = /\/pages\/[^/]+$/i.test(window.location.pathname);
  const root = inPagesDirectory ? "../" : "./";

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const activePage = this.getAttribute("active") || "";
      const isHome = activePage === "home";
      const pages = [
        ["home", "Home", `${root}index.html`],
        ["tours", "Tours", `${root}pages/tours.html`],
        ["services", "Services", `${root}pages/services.html`],
        ["about", "About us", `${root}pages/about.html`],
        ["booking", "Book now", `${root}pages/booking.html`],
        ["contact", "Contact", `${root}pages/contact.html`],
      ];
      const links = pages.map(([key, label, href]) =>
        `<li><a href="${href}"${key === activePage ? ' aria-current="page"' : ""}>${label}</a></li>`
      ).join("");

      this.innerHTML = `
        <header class="site-header${isHome ? " home-header" : ""}">
          <a class="site-brand${isHome ? " home-brand" : ""}" href="${root}index.html" aria-label="Aventura Tours and Travel home">
            <img src="${root}assets/logo/logo.png" alt="" />
            <span>Aventura<small>Tours &amp; Travel</small></span>
          </a>
          <button class="site-menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="Open navigation menu">
            <span></span><span></span><span></span>
          </button>
          <nav class="site-nav" id="site-navigation" aria-label="Main navigation">
            <ul>${links}</ul>
          </nav>
          <a class="site-header-cta${isHome ? " header-cta" : ""}" href="${root}pages/booking.html"${activePage === "booking" ? ' aria-current="page"' : ""}>Plan your trip <span aria-hidden="true">↗</span></a>
        </header>`;

      const header = this.querySelector(".site-header");
      const toggle = this.querySelector(".site-menu-toggle");
      const closeMenu = () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
      };

      toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      });

      this.querySelector(".site-nav").addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
          closeMenu();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
      });

      document.addEventListener("click", (event) => {
        if (event.target instanceof Node && !this.contains(event.target)) closeMenu();
      });
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const email = "info@aventuratoursandtravels.com";
      this.innerHTML = `
        <footer class="site-footer${document.body.classList.contains("home-page") ? " home-footer" : ""}">
          <div class="site-footer-main">
            <a class="site-brand footer-brand" href="${root}index.html">
              <img src="${root}assets/logo/logo.png" alt="" />
              <span>Aventura<small>Tours &amp; Travel</small></span>
            </a>
            <p class="site-footer-tagline">Local hearts. Unforgettable journeys.</p>
            <nav class="site-footer-links" aria-label="Footer navigation">
              <a href="${root}pages/tours.html">Explore tours</a>
              <a href="${root}pages/about.html">About Aventura</a>
              <a href="${root}pages/services.html">Our services</a>
              <a href="${root}pages/booking.html">Plan your trip</a>
              <a href="${root}pages/contact.html">Get in touch</a>
            </nav>
            <a class="site-footer-email" href="mailto:${email}">${email}</a>
            <nav class="site-social-links" aria-label="Social media">
              <a href="https://www.instagram.com/AventuraToursandTravelug/" target="_blank" rel="noopener noreferrer" aria-label="Follow Aventura on Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="17.5" cy="6.7" r="1.1" fill="currentColor" />
                </svg>
              </a>
              <a href="https://wa.me/256772891280" target="_blank" rel="noopener noreferrer" aria-label="Message Aventura on WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M20.2 11.7a8.1 8.1 0 0 1-12 7.1l-4.4 1.1 1.2-4.3a8.1 8.1 0 1 1 15.2-3.9Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
                  <path d="M9 8.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.5.8 1.2 1.5 2.1 2 .3.2.5.2.7-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.1-.7 1.5-.5.4-1.1.7-1.9.6-1.1-.1-2.5-.7-3.8-1.8-1.6-1.4-2.7-3.1-3-4.2-.3-1 .1-1.8.5-2.1Z" fill="currentColor" />
                </svg>
              </a>
            </nav>
          </div>
          <div class="site-footer-bottom">
            <span>&copy; ${new Date().getFullYear()} Aventura Tours and Travel</span>
            <span>Made for the love of Uganda.</span>
          </div>
        </footer>`;
    }
  }

  if (!customElements.get("site-header")) customElements.define("site-header", SiteHeader);
  if (!customElements.get("site-footer")) customElements.define("site-footer", SiteFooter);
})();
