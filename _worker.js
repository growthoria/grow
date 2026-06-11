export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/content" && request.method === "GET") {
      if (!env.GROWTHORIA_KV) {
        return new Response("{}", {
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store"
          }
        });
      }

      const saved = await env.GROWTHORIA_KV.get("site-content");
      return new Response(saved || "{}", {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store"
        }
      });
    }

    if (url.pathname === "/api/content" && request.method === "POST") {
      const password = request.headers.get("x-admin-password");

      if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
        return new Response("Unauthorized", { status: 401 });
      }

      if (!env.GROWTHORIA_KV) {
        return new Response("Missing GROWTHORIA_KV binding", { status: 500 });
      }

      const content = await request.json();
      await env.GROWTHORIA_KV.put("site-content", JSON.stringify(content));

      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
