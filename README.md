# Aventura Tours and Travel

Static website for Aventura Tours and Travel.

## Project structure

```text
.
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── pages/
│   ├── about.html
│   ├── booking.html
│   ├── contact.html
│   ├── services.html
│   ├── tour-details.html
│   └── tours.html
└── assets/
    ├── css/
    │   └── main.css
    ├── js/
    │   ├── main.js
    │   ├── tours.js
    │   └── booking.js
    ├── icons/
    ├── images/
    │   ├── hero/
    │   ├── team/
    │   └── tours/
    └── logo/
        ├── logo.png
        └── favicon.png
```

The shared header and footer are registered as `<site-header>` and `<site-footer>` custom elements in `assets/js/main.js`. Add those elements to a page and include the script to reuse the same navigation and footer. The supplied animal-head artwork is used in the shared header and footer as `assets/logo/logo.png`; the favicon and web-app icon use the matching `assets/logo/favicon.png`. All project styles are in `assets/css/main.css`.

The homepage highlights Ugandan communities, local dishes, cultural dates, and mountain and waterfall destinations.

The tours page has client-side search, category, and maximum-price filters. The booking page validates inputs and prepares an email inquiry; it does not submit to a booking server.

Tour prices are displayed in Ugandan shillings (UGX). Prices shown reflect a 30% reduction from the converted UGX starting prices; keep tour-card data values, displayed prices, itinerary/service prices, and booking estimates in sync when changing rates or prices.

Before publishing, confirm the public hostname in `robots.txt` and `sitemap.xml`. They currently use `aventuratoursandtravels.com` as the site's domain.

## Preview locally

From the project root, start a local server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`. The homepage is `index.html`; supporting pages are linked from the shared navigation. A local Python server may show `404.html` as a regular file rather than using it for missing routes; the deployed static host must be configured to use it as its 404 page.
