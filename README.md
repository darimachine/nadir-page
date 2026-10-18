# Nadir website

React + TypeScript + Tailwind CSS v4, Lucide icons (via `react-icons/lu`). Bulgarian by default, English toggle.

## Build

```
npm ci
npm run typecheck
npm run build          # → dist/index.html + dist/assets/ (deploy the dist folder)
```

## Structure

- `src/content.ts` — every figure with its source, plus the list of open items
- `src/lib/` — i18n (`t('бг', 'en')`), hash router (`#technology`, `#pilot`, `#contact`; other tokens scroll to home sections), motion helpers
- `src/sections/` — home page sections; `src/pages/` — Home, Technology, Pilot, Contact
- Add a page: create it in `src/pages/`, add its token to `PAGES` in `src/lib/router.tsx` and to the map in `src/App.tsx`.

## Imagery

`src/assets/` holds real imagery from the nadir-main repository: a 5 cm orthophoto of Manastirski Livadi (СМГ / ОП „Софияплан“ via UrbanData Sofia, CC BY 4.0; cropped and resampled) and eight 51.2 m crops. Positions, labels and captions are in `src/imagery.ts`. The build writes them to `dist/assets/`, so deploy the whole `dist/` folder.

## Before going live

- Team e-mail is set in `src/content.ts` (nadir.sat@proton.me).
- Forms (Contact and Order) are delivered by FormSubmit: `FORM_ENDPOINT` in `src/content.ts`. Send one test enquiry from the live site, then click the activation link FormSubmit e-mails to nadir.sat@proton.me; until then visitors get "not sent" with a one-click fallback to a prepared e-mail. Set `FORM_ENDPOINT` to `null` to always use the prepared e-mail.
- Privacy policy (`#privacy`, `src/pages/Privacy.tsx`) is a working draft; have it reviewed and update the date
- Motion for React was not installable offline; `src/lib/motion.tsx` covers reveals and count-ups and is the only file to change when swapping it in.
- For a real domain: move to Vite (or keep esbuild), add per-page routes with `/bg` and `/en` paths for SEO, and `hreflang` links.

## Public website and deployment

- Website: https://darimachine.github.io/nadir-page/
- Repository: https://github.com/darimachine/nadir-page
- GitHub Pages source: **GitHub Actions**.
- Every push to `main` installs locked dependencies, checks TypeScript, builds `dist/`, and publishes it with the official GitHub Pages actions.
- Hash routes and relative image URLs support the `/nadir-page/` project path.
- For a local preview after building, run `python3 -m http.server 8080 --directory dist`, then open http://localhost:8080/.
- The archive's source, imagery, and existing `dist/` output are included; the deployment always rebuilds from source.

The landing page is public. Contact/order delivery uses the existing FormSubmit integration and requires the recipient's activation described above. Publishing the site does not activate an email inbox.

## Public plans

The public offer has two plans, each requiring at least **50 km²**:

- **One-off scan:** **€534 excluding VAT** for 50 km², one analysis using available archive satellite imagery to identify potential dumpsites.
- **Annual monitoring:** **€24,000 excluding VAT** for 50 km² over 12 months, **2 new satellite acquisitions and analyses per month / 24 per year**, monitoring previously identified sites.

Customer prices and plan copy live in `src/pricing.ts`. The homepage section is linked as `#plans`; the order form supports `#order?plan=discovery` and `#order?plan=monitoring`. Enquiries retain the selected plan, base price, coverage and cadence. Area validation rejects values below 50 km², blank/non-numeric values and infinity; decimal commas are accepted. Larger areas and optional drone surveys require a separate quote. No payment is collected by this form.

The underlying private cost/profit workbook is not part of this repository.
