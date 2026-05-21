# Global CSS Cleanup & Optimization Plan

**Date:** 2026-05-21
**Target:** src/styles/global.css (with cross-references to downstream files)
**Reference:** D:\GoRakuDo\DESIGN.md, rontend-design skill
**Status:** Reviewed and Expanded (incorporating @code-reviewer feedback)

## Phase 1: Core Performance & Typography Fixes (Immediate)
1. **Typography !important Consolidation**
   - **Issue:** Duplicate ont-family: var(--font-primary) !important; breaks Tailwind utility classes.
   - **Action:** Remove !important globally. Consolidate into ody.
   - **Note:** src/styles/pages/youtube-rekomendasi/youtube-rekomendasi-index.css:103 explicitly references the banned Inter font. This must be updated to match the design system.

2. **ackdrop-filter Violations on Normal Cards**
   - **Issue:** .glassmorphism and .glass-panel use heavy ackdrop-filter: blur(12px). While technically not overflow: scroll containers, they apply massive compositor load and violate the strict "fixed/sticky only" performance rule in rontend-design.
   - **Action:** Remove ackdrop-filter from non-sticky/non-fixed components. Use OKLCH semi-transparent backgrounds to convey depth instead. (Needs follow-up for 40 downstream occurrences).

3. **	ext-rendering Conflict**
   - **Issue:** 	ext-rendering: optimizeSpeed !important degrades typography (kerning/ligatures).
   - **Action:** Remove it globally to resolve conflicts with components that correctly request optimizeLegibility.

## Phase 2: Design System Token Migration (Alignment with DESIGN.md)
4. **Comprehensive !important Audit**
   - **Action:** Evaluate all 10 instances of !important in global.css. Keep color-scheme: dark !important;. Remove or override font-smoothing and word-spacing with higher specificity instead of !important.

5. **Easing System Alignment**
   - **Issue:** global.css has outdated easings and raw ase keywords (19 instances).
   - **Action:** Map all transitions to the 4 official curves in DESIGN.md (--grkd-ease-productive, --grkd-ease-expressive, --grkd-ease-spring, --grkd-ease-out). Replace all raw ase keywords.

6. **Color & Glassmorphism Token Migration**
   - **Action:** Migrate legacy color tokens (--token-purple-base, --token-bg-dark) to the new --grkd-* namespace (--grkd-purple-400, --grkd-black-950).
   - **Action:** Rename glassmorphism tokens to --grkd-glass-bg, --grkd-glass-border, --grkd-glass-blur matching DESIGN.md.

7. **Shadow Tinting Alignment**
   - **Issue:** Current shadows use generic black (gba or un-tinted oklch).
   - **Action:** Update box-shadows to use 270deg hue tinted shadows (e.g., oklch(0.05 0.01 270 / 0.30)) to achieve the "Night Library" aesthetic.

8. **Z-Index Scale Completion**
   - **Issue:** Modal layer is incorrectly defined or missing.
   - **Action:** Add missing layers (sticky: 100, dropdown: 200) and fix modal to 1400 per DESIGN.md.

9. **Dead Code Removal**
   - **Action:** Remove --animate-twinkle and its references, as the @keyframes twinkle does not exist.
