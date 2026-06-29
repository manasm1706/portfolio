# CareerOS Architecture

---

# Overview

CareerOS follows a feature-first architecture.

The application is divided into independent modules rather than large folders containing unrelated components.

Each feature owns its pages, components, hooks, types, and utilities whenever possible.

The goal is to make the project scalable while keeping navigation intuitive.

---

# Application Structure

CareerOS is divided into several major modules.

```
Dashboard
Calendar
Opportunities
Coding
Projects
Resources
Analytics
AI Coach
Profile
Settings
```

Each module should be able to evolve independently.

---

# Application Flow

```
Application

↓

Layout

↓

Sidebar + Navbar

↓

Current Page

↓

Widgets

↓

Shared Components

↓

Static Data / APIs (Future)
```

Pages should never communicate directly with each other.

Shared data should always come from a central source.

---

# Layout Structure

The application consists of one global layout.

```
┌───────────────────────────────────────────────┐
│ Top Navigation                               │
├────────────┬──────────────────────┬──────────┤
│ Sidebar    │                      │          │
│            │ Main Content         │ Utility  │
│            │                      │ Panel    │
│            │                      │          │
└────────────┴──────────────────────┴──────────┘
```

The sidebar and top navigation remain persistent throughout the application.

Only the main content changes between pages.

---

# Primary Navigation

```
Dashboard

Calendar

Opportunities

Coding

Projects

Resources

Analytics

AI Coach

Profile

Settings
```

The navigation should always remain short and predictable.

Avoid deeply nested menus.

---

# Dashboard Philosophy

Dashboard is the application's home.

It should answer five questions immediately.

* What should I do today?
* What is coming up?
* How am I progressing?
* What deserves attention?
* Where should I continue?

Almost every widget in CareerOS should be reusable inside the Dashboard.

---

# Widgets

Widgets are independent UI blocks.

Examples

```
Today's Focus

GitHub Overview

LeetCode Progress

Upcoming Events

Current Projects

Applications

Learning Progress

Calendar Preview

Opportunity Spotlight

Quick Links
```

Widgets should never depend on specific pages.

They should be reusable anywhere.

---

# Shared Components

Examples include

```
Button

Card

Modal

Dialog

Drawer

Tabs

Table

Badge

Progress Bar

Chart

Avatar

Search

Command Palette

Sidebar

Navbar

Calendar

Tooltip

Dropdown
```

These belong to the global component library.

---

# Feature Components

Components that only belong to one module should remain inside that feature.

Example

```
Projects

├── ProjectCard

├── Roadmap

├── Milestone

├── TechStack

├── Timeline
```

These should not be moved into the shared component library unless reused elsewhere.

---

# Routing

Simple flat routing.

```
/

dashboard

calendar

opportunities

coding

projects

resources

analytics

ai

profile

settings
```

Avoid deeply nested routes.

The application should remain easy to navigate.

---

# Data Strategy

Version 1 uses static mock data.

```
JSON

↓

Types

↓

Components

↓

Pages
```

No backend required.

Mock data should closely resemble real-world data so replacing it with APIs later requires minimal changes.

---

# State Management

Keep state local whenever possible.

Global state should only be used for:

* Theme
* Sidebar
* User Preferences
* Global Search
* Notifications (Future)

Avoid unnecessary global stores.

---

# Search

Search should be global.

Eventually every searchable object should appear here.

Examples

* Projects
* Notes
* Companies
* Opportunities
* Resources
* Calendar Events
* Commands

The goal is to reduce navigation friction.

---

# External Integrations (Future)

CareerOS does not replace existing services.

Instead it connects to them.

Potential integrations include:

* GitHub
* LeetCode
* Codeforces
* Google Calendar
* Gmail
* LinkedIn
* Devfolio
* Unstop
* OpenAI

Initially these are represented using realistic placeholder data.

---

# Design Rules

Architecture should follow these principles.

* Keep components reusable.
* Keep pages lightweight.
* Prefer composition over duplication.
* Separate UI from data.
* Avoid unnecessary abstractions.
* Build for readability first.

---

# Folder Structure

```
src/

app/

components/

features/

hooks/

lib/

data/

types/

styles/

assets/

utils/
```

Every folder should have a clear responsibility.

No miscellaneous "helpers" folder containing unrelated logic.

---

# Long-Term Vision

CareerOS should remain modular enough that future features can be added without redesigning the application.

The architecture should encourage clean growth instead of feature accumulation.

Every new feature should naturally fit into the existing structure rather than forcing architectural changes.
