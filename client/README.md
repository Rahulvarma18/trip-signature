# TripSignature — Frontend (React + Tailwind)

Frontend-only build for now. The inquiry form validates and "submits" locally
(logs the payload to the console and shows the success screen) — no API calls yet.
When you're ready to wire up the backend, see the note at the bottom.

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── TrustStrip.jsx
│   │   ├── Packages.jsx          category tabs + destination grid
│   │   ├── DestinationCard.jsx
│   │   ├── WhyUs.jsx
│   │   ├── InquirySection.jsx    maroon promo panel + form wrapper
│   │   ├── InquiryForm.jsx       validated form, captcha, success state
│   │   ├── Testimonials.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── destinations.js       single source of truth for all packages
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
└── package.json
```

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for production

```bash
npm run build       # outputs dist/
npm run preview     # preview the production build locally
```

## Editing packages & destinations

Everything in the Packages tabs, the Destination dropdown, and the Footer links comes from
one file: `src/data/destinations.js`. Add, remove, or rename a destination there and it
updates everywhere automatically.

## Design tokens

Colors, fonts and shadows live in `tailwind.config.js` under `theme.extend` (maroon / gold /
ivory palette, Cormorant Garamond + Jost typefaces).

## Reconnecting the backend later

`InquiryForm.jsx` has a clearly marked block in `handleSubmit` where the console.log currently
sits — swap it for a real request (e.g. `axios.post('/api/inquiries', payload)` or `fetch`)
once an API is ready, and handle the error case to show a message if the request fails.
