# Design Brief

## Direction

Karatina Rides — Professional, trustworthy mobility platform for local campus-to-town transport with clear role distinction and real-time status communication.

## Tone

Clean, modern, contemporary. Execution is precise and utilitarian — this is about reliability and ease of use, not visual flourish.

## Differentiation

Role-based visual hierarchy (Passenger in blue, Driver in green) + real-time status badges (searching→amber, accepted→teal, ongoing→teal, completed→green) create instant clarity for both riders and drivers.

## Color Palette

| Token      | OKLCH         | Role                           |
| ---------- | ------------- | ------------------------------ |
| background | 0.98 0.008 240 | Cool off-white, low saturation |
| foreground | 0.18 0.015 240 | Deep cool text                 |
| card       | 1.0 0.0 0    | Pure white surfaces            |
| primary    | 0.42 0.14 240 | Deep trustworthy teal          |
| accent     | 0.6 0.18 150 | Vibrant green (driver/CTA)    |
| destructive| 0.55 0.22 25 | Error red                      |
| muted      | 0.94 0.01 240 | Light neutral borders          |

## Typography

- Display: Space Grotesk — modern, geometric, tech-forward confidence
- Body: General Sans — clean, professional, readable
- Scale: hero `text-4xl md:text-5xl font-bold`, h2 `text-2xl font-semibold`, label `text-sm font-semibold tracking-widest`, body `text-base`

## Elevation & Depth

Soft card shadows (0 2px 8px) for interactive surfaces; elevated shadows (0 8px 20px) reserved for modals and overlays. No gradients—pure surface stratification.

## Structural Zones

| Zone    | Background  | Border                | Notes                         |
| ------- | ----------- | --------------------- | ----------------------------- |
| Header  | card        | border-muted          | Fixed top, user + role badge  |
| Map     | background  | —                     | Embedded map, full height     |
| Inputs  | card        | —                     | Floating overlay on map       |
| Status  | background  | —                     | Bottom panel, status badges   |
| Footer  | background  | border-muted top      | Driver online/offline toggle  |

## Spacing & Rhythm

Section gaps: 2rem. Card padding: 1.5rem. Micro-spacing: 0.5rem between label and input. No dense, no sparse — balanced rhythm for readability and visual rest.

## Component Patterns

- Buttons: rounded-lg, primary teal fill, green for driver CTAs, white text, no border
- Cards: rounded-lg, white background, shadow-card (0 2px 8px)
- Badges: role (pill shape, blue/green) + status (pill, amber/teal/green)
- Inputs: border-muted, rounded-md, focus:ring-primary

## Motion

- Entrance: fade-in 0.3s smooth on page load
- Hover: bg lightness +2%, shadow lift on interactive elements
- Status updates: fade-transition 0.4s for badge color changes
- Ride tracking: smooth marker movement on map (no jank)

## Constraints

- No gradients, no opacity layering for depth (use color stratification only)
- Role badges always visible in header (Passenger ≠ Driver)
- Status badges must be highly legible in all lighting conditions
- Map area respects off-white background, cards are pure white
- No decorative elements beyond status badges

## Signature Detail

Dual-mode role badges (Passenger: blue pill | Driver: green pill) in fixed header position create instant visual context switching—users always know who they are in the system.
