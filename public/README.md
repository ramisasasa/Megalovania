# Sprite slot

Drop Sans PNGs here and they're picked up automatically — no code change.

| File | Used for | Shape |
|------|----------|-------|
| `sans.png` | login gate, small avatars | head only, square |
| `sans-full.png` | Sans's dialogue box on Home | full body, portrait |

Also accepted: `sans-undertale-icon-29.png`, `sans.webp` (head);
`sans-body.png`, `sans-full.webp` (body).

If `sans-full.png` is missing the dialogue falls back to `sans.png`; if
both are missing, the hand-drawn pixel skull in `src/components/Sans.jsx`
is drawn instead. Transparent background works best.
