# GWD Sports Ecosystem - Public Portal

The GWD Sports Ecosystem Portal is a high-performance, futuristic web application designed to map and display the growing network of sports academies, student athletes, and leagues in Hyderabad.

## Features & Architecture

### 1. High-Performance Ecosystem Map
Built using **Leaflet** with `canvas` rendering enabled to support thousands of data points without lagging.
- **Progressive Detail System**: To ensure smooth 60fps performance, the map dynamically scales the UI complexity based on zoom level:
  - **Zoom ≤ 13**: Fast, responsive clustering (using `MarkerClusterGroup`) that visually groups academies.
  - **Zoom 14–15**: Lightweight static rings and core dots (zero CSS animations running) to minimize DOM overhead when many nodes are visible.
  - **Zoom ≥ 16**: Full animated pulse rings and glowing hexagons. Animations are computationally disabled at lower zoom levels and only activate when a small number of markers are in view.

### 2. Screen-Space Academy Details Panel (New UI Update)
We completely removed traditional in-map popups (which often cause jarring panning and zooming) and replaced them with a responsive **Screen-Space UI**:
- **Desktop**: A sleek, dark-glass sidebar slides in from the right when an academy is clicked.
- **Mobile**: Intelligently adapts to a "bottom sheet" that slides up, making touch interactions much more ergonomic.
- **Design Aesthetic**: Utilizes glassmorphism (`backdrop-filter`), rich deep tones, and subtle neon red borders to maintain a premium, futuristic look.

### 3. Dynamic Data Integration
- **MongoDB Backend**: Real-world coordinates and academy data (including star players, teams, student counts, and badges) are fetched via a custom API route (`/api/academies`).
- **Pagination & Leaderboards**: Renders a fast, paginated leaderboard with progress bars mapped to student enrollment counts.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Ensure your `.env` file contains the MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gwd-sports?retryWrites=true&w=majority
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

To build the application for production deployment:

```bash
npm run build
npm start
```
