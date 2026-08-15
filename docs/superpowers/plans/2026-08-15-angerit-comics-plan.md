# Angerit Comics implementation plan

## Global constraints

- Preserve Russian UI copy, original comic images, their order, aspect ratio, and lazy loading.
- Use the approved second “electronic dossier” composition: black background, turquoise-only interface, thin rules, large negative space, real cover, one primary action.
- Provide four hash-routed parts and load only the selected part in the reader.
- Keep 18+ and fan-project/legal disclosures visible; do not add auth, comments, ratings, theme switching, or a “Продолжить” action.
- Do not push.

## Tasks

1. Add router, part-range data, and shared application shell.
2. Build the homepage and its metadata/part/warning components.
3. Build the routed comic reader with header/footer navigation and progressive image loading.
4. Apply the approved visual system, responsive rules, SEO metadata, and public cover/font paths.
5. Build, inspect, run the detector, and make atomic commits for each completed slice.
