import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import crypto from "crypto";
import { handleBranchChange, type PushEvent } from "./github";

const app = new Koa();
const router = new Router();

const GITHUB_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "my-secret";

app.use(
  bodyParser({
    enableTypes: ["json"],
    extendTypes: { json: ["application/json"] },
    onerror: (err, ctx) => {
      ctx.throw(422, "Invalid body");
    },
  })
);

function verifySignature(body: any, signature?: string): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", GITHUB_SECRET);
  const digest = "sha256=" + hmac.update(JSON.stringify(body)).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

router.post("/github/webhook", async (ctx) => {
  const signature = ctx.headers["x-hub-signature-256"] as string;
  const event = ctx.headers["x-github-event"];

  if (!verifySignature(ctx.request.body, signature)) {
    ctx.status = 401;
    ctx.body = { error: "Invalid signature" };
    return;
  }

  if (event === "push") {
    const payload = ctx.request.body as PushEvent;

    handleBranchChange(payload, "main"); // 👈 branche à écouter
  }

  ctx.status = 200;
  ctx.body = { ok: true };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
