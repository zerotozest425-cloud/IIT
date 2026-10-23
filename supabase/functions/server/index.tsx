import { Hono } from "npm:hono"
import { cors } from "npm:hono/cors"
import { logger } from "npm:hono/logger"

const app = new Hono()
const routePrefix = "/make-server-232c1997"

app.use("*", logger(console.log))
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
)

app.get(`${routePrefix}/health`, (c) => c.json({ status: "ok" }))

Deno.serve(app.fetch)
