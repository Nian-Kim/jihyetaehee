# Mobile Wedding Invitation

A local, mobile-first photobook wedding invitation for `Nian-Kim/jihyetaehee`.
No package installation, build step, or backend is required.
Only the photobook design is supported; the alternative design and selector have been removed.
The supplied couple names, venue name, and wedding date are configured in the
data file. Five user-supplied wedding photographs are now connected; more can be
added without changing the layout. Venue name and street address were verified
against the public Kakao Map listing; hall/floor and travel details still need confirmation.

## Structure

- [site/index.html](site/index.html): page markup and metadata.
- [site/assets/css/style.css](site/assets/css/style.css): mobile-first styles.
- [site/assets/js/wedding-data.js](site/assets/js/wedding-data.js): wedding details, photo order, and featured-photo settings.
- [site/assets/js/main.js](site/assets/js/main.js): page behavior.
- `site/assets/images/`: approved photos and sharing images.
- [.github/workflows/pages.yml](.github/workflows/pages.yml): GitHub Pages deployment.

## Local Preview

Open [site/index.html](site/index.html) directly in a browser.
Relative asset paths work both locally and under the GitHub Pages repository path.

The page opens directly as a photobook: swipeable full-photo cover, invitation,
three-column mosaic gallery, calendar, venue address, and map links.
No view parameter is needed; legacy view parameters are ignored.
Use `?scoutTheme=light` or `?scoutTheme=dark` to choose a theme.
The page has no design toolbar, sample notices, or initial monogram.
Reference-inspired typography pairs MaruBuri Korean text with Allura script:
"Our Wedding" on the cover and "With love" above the invitation. Names and
groom/bride labels sit below the photograph. The page is entirely in English for
international guests; the venue's Korean name and address are shown beside the
English ones (and both are copied by "Copy address") for taxis and local maps.

Wedding content is configured in [site/assets/js/wedding-data.js](site/assets/js/wedding-data.js).
The cover uses native horizontal scroll snapping for touch navigation, previous/next
buttons, and Left/Right/Home/End keyboard navigation while its photo reel is focused.
The gallery displays all supplied photos as small square tiles in three columns,
with lazy-loaded images. It has been checked with 20 photos at mobile and desktop widths.
Selecting a tile opens the photo in its original aspect ratio in a dialog with
previous/next, swipe, Escape, and close controls. The dialog shows the photo counter;
closing it returns keyboard focus to the selected tile.
Scroll reveals and smooth navigation honor `prefers-reduced-motion`; the bottom
navigation shows reading progress and the current destination. No automatic slideshow
or forced opening popup is used. The first cover is the white studio portrait.
The selected garden portrait stays as the closing photo even when more photos are added.
The countdown below the calendar counts down to the timezone-aware wedding date,
then changes to a thank-you message. Address copying and calendar downloads remain
disabled until the corresponding real details exist.
The cover fills the whole screen (`100svh`, designed around an iPhone Pro viewport of
about 402x874) with a slow Ken Burns zoom. Its "01 / 03" photo counter and arrows are
hidden until the cover is touched (or hovered/focused), then fade out after 0.8 seconds. The bottom navigation stays hidden until you scroll past the cover. The closing
photo and the photo viewer also fill the screen (`object-fit: cover` using each photo's
`focus` point), so edges may be cropped on tall phones. Tiles fade in with a stagger,
and the wedding day, hearts, and RSVP button pulse gently; all of it stops under
`prefers-reduced-motion`. Photos cannot be pinch-zoomed or double-tap-zoomed on phones
(`touch-action` plus `gesturestart`/multi-touch handlers); tapping a gallery tile still
opens the full-screen viewer.
An RSVP section and bottom-nav link open the Microsoft Forms URL set in `rsvpUrl`.
Responses are stored by Microsoft Forms, so the form must allow anyone to respond.
The closing section has a "Copy link" button and, on browsers that support the Web
Share API (most mobile browsers), a "Share" button that opens the native share sheet.
Both share the page URL without query or hash.
The invitation includes Naver Map, Google Maps, and Kakao Map links, configured via
`naverMapUrl`, `googleMapUrl`, and `kakaoMapUrl`. The visible map is a live Naver map
(Naver Cloud Maps Web Dynamic Map) centered on `venue.lat` / `venue.lng`. It needs a
public `ncpKeyId` in `venue.naverMapKeyId`; create an Application with the "Maps >
Web Dynamic Map" service in the Naver Cloud console and register
`https://nian-kim.github.io` as its Web service URL. While `naverMapKeyId` is empty,
the page falls back to the static Kakao map image, which links to place `2107641562`.
Alternatively set `venue.kakaoJsKey` (a Kakao Developers JavaScript key with
`https://nian-kim.github.io` registered as a Web domain and Kakao Maps turned ON) to
show a live Kakao map; Naver takes precedence if both keys are set. Kakao's free quota
applies to the first Kakao Maps-enabled app per developer account and needs no billing.
The external maps need internet access and show a failure message if they cannot load.

The local-only guestbook and unfinished bank-account, public-transport, and parking
sections have been removed, including their placeholder text. Existing browser-local
demo messages are not read or modified. No guestbook or RSVP submissions are collected.
If account information is added later, group it as groom's side / bride's side and
identify each person's relationship and account holder, not just their name.
Only include approved details; do not invent parent names, family relationships,
account information, or venue logistics.

## Adding Photos

Place photo files in the image assets folder and append `{ src, alt }` entries to
`gallery` in [site/assets/js/wedding-data.js](site/assets/js/wedding-data.js).
Folder contents are not scanned automatically. Every listed photo appears in the
mosaic and lightbox, in list order; neither five nor twenty is a maximum.

- `width` and `height`: optional actual pixel dimensions, used to reserve image space.
- `focus: [x, y]`: optional crop focal point in percentages; defaults to `[50, 50]`.
- `cover: true`: include this photo in the cover carousel; ordinary additions do not change it.
- `coverTone: "light"`: use light script over a dark photo; otherwise use dark script.
- `closing: true`: use this photo for the ending; mark only one photo.

If no photo is marked for the cover, the first is used. If none is marked for the
ending, the last is used. Enlarged photos are always shown in their original aspect
ratio; focal points only affect cropped previews. Original photo files are not altered.

## Preview Assets

Reference invitations were used only as visual inspiration. Their photos, text,
source code, personal details, and guestbook entries are not included.
The current gallery uses five `KakaoTalk_20260911_170208804*.jpg` files supplied by
the user, each 1153 by 1440 pixels. Originals are preserved. Earlier sample assets
below remain on disk and are not used by the configured gallery:

- `sample-wedding.jpg`: https://images.unsplash.com/photo-1519741497674-611481863552.
- `sample-flowers.jpg`: https://images.unsplash.com/photo-1525310072745-f49212b5ac6d.
- `sample-table.jpg`: https://images.unsplash.com/photo-1511285560929-80b456fea0bc (wedding balloon scene, despite the temporary filename).
- Photo terms: https://unsplash.com/license.
- Fonts: MaruBuri Light/Regular from [NAVER](https://hangeul.naver.com/font/maru), paired with [Allura](https://fonts.google.com/specimen/Allura). The active WOFF2 files total about 934 KiB, are hosted locally, and include SIL OFL licenses alongside them. Allura was converted from the official TTF using wawoff2 2.0.1. Prior font experiments remain on disk but are not loaded by the current page.
- Icons: Lucide 0.468.0, locally vendored from https://cdn.jsdelivr.net/npm/lucide@0.468.0/dist/umd/lucide.min.js; license: https://github.com/lucide-icons/lucide/blob/0.468.0/LICENSE.

## GitHub Pages

This folder is a local scaffold, not a clone. Remote repository access and deployment
have not yet been verified. Before uploading, authenticate with GitHub, inspect the
existing repository, and merge this scaffold without overwriting existing work.

1. Confirm the default branch. The workflow currently targets `main`; adjust it if needed.
2. In the repository, open **Settings > Pages > Build and deployment**.
3. Choose **GitHub Actions** as the source.
4. Commit and push the scaffold when approved, or run the workflow manually after upload.
5. Check the deployment URL in the completed workflow.

Expected URL, once successfully deployed without a custom domain:
https://nian-kim.github.io/jihyetaehee/

Only `site/` is published. Private repositories require a GitHub plan that supports
Pages for private repositories. The agreed free-hosting workflow is to review
locally, inspect all files and remote commit history for sensitive data, obtain
final approval, make the intended repository public, deploy, then connect the custom
domain and HTTPS. Do not change visibility or upload until approved. Public
repositories expose source and history; deployed website assets are downloadable.

## Before Publishing the Final Invitation

- Confirm photo order and permission to publish the supplied photos; review image metadata and unused assets before any public upload.
- Finalize the photobook design and confirm the English invitation wording and name spellings.
- Review the title and description; add social sharing metadata.
- Decide whether to keep the initial `noindex, nofollow` setting. It is not access control.
- Never commit secrets or unapproved personal details, phone numbers, or account information.
- Guestbooks need a separate service; Pages serves static files only. RSVP uses the external Microsoft Forms link.

## Quick Validation

```sh
node --check site/assets/js/wedding-data.js
node --check site/assets/js/main.js
```

Preview at mobile and desktop widths after changing the layout.