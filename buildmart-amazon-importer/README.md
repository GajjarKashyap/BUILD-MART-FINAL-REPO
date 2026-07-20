# BuildMart Amazon Importer

Private Chrome extension that reads the Amazon India product page currently open
in your browser and transfers a temporary product package into BuildMart. It does
not use Vercel, an Amazon API, a proxy, or a remote scraper.

## Install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose `C:\Users\kasha\OneDrive\Desktop\collection\buildmart-amazon-importer`.
5. Open the extension's **Details** page and enable **Allow access to file URLs**.
6. Open **Extension options** and choose the local or online BuildMart URL.

## Import a product

1. Open an Amazon India product page and complete any CAPTCHA normally.
2. Select the BuildMart extension.
3. Select **Scan Current Page**.
4. Review the detected ASIN, title, price, images, specifications and variants.
5. Select **Import into BuildMart**.
6. Review and correct the populated BuildMart form.
7. Press BuildMart's normal **Save Product** button manually.

The extension never saves a product automatically.

## Security

- Amazon extraction runs only after a user action.
- Host access is limited to Amazon India and the configured BuildMart pages.
- No cookies, passwords, Firebase credentials or Amazon credentials are read.
- No remote JavaScript or `eval()` is used.
- The temporary payload expires after 30 minutes and is removed after BuildMart
  accepts it.
- BuildMart validates the schema and import ID before filling its form.

## Test

Open `tests/index.html` in Chrome. A green result confirms base extraction,
mixed-box recognition, image de-duplication and invalid-price handling.

## Limitations

- Only information present in the currently loaded page can be extracted.
- Amazon may load prices for unselected variants only after you select them.
- CAPTCHA pages must be completed before scanning.
- Amazon can change its markup, so extraction fallbacks may need maintenance.
