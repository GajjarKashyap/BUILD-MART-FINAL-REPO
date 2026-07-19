# Design System: BuildMart Guided Catalog

## 1. Visual Theme & Atmosphere

A practical, workshop-clean software interface with daily-app density, restrained asymmetry, and calm feedback. Data entry should feel guided rather than technical: progressive disclosure, numbered steps, plain language, and a visible completion state replace long undifferentiated forms.

## 2. Color Palette & Roles

- **Canvas Mist** (`#FAFAFB`) — page background.
- **Pure Surface** (`#FFFFFF`) — forms and elevated work areas.
- **Charcoal Ink** (`#111827`) — primary text.
- **Muted Steel** (`#66726B`) — helper text and metadata.
- **Whisper Border** (`#DDE6E0`) — structural borders.
- **Workshop Green** (`#184D31`) — the only accent; actions, completed states, and focus.
- **Review Amber** (`#C08A2B`) — validation that needs user attention, never decoration.

## 3. Typography Rules

- **Display:** Space Grotesk, weight 600–700, tight tracking.
- **Body:** system sans-serif, relaxed leading, maximum 65 characters for instructional copy.
- **Numbers:** tabular figures for prices, quantities, dimensions, and stock.
- Use sentence case. Avoid all-caps instructional text.

## 4. Component Stylings

- **Guided forms:** Three or fewer visible steps with a one-sentence outcome for each.
- **Price review:** Group generated prices by size. Show four familiar pack inputs in the primary view; keep units, defaults, deletion, and custom records inside an Advanced disclosure.
- **Pricing methods:** Present plain-language choices such as “same rate” and “5% bulk discount,” never unexplained formulas.
- **Inputs:** Label above, example in placeholder, concise helper below. Errors appear inline and identify the exact missing size or price.
- **Advanced controls:** Weight conversion and technical mappings remain collapsed until requested.
- **Tables:** Use only for repeatable size/pack records. Keep the first column as the product dimension and the final column as removal.
- **Buttons:** Flat Workshop Green primary action, restrained outline secondary action, one-pixel tactile pressed state.
- **Images:** Size-specific image URLs belong to the size record. Changing size changes the storefront gallery without changing the SKU.
- **Loading and empty states:** Explain the next action; never leave “Loading…” indefinitely.

## 5. Layout Principles

Use a contained 1200–1400px work area and CSS Grid for repeatable controls. Preserve clear spatial separation between size setup, base-pack definition, and generated combinations. Collapse grids to one or two columns below 768px and allow data tables to scroll within their own region only.

## 6. Motion & Interaction

Use 180–260ms transform and opacity transitions. Validation status changes should be immediate and stable. Never animate dimensions or move the user’s current input target.

## 7. Anti-Patterns

- No guessed prices or copied prices across sizes.
- No warranty fields for Screws or Nails.
- No destructive clearing when category or subcategory changes.
- No hidden required fields.
- No nested modal workflows.
- No pure black, neon glows, decorative gradients, or excessive badges.
- No three-column marketing-card layouts inside operational screens.
- No technical terminology when “size,” “pack,” “price,” or “photo” is clearer.
