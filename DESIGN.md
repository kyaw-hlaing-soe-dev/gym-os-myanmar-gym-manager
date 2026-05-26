---
name: GymOS Design System
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  mono-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-desktop: 32px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered to feel like a high-performance operating system for fitness management. It balances the "trust" of a financial SaaS with the "energy" of a fitness platform. The brand personality is **Professional, Systematic, and Facilitative**, positioning itself as a reliable backbone for gym operations rather than a loud lifestyle brand.

The visual style is **Corporate Minimalism** with a heavy emphasis on data-driven clarity. It utilizes a card-based architecture to modularize complex information across four distinct user roles: Admin, Owner, Trainer, and Member. The aesthetic is defined by high-contrast legibility, generous whitespace to reduce cognitive load during busy gym floor operations, and a structured grid that ensures the technical stack (Next.js/Spring Boot) feels fast and responsive.

**Key Emotional Responses:**
*   **Empowerment:** Data is accessible and actionable.
*   **Reliability:** Stable, institutional-grade interface.
*   **Precision:** Every pixel serves a functional purpose for tracking metrics like MRR and Client Progress.

## Colors

The palette is anchored by a **Deep Navy** primary color, chosen to evoke stability and institutional authority. This is contrasted with a **Soft Teal** secondary color used for success states, action buttons, and "growth" metrics like Revenue and Attendance Streaks.

A sophisticated neutral scale ranging from Cool Slate to Paper White ensures that the "OS" feel is maintained. High contrast is a priority; text never falls below a 4.5:1 ratio against backgrounds to ensure accessibility for trainers on the move.

**Role-Based Accents:**
*   **ADMIN:** Uses the Primary Navy for a system-level feel.
*   **OWNER:** Utilizes Teal accents to highlight financial performance.
*   **TRAINER:** Uses Slate and Blue for scheduling and tactical planning.
*   **MEMBER:** Features higher use of whitespace and Teal for personal achievements.

## Typography

The design system utilizes **Inter** exclusively to achieve a modern, utilitarian, and highly legible interface. The type scale is optimized for data density, particularly for Admin system logs and Owner revenue charts.

**Hierarchy Rules:**
*   **Numerical Data:** Use `mono-data` (utilizing Inter's tabular num features) for MRR, Churn, and Attendance numbers to ensure vertical alignment in tables.
*   **Headlines:** Keep `display-lg` reserved for dashboard overviews. Mobile views should cap at `headline-md` (24px) for Workout Plans to maximize screen real estate.
*   **Labels:** All-caps should be reserved for `label-md` only, used for table headers and small metadata tags.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid**. On desktop, the system uses a 12-column grid with a maximum content width of 1440px. On mobile, it collapses to a single-column fluid layout.

**Spacing Rhythm:**
*   The system is built on an **8px linear scale**.
*   **Cards:** Use `md` (24px) internal padding to ensure data visualizations have "room to breathe."
*   **Density:** In "Admin" and "Trainer" portals where data density is critical (e.g., Session Schedules), use a "Compact" mode reducing vertical `body-sm` spacing to `xs` (4px).
*   **Reflow:** Dashboard cards should span 3, 4, 6, or 12 columns depending on the priority of the metric (e.g., Revenue spans 6, while System Health logs might span 12).

## Elevation & Depth

To maintain the "OS" feel, the design system avoids heavy shadows, instead using **Tonal Layers** and **Low-Contrast Outlines** to define depth.

**Elevation Levels:**
*   **Level 0 (Background):** Slate-50 (#F8FAFC). The canvas for all content.
*   **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a 1px border in Slate-200. This is the primary container for workout plans and client progress.
*   **Level 2 (Hover/Active):** A very soft, diffused ambient shadow (0px 4px 12px rgba(15, 23, 42, 0.05)) used when a user interacts with a dashboard tile.
*   **Level 3 (Modals/Dropdowns):** A crisp 1px border plus a medium shadow to separate critical system actions (like "Add Workout") from the background grid.

## Shapes

The shape language is **Rounded**, reflecting a modern, approachable software feel. The standard radius is `0.5rem` (8px).

*   **Buttons & Inputs:** Use the standard `rounded` (8px) for a professional appearance.
*   **Cards:** Large containers use `rounded-lg` (16px) to soften the layout and distinguish sections.
*   **Tags/Badges:** Use "Pill-shaped" (999px) for role indicators (ADMIN, OWNER) and status chips (Active, Churn Risk) to make them instantly recognizable as non-interactive metadata.

## Components

### Buttons
*   **Primary:** Solid Navy (#0F172A) with white text. High-emphasis actions like "Generate Workout Plan."
*   **Secondary:** Teal border (#0D9488) with Teal text. Used for "View Details" or "Edit Profile."
*   **Ghost:** Transparent background with Slate text for low-priority system navigation.

### Data Cards
*   Must include a title (`label-lg`), a primary metric (`headline-lg`), and a trend indicator (e.g., "+12% vs last month").
*   Interactive cards (Member list items) should use a subtle background shift to Slate-50 on hover.

### Form Fields
*   Outlined style with a 1px Slate-300 border. 
*   Active state: Border color changes to Teal-600 with a 2px outer glow.
*   Labels must always be visible (no floating labels) for maximum accessibility.

### Feedback & Status
*   **Success (Attendance Streak/Revenue Up):** Teal-600.
*   **Warning (Churn Risk):** Amber-500.
*   **Error (System Logs/Failed Sync):** Rose-600.

### Role-Specific Elements
*   **Admin Logs:** Use a monospaced font variant for technical stack reporting (Spring Boot/Next.js logs).
*   **Member Chatbot:** Use a fixed floating action button (FAB) in the bottom right corner with a Teal gradient to signify AI-assistance (Claude API).