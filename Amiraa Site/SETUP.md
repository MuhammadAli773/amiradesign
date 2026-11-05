# Amiraa Designs – going live

## 1. Put the site on GitHub
1. Create a free account at github.com, then a new repository (e.g. `amiraa-site`).
2. Upload everything in this folder to it (Add file -> Upload files).
3. Open `admin/config.yml` and change `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME`
   to your real username/repository name. Commit the change.

## 2. Publish on Cloudflare Pages (free)
Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git -> pick the repository.
Leave the build command empty and the output folder as `/`. Deploy.
Then add your own domain under Custom domains.

## 3. Log in to the admin panel
Go to `yourdomain.com/admin` and choose the sign-in-with-token option.
Create a GitHub fine-grained personal access token limited to this one repository with
"Contents: Read and write", and paste it in. After that you can:
- Collections: change prices, add or remove pieces, upload photos.
- Blog Posts: write new stories, add photos, mark one as Featured.
Press Save/Publish and the live site updates in a minute or two.

## Still to do
- Add the 4 missing images (their names are in `data/products.json` and `data/blog.json`),
  or replace them with new photos in the admin panel.
- The contact form does not send messages yet (connect Formspree or Web3Forms).
- Replace the `#` links in the footer (Instagram, Privacy, Terms, Careers).
- Optional: after checking the current release on npmjs.com, pin the version in
  `admin/index.html` (change `@sveltia/cms` to `@sveltia/cms@x.y.z`).
