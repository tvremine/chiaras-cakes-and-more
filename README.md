# Chiara's Cakes & More

A static, multi-page website for a sample Indianapolis bakery owned by Chiara Cerola. It is plain HTML, CSS, and vanilla JavaScript: no build step and no framework. The menu, prices, hours, phone, address, press names, and testimonials are placeholders.

## Preview locally

From this folder:

```bash
python3 -m http.server 8080
```

Open [http://127.0.0.1:8080/](http://127.0.0.1:8080/). Pages:

| Page | File |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| Menu | `menu.html` |
| Custom cakes | `custom-cakes.html` |
| Gallery | `gallery.html` |
| Contact | `contact.html` |
| FAQ, terms, privacy, shipping | `faq.html`, `terms.html`, `privacy.html`, `shipping.html` |
| Not found | `404.html` |

The cart is saved in this browser only (`localStorage`). Inquiry, contact, and newsletter forms never leave the page.

## Deploy on GitHub Pages

1. Merge this project to the `Main-Branch` branch.
2. In the repository on GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **Main-Branch** and folder **/ (root)**, then save.
5. Wait until the Pages status shows a live site. The project URL for this repository is:

   `https://tvremine.github.io/chiaras-cakes-and-more/`

6. GitHub Pages serves `404.html` for unknown paths on that site. Canonical URLs, Open Graph tags, `sitemap.xml`, and `robots.txt` already use the project URL above. If you publish to a different domain or repository name, replace `https://tvremine.github.io/chiaras-cakes-and-more` in those files and in each page’s `<head>`.

`.nojekyll` is included so GitHub Pages does not run Jekyll.

Before a real launch, replace the placeholder phone `(555) 555-0123`, the email `hello@chiarascakes.example`, and `123 Placeholder Lane, Indianapolis, IN 46204`.

## Design notes

The look follows the pink-and-gold bakery template at [digitartthemes.wixstudio.io/pinkcheckered](https://digitartthemes.wixstudio.io/pinkcheckered/): cream announcement bar, blush hero, gingham behind the cake, scalloped section edges, pill buttons with a gold outline, and a scrolling “cakes fit for queens” ribbon.

Bright gold `#C49A2E` is used for borders and decorative marks. Small text that has to meet WCAG AA uses a darker gold (`#7A5C16` headings, `#6E5214` links and button labels) or cocoa `#3A2418` for body copy. The rose footer bar is `#9A5368` so white capitals clear AA.

The marquee animation turns off when the visitor has `prefers-reduced-motion` enabled. The mobile menu button exposes `aria-expanded`, traps focus while open, and closes with Escape.

## Logo and fonts

- `assets/logo.svg` — gold line-art three-tier drip cake with a heart, the script name Chiara’s, and tracked serif capitals “CAKES & MORE”.
- `assets/favicon.svg` — compact cake mark for the browser tab.

Script lettering in the logo is **Great Vibes** (TypeSETit, SIL Open Font License), converted to outlines. Capitals are **Playfair Display** (Claus Eggers Sørensen, OFL), also outlined. The site self-hosts:

- Playfair Display — `fonts/playfair-OFL.txt`
- Montserrat — `fonts/montserrat-OFL.txt`
- Italianno (the “Welcome to” script) — `fonts/italianno-OFL.txt`

## Photographs

Images in `images/` were downloaded from [Unsplash](https://unsplash.com/license) and compressed for the site. `images/og.jpg` is a crop of the hero cake for social previews.

| File | Source |
| --- | --- |
| `hero-cake.jpg`, `og.jpg` | [photo-1464349095431-e9a21285b5f3](https://images.unsplash.com/photo-1464349095431-e9a21285b5f3) |
| `hero-donuts.jpg` | [photo-1551024601-bec78aea704b](https://images.unsplash.com/photo-1551024601-bec78aea704b) |
| `cat-cakes.jpg` | [photo-1578985545062-69928b1d9587](https://images.unsplash.com/photo-1578985545062-69928b1d9587) |
| `cat-cupcakes.jpg` | [photo-1614707267537-b85aaf00c4b7](https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7) |
| `cat-cookies.jpg` | [photo-1499636136210-6f4ee915583e](https://images.unsplash.com/photo-1499636136210-6f4ee915583e) |
| `cat-pastries.jpg` | [photo-1555507036-ab1f4038808a](https://images.unsplash.com/photo-1555507036-ab1f4038808a) |
| `prod-rose.jpg` | [photo-1563729784474-d77dbb933a9e](https://images.unsplash.com/photo-1563729784474-d77dbb933a9e) |
| `prod-cocoa.jpg` | [photo-1571115177098-24ec42ed204d](https://images.unsplash.com/photo-1571115177098-24ec42ed204d) |
| `prod-lemon.jpg` | [photo-1519869325930-281384150729](https://images.unsplash.com/photo-1519869325930-281384150729) |
| `prod-vanilla.jpg` | [photo-1535254973040-607b474cb50d](https://images.unsplash.com/photo-1535254973040-607b474cb50d) |
| `creation-arch.jpg` | [photo-1621303837174-89787a7d4729](https://images.unsplash.com/photo-1621303837174-89787a7d4729) |
| `creation-circle.jpg` | [photo-1569864358642-9d1684040f43](https://images.unsplash.com/photo-1569864358642-9d1684040f43) |
| `creation-square.jpg` | [photo-1488477181946-6428a0291777](https://images.unsplash.com/photo-1488477181946-6428a0291777) |
| `about-cupcake.jpg` | [photo-1426869884541-df7117556757](https://images.unsplash.com/photo-1426869884541-df7117556757) |
| `about-stand.jpg` | [photo-1486427944299-d1955d23e34d](https://images.unsplash.com/photo-1486427944299-d1955d23e34d) |
| `gal-bakery.jpg` | [photo-1517433670267-08bbd4be890f](https://images.unsplash.com/photo-1517433670267-08bbd4be890f) |
| `gal-cinnamon.jpg` | [photo-1509365465985-25d11c17e812](https://images.unsplash.com/photo-1509365465985-25d11c17e812) |
| `gal-cheesecake.jpg` | [photo-1533134486753-c833f0ed4866](https://images.unsplash.com/photo-1533134486753-c833f0ed4866) |
| `gal-cupcakes.jpg` | [photo-1612203985729-70726954388c](https://images.unsplash.com/photo-1612203985729-70726954388c) |
| `gal-macarons.jpg` | [photo-1558326567-98ae2405596b](https://images.unsplash.com/photo-1558326567-98ae2405596b) |
| `gal-tart.jpg` | [photo-1464305795204-6f5bbfc7fb81](https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81) |
| `gal-slice.jpg` | [photo-1588195538326-c5b1e9f80a1b](https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b) |
| `gal-cookies2.jpg` | [photo-1558961363-fa8fdf82db35](https://images.unsplash.com/photo-1558961363-fa8fdf82db35) |
| `gal-pink.jpg` | [photo-1535141192574-5d4897c12636](https://images.unsplash.com/photo-1535141192574-5d4897c12636) |
