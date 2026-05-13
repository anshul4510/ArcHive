# ArcHive | Global Architecture Repository

<div align="center">
  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="ArcHive Hero" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
  
  [![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer)](https://www.framer.com/motion/)
  
  **"Where Structure Meets Vision"**
</div>

---

## 🏛️ Project Vision
ArcHive is a premium digital preservation platform and collaborative vault for the architectural world. Functioning as a **"GitHub for Architects"**, it provides a space where blueprints, structural concepts, and visionary designs—ranging from contemporary brutalism to organic modernism—are indexed, forked, and celebrated.

ArcHive isn't just a portfolio; it's a global infrastructure for architectural intelligence.

---

## ✨ Core Features

### 🔍 Discovery Engine (Projects Feed)
A highly sophisticated filtering system that allows users to traverse the global repository based on typology, scale, and materiality.
- **Multi-Category Navigation:** Filter by Residential, Commercial, Heritage, and more.
- **Dynamic View Modes:** Toggle between editorial Grid, detailed List, and technical Compact views.
- **Metadata Transparency:** Every project card displays key technical data points (Location, Year, Area) at a glance.

### 🌓 Intelligent Navbar (Theme Detection)
The navigation system utilizes a sophisticated viewport-based detection algorithm to ensure 100% legibility across content transitions.
- **Contrast Awareness:** Automatically switches between `light` (black text/blur) and `dark` (white text/glass) themes depending on the background brightness of the current section.
- **Smooth Interpolation:** Transitions occur with calibrated easing to maintain the high-end feel.

### 📐 Project Detail Ecosystem
A deep-dive interface designed for architectural scrutiny.
- **Technical Sidebar:** Sticky container providing author verification, license data, and structural statistics.
- **Interactive Gallery:** High-resolution asset viewer with staggered animations.
- **Asset Vault:** A dedicated section for downloading blueprints, 3D models (DWG/ZIP), and high-fidelity renders.

### 🎨 Design Motif & Aesthetics
- **Hex Motif:** A recurring hexagonal grid (the Hive) representing structural stability and collective intelligence.
- **Custom Cursor:** A gold hexagonal tracking element that adds a layer of interactivity to the desktop experience.
- **Premium Typography:** A curated hierarchy featuring *Cinzel* for monumental headers and *Cormorant Garamond* for editorial elegance.

---

## 🎨 Design System Specifications

### Color Palette
| Token | HEX | Usage |
| :--- | :--- | :--- |
| **Primary BG** | `#F5F3EF` | Main off-white canvas/editorial sections |
| **Dark BG** | `#0E0E0C` | Hero sections and footer |
| **Accent Gold** | `#C8A96A` | Brand identity, icons, and primary CTAs |
| **Accent Dim** | `#A8894A` | Hover states and secondary indicators |
| **Text Primary**| `#1A1A1A` | High-contrast body copy |
| **Text Muted** | `#6B6860` | Editorial descriptions and labels |

### Typography Hierarchy
- **H1 - H2:** `Cinzel` (Monumental, Structural Serif)
- **H3 - H4:** `Cormorant Garamond` (Elegant Editorial Serif)
- **Body:** `DM Sans` (Clean Modern Sans-Serif)
- **Data/UI:** `Space Mono` (Technical Monospace)

---

## 🚀 Technical Architecture

### Stack Components
- **Framework:** [React 19](https://react.dev/) (Modern hook-based architecture)
- **Build Tool:** [Vite](https://vitejs.dev/) (Ultra-fast HMR and bundling)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) (Using a custom design system token map)
- **Animation Engine:** [Framer Motion](https://www.framer.com/motion/) (Hardware-accelerated transitions)
- **Iconography:** [Lucide React](https://lucide.dev/) (Semantic SVG icons)

### Directory Structure
```text
src/
├── components/     # Reusable UI elements (Navbar, HexPattern, etc.)
├── data/           # Mock data and project repositories
├── pages/          # Full-page components (Home, Projects, ProjectDetail)
├── assets/         # Global styles and static resources
└── App.jsx         # Root component with routing and global states
```

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anshul4510/ArcHive.git
   cd ArcHive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🛤️ Roadmap
- [ ] **User Authentication:** Architecture profile management.
- [ ] **Design Forking:** Ability to create personal versions of public blueprints.
- [ ] **Collaborative Annotations:** Live structural feedback on project renders.
- [ ] **3D Viewer Integration:** Embedded Three.js viewer for DWG/OBJ assets.

---

<div align="center">
  <p>© 2026 ArcHive Global Architecture Repository. All rights reserved.</p>
</div>
