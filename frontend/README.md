# Ajo Frontend

The landing page and web application for **Ajo** — a digital platform for rotating savings (Ajo/Esusu) groups.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page.

## Tech Stack

- **Next.js** 16 (App Router)
- **React** 19
- **Tailwind CSS** v4
- **TypeScript**
- **Poppins** (Google Fonts)

## Build

```bash
npm run build
```

## Project Structure

```
src/
  app/
    components/   # Landing page sections
    layout.tsx    # Root layout with Poppins font
    page.tsx      # Landing page composition
    globals.css   # Tailwind theme + Ajo design tokens
public/           # Static assets (logo, icons, mockups)
```

## Design Tokens

- **Primary:** `#0F9D58`
- **Grey:** `#808080`
- **Font:** Poppins (Medium 500, SemiBold 600, Bold 700)
