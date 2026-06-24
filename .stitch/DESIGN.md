---
name: Kinetic Precision
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#161d1f'
  surface-container: '#1a2123'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2f3638'
  on-surface: '#dce4e6'
  on-surface-variant: '#bac9cd'
  inverse-surface: '#dce4e6'
  inverse-on-surface: '#2a3233'
  outline: '#859397'
  outline-variant: '#3b494c'
  surface-tint: '#00daf8'
  primary: '#baf2ff'
  on-primary: '#00363f'
  primary-container: '#00e0ff'
  on-primary-container: '#005f6d'
  inverse-primary: '#006877'
  secondary: '#c4c6cc'
  on-secondary: '#2d3135'
  secondary-container: '#46494e'
  on-secondary-container: '#b6b8be'
  tertiary: '#ffe6b6'
  on-tertiary: '#3f2e00'
  tertiary-container: '#fec42e'
  on-tertiary-container: '#6f5200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a5eeff'
  primary-fixed-dim: '#00daf8'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#e0e2e8'
  secondary-fixed-dim: '#c4c6cc'
  on-secondary-fixed: '#181c20'
  on-secondary-fixed-variant: '#44474b'
  tertiary-fixed: '#ffdf9d'
  tertiary-fixed-dim: '#f7be27'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#0d1516'
  on-background: '#dce4e6'
  surface-variant: '#2f3638'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
---

# Design System: Flow Force Digital Showroom

## 1. Visual Theme & Atmosphere
The Flow Force design system embodies a high-torque engineering aesthetic where "Apple-inspired minimalism" meets "Tesla-style industrial storytelling." It communicates absolute authority, precision, and heavy physical capability. The visual space is moody and focused, avoiding decorative clutter to ensure the physical hardware stands out as the ultimate hero.

The visual style is characterized by a blend of **Glassmorphism** and **Cold Industrial Minimalism**. It utilizes deep charcoal and obsidian canvases, accented with glowing, high-energy instrumentation fills mimicking real-time mechanical control boards. Every element—from borders to grids—feels like a calibrated instrument.

## 2. Color Palette & Roles

### Primary Foundation
- **Obsidian Dark (#0d1516)**: Main canvas background, establishing a cleanroom ambient atmosphere.
- **Surface Carbon Low (#161d1f)**: Used for layout divisions and card backdrops, offering a subtle lift for depth.
- **Surface Carbon (#1a2123)**: Standard panel elements and input backgrounds.

### Accent & Interactive
- **Electric Cyan (#00e0ff)**: The primary action cue. Represents pressurized flow, active states, and system power.
- **Technical Gold (#d4af37)**: Warm bronze/gold accent used for joint wheel valve handles, highlighting critical manual control overrides.
- **Indicator Red (#d9534f)**: Used for warning indicators, gauge needles, and ATEX warning callouts.

### Typography & Text Hierarchy
- **Primary Text (#dce4e6)**: Cold-white text for main headings and titles, providing high legibility.
- **Secondary Text (#bac9cd)**: Muted gray-teal for descriptive paragraphs and metadata.

---

## 3. Typography Rules

### Hierarchy & Weights
- **Display Headings**: Set in **Inter** (ExtraBold / Black, tracking -2%) to evoke premium manufacturing brochures.
- **Body copy**: Set in **Inter** (Regular, line-height 1.6) for readability.
- **Telemetry Labels**: Set in **Geist Mono** (Medium/Bold, letter-spacing +10%) for a monospaced "data-readout" feel.

### Spacing Principles
- Large vertical spacing increments (96px, 128px, or 160px) are used to isolate product narratives.
- Technical captions use uppercase and letter-spacing to reinforce engineering schematic styles.

---

## 4. Component Stylings

### Buttons
- **Primary CTA**: Electric Cyan background, dark (#0d1516) text, 8px corner radius. Glow effects apply on hover.
- **Secondary Button**: Outline style. Transparent background, 1px white/15 border, turning cyan on hover.

### Cards & Industrial Panels
- **Glassmorphism Containers**: Semi-transparent charcoal fills with `backdrop-filter: blur(20px)` and top-edge 1px hairline gradients.
- **3D Card Tilt**: Cards rotate on X and Y axes on mousemove, translating child elements in Z-depth to create physical layers.

### Interactive hotspots
- **Sensor Nodes**: Glowing concentric rings in Electric Cyan. Hovering zooms in and draws line indicators connecting to monospaced HTML spec boxes.

---

## 5. Layout Principles

### Grid & Structure
- 12-column grid container capped at 1440px max width for desktop viewports.
- Spacing units are multiples of 8px.

### Responsive Behavior & Touch
- Grid collapses to single columns on mobile.
- GSAP scroll triggers and camera pan sweeps disable on viewports < 768px, falling back to static framing and swipe-overflow containers to maintain battery life and high performance.

---

## 6. Design System Notes for Stitch Generation

### Language to Use
- When generating pages, use terms like: "pressurized flow pipeline", "ASME VIII flanged joints", "triplex piston pumps", "glowing cyan flow paths", "brushed carbon-steel", and "anodized aluminum instrumentation".

### Color References
- Canvas: `#0d1516`
- Primary Button: `#00e0ff`
- Muted Details: `#bac9cd`
- Accents: `#d4af37` (valves), `#d9534f` (gauges)
