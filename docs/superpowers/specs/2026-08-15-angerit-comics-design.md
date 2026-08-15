# Angerit Comics redesign design

## Goal

Give Telegram readers a fast Russian-language entry point into angererit’s 18+ unofficial fan comic *No, I’m not a Human*. The homepage explains the project and sends readers to one of four parts; the reader keeps the existing vertical, un-cropped comic flow.

## Chosen direction

The user approved the second generated composition: an electronic dossier on an absolute-black page, with a large left text field, a real vertical cover on the right, a single “НАЧАТЬ ЧИТАТЬ” action, and four empty index-card-like part links below. The interface uses only black and turquoise, thin rules, square corners, and the supplied hand-lettered font when its local asset is available. No gradients, textures, shadows, glow, glass, decorative background art, or extra calls to action.

## Architecture

- Vue Router with `createWebHashHistory` keeps GitHub Pages routes under `/angerit-comics/`.
- `HomePage` owns the project introduction, cover, metadata, part links, warning, and legal footer.
- `ComicReader` resolves one part from `comicParts.js`, filters the shared image manifest, and lazy-loads only that range.
- Small presentational components own project metadata, part cards, age warning, and reader navigation.

## Data and behavior

`comicParts.js` is the single place for the four temporary page ranges. Invalid part ids render a recoverable not-found state. Reader navigation exposes only valid previous/next links, plus a home link. The first image is eager; later pages remain lazy and preserve order, aspect ratio, and page numbers.

## Responsive and accessibility requirements

Desktop keeps text left and cover right. Below 760px it becomes a single column in reading order; below 430px part cards become one column. Links and buttons have visible keyboard focus, descriptive labels, semantic headings, alt text for cover/pages, adequate contrast, and reduced-motion support.

## Verification

Run the production build, inspect the rendered home and reader routes at desktop/mobile widths, run the Impeccable detector once over changed UI files, and verify the final diff before atomic commits. The font file remains an explicit user-supplied asset if it is not present in the repository.
