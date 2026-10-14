# For Ayesha 🤍

A personal scrapbook website: lock screen → animated envelope → My Girl → Someone's Mrs. → Now a Mama → closing line.

## Files
```
index.html   page structure and all the text
style.css    blush & cream scrapbook design, animations
script.js    password lock, envelope, petals, lightbox
images/      the 11 photos
```

## Publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `for-ayesha`). Set it to **Private** if your plan allows Pages for private repos, otherwise Public.
2. Upload everything in this folder (index.html, style.css, script.js and the `images` folder) to the repo root.
3. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/for-ayesha/`.

## Password
The password is `ayesha` (case doesn't matter). It is stored as a hash in `script.js` (`PASSWORD_HASH`).
To change it, open the site, press F12 → Console, run `hashPw("newword")`, and paste the number into `PASSWORD_HASH`.

This is a gentle lock for a gift, not real security: anyone who reads the source and photos folder could still get to the photos. Don't put anything truly private behind it.

## Easy edits
- Text: edit the paragraphs in `index.html` (search for `class="note`).
- Signature: search for `Forever yours, Ashmal`.
- Photos: replace files inside `images/` with the same file names, or change the `src` in `index.html`.
- Crop of a photo: change `--pos` on the `<figure>` (for example `center 20%`).
