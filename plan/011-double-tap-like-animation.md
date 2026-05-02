# Plan: Double-Tap to Like Heart Animation

## Context
The PostCard component already handles `onDoubleClick={onLike}` on the post image, so the like logic fires on double-click. What's missing is the iconic Instagram heart burst overlay animation that appears briefly over the image when the user double-taps/double-clicks to like a post.

## What to Build
A white heart icon that pops up in the center of the post image, scales up with a bounce, then fades out — only when the action results in a **like** (not an unlike).

---

## Implementation

### 1. `src/cmps/PostCard.tsx`
- Add a `showHeart` boolean state (default `false`)
- Modify `onLike()` so that when the post is **not yet liked** (i.e. `!isLiked`), after calling `toggleLike`, set `showHeart = true` and clear it after ~900ms with `setTimeout`
- Add a `<div className="heart-burst">❤️</div>` inside `.post-image`, conditionally rendered when `showHeart` is true

### 2. `src/style/cmps/PostCard.css`
- Add `.heart-burst` styles:
  - Absolute center over the image
  - Large heart (80–100px font size)
  - Keyframe animation: starts at `scale(0) opacity(1)`, peaks at `scale(1.2)`, ends at `scale(1) opacity(0)`
  - Total duration ~800ms, ease-out
  - `pointer-events: none` so it doesn't interfere with clicks

---

## Critical Files
- [src/cmps/PostCard.tsx](src/cmps/PostCard.tsx) — add state + conditional render
- [src/style/cmps/PostCard.css](src/style/cmps/PostCard.css) — add keyframe + `.heart-burst` styles

---

## Verification
1. Open the app, double-click a post image → a large heart should pop and fade over the image
2. Confirm the post becomes liked (heart icon fills red, count increments)
3. Double-click again (to unlike) → **no** heart animation should appear
4. Check that single-click on the heart button still works normally
