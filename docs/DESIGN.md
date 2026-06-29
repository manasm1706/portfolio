# Design.md

# CareerOS Design System & UI Guidelines

> *CareerOS should feel like a premium operating system for ambitious developers.*

---

# Design Vision

CareerOS is not a dashboard.

It is not an admin panel.

It is not a portfolio.

It is not a productivity app.

CareerOS should feel like opening your personal engineering operating system.

The interface should make users feel:

* Calm
* Focused
* Motivated
* In Control
* Organized

Every interaction should reduce friction and increase clarity.

The application should encourage users to build, learn and grow—not simply manage tasks.

---

# Design Principles

## 1. Information First

The interface exists to communicate information.

Decorations should never compete with content.

If an element doesn't improve understanding, remove it.

---

## 2. Premium Minimalism

CareerOS should feel expensive.

Not because of visual effects.

Because of:

* spacing
* typography
* alignment
* consistency
* hierarchy

Minimalism does not mean empty.

Minimalism means intentional.

---

## 3. Beautiful Enough To Use Daily

The interface should never become visually tiring.

Animations should feel smooth.

Colors should feel balanced.

Nothing should scream for attention.

---

## 4. Focus Driven

Users should never wonder

"What should I do next?"

The UI should answer that automatically.

Priority should always be visible.

---

## 5. Everything Has A Purpose

Every

button

card

chart

animation

widget

exists because it solves a problem.

Not because it looks cool.

---

# Design Language

Imagine a combination of

* Apple
* Linear
* Arc Browser
* Raycast
* GitHub
* Stripe Dashboard
* Vercel
* Supabase

without copying any of them.

The result should feel unique but familiar.

---

# Inspiration

Primary

* Linear
* Vercel Dashboard
* Raycast
* GitHub
* Stripe
* Arc Browser
* Apple Human Interface Guidelines

Secondary

* Matthew Park
* Framer
* Figma
* Notion

---

# Visual Keywords

Premium

Elegant

Developer-first

Professional

Organized

Intentional

Modern

Calm

Confident

Minimal

Fast

---

# Things To Avoid

Do NOT use

* Glassmorphism everywhere
* Neon RGB
* Floating blobs
* Huge gradients
* Animated backgrounds
* Scroll hijacking
* Parallax
* Heavy shadows
* Overly rounded elements
* Generic admin templates
* Crypto dashboard aesthetics
* Dashboard clutter

The interface should feel timeless.

---

# Color System

## Background

```
#09090B
```

Main application background.

---

## Surface

```
#111214
```

Cards and containers.

---

## Elevated Surface

```
#17181B
```

Dialogs

Dropdowns

Modals

---

## Borders

```
#24262B
```

Very subtle.

Never harsh.

---

## Primary

```
#4F8CFF
```

Buttons

Links

Active states

Selections

---

## Secondary

```
#8B5CF6
```

Highlights

Special widgets

AI

---

## Success

```
#22C55E
```

---

## Warning

```
#F59E0B
```

---

## Danger

```
#EF4444
```

---

## Text

Primary

```
#FFFFFF
```

Secondary

```
#A1A1AA
```

Muted

```
#71717A
```

---

# Typography

Primary Font

Geist

Fallback

Inter

Rules

* Prefer medium weight.
* Rarely use bold.
* Large titles only once per page.
* Let whitespace create emphasis.
* Keep line lengths readable.

---

# Layout Philosophy

Desktop First.

Three-column layout.

```
Sidebar

↓

Main Content

↓

Utility Panel
```

Main content should always be the visual focus.

The sidebar should guide navigation.

The utility panel should provide contextual information.

---

# Navigation

Persistent Sidebar.

Top Navigation.

Global Search.

Command Palette.

Navigation should require very few clicks.

The user should always know where they are.

---

# Sidebar

Contains only primary destinations.

* Dashboard
* Calendar
* Opportunities
* Coding
* Projects
* Resources
* Analytics
* AI Coach
* Profile
* Settings

No nested menus.

No unnecessary categories.

---

# Dashboard Philosophy

Dashboard is the home.

It should answer five questions immediately.

* What should I work on today?
* What is coming up?
* What deserves attention?
* How am I progressing?
* What should I continue?

If a widget doesn't answer one of these questions, reconsider its existence.

---

# Cards

Cards are the fundamental building block.

Each card should answer exactly one question.

Examples

* Today's Focus
* Upcoming Events
* GitHub Overview
* LeetCode Progress
* Current Projects
* Opportunity Spotlight

Cards should not become mini applications.

---

# Widgets

Widgets are reusable.

A widget built once should appear on multiple pages.

Examples

* GitHub Widget
* Calendar Widget
* Opportunity Widget
* Project Widget
* Analytics Widget

Widgets should remain independent.

---

# Spacing

Prefer generous spacing.

Avoid crowded layouts.

Suggested spacing scale

* 4px
* 8px
* 12px
* 16px
* 24px
* 32px
* 48px

Whitespace is part of the design.

---

# Border Radius

Small.

Consistent.

Recommended

12px

Never use excessive rounding.

---

# Icons

Use Lucide Icons only.

Icons support labels.

Icons never replace labels.

Maintain consistency throughout the application.

---

# Buttons

Three button types

Primary

Secondary

Ghost

Buttons should have

* Hover
* Focus
* Active
* Disabled

states.

---

# Motion

Motion should communicate.

Not entertain.

Allowed

* Fade
* Scale
* Slide
* Card Lift
* Skeleton Loading
* Progress Animation

Avoid

* Bounce
* Elastic
* Long transitions
* Spinning elements
* Decorative animations

Target duration

150–250ms

Use Motion sparingly.

---

# Charts

Charts should emphasize readability.

Prefer

* Line Charts
* Area Charts
* Progress Rings
* Small Bar Charts

Avoid unnecessary colors.

Grid lines should remain subtle.

---

# Empty States

Every page should have a thoughtful empty state.

Instead of

"No Data"

Use

"You haven't started tracking projects yet."

Provide a meaningful next action.

---

# Loading States

Always use skeleton loading.

Avoid spinners whenever possible.

Loading should feel intentional.

---

# Responsiveness

Desktop

Laptop

Tablet

Mobile

The experience should remain beautiful across all screen sizes.

Never simply hide information.

Instead, reorganize it.

---

# Accessibility

Keyboard navigation.

Visible focus indicators.

Semantic HTML.

High contrast.

Readable font sizes.

Proper labels.

Accessibility is part of good design.

---

# Microinteractions

Every interaction should provide feedback.

Examples

* Card hover
* Button press
* Progress updates
* Search suggestions
* Sidebar collapse
* Command palette opening

Microinteractions should feel subtle and rewarding.

---

# Search

Search is a first-class feature.

Users should be able to search

Projects

Companies

Resources

Calendar Events

Notes

Opportunities

Commands

from one place.

---

# Command Palette

Ctrl + K

Should allow users to

Navigate

Search

Launch actions

Open resources

Jump to projects

Find opportunities

The goal is to minimize navigation time.

---

# Overall User Experience

A user should be able to open CareerOS for less than a minute and immediately understand:

* What needs attention.
* What is coming next.
* How much progress has been made.
* Where they should continue.

The application should reduce decision fatigue.

---

# Design Success Criteria

The design is successful if:

* Users enjoy opening the application every day.
* Navigation feels effortless.
* Information is easy to scan.
* Visual hierarchy is obvious.
* Every page has a clear purpose.
* The interface feels premium without feeling excessive.

---

# Final Goal

CareerOS should not impress users because it has the most features.

It should impress users because everything feels intentional.

The best compliment someone can give after opening CareerOS is:

> "This feels like a real product I would actually use every day."
