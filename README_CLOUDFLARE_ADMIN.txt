Growthoria Cloudflare Admin

Admin URL:
  /admin/

What is editable:
  - site title, description, email, phone, address
  - hero text/buttons
  - services: titles, descriptions, icons, prices, price suffixes, prepared request text
  - request form text and messages
  - about section and popups
  - nav popups
  - raw JSON for full editing

Important:
  Service card price and request-form dropdown price use the same JSON data. Change price once in /admin and it updates in both places.

Cloudflare Pages setup:
1. Deploy this folder to Cloudflare Pages.
2. Create a KV namespace.
3. Add KV binding in Pages settings:
   GROWTHORIA_KV = your namespace
4. Add environment variable:
   ADMIN_PASSWORD = your password
5. Redeploy.
6. Open /admin/ and save changes.


Current wrangler.toml has already been prepared with this KV namespace ID:
03c4ea796ec94c00b10ef8bd5a00b476

Cloudflare Pages variables still required:
- ADMIN_PASSWORD = your admin password

Cloudflare Pages KV binding must be:
- Binding name: GROWTHORIA_KV
- Namespace ID: 03c4ea796ec94c00b10ef8bd5a00b476

Important:
Do not name the binding ADMIN_PASSWORD. ADMIN_PASSWORD must be an environment variable/secret, not the KV binding.
