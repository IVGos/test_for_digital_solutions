import express from "express";
import type { Response, ErrorRequestHandler } from "express";
import { z } from "zod";
import type { RootStore, Result, StoreError } from "./store.ts";



const pageQuery = z.object({
  filter: z.string().regex(/^\d*$/, "filter: только цифры").max(16).default(""),
  cursor: z.coerce.number().int().nonnegative().optional(),
});

const idBody = z.object({
  id: z.number().int().positive(),
});

const moveBody = z.object({
  id: z.number().int().positive(),
  targetId: z.number().int().positive(),
  place: z.enum(["before", "after"]),
});



type ErrorCode = StoreError | "validation_error" | "internal_error";

const STATUS: Record<ErrorCode, number> = {
  validation_error: 400,
  invalid_id: 400,
  item_not_found: 404,
  not_selected: 409,
  duplicate_item: 409,
  internal_error: 500,
};

function sendError(res: Response, code: ErrorCode, message: string = code) {
  res.status(STATUS[code]).json({ error: { code, message } });
}

function sendResult(res: Response, result: Result) {
  if (result.ok) res.json({ ok: true });
  else sendError(res, result.error);
}



export function createApp(store: RootStore) {
  const app = express();
  app.use(express.json());

  app.get("/api/left", (req, res) => {
    const q = pageQuery.safeParse(req.query);
    if (!q.success) return sendError(res, "validation_error", q.error.issues[0]?.message);
    res.json(store.getLeftItems(q.data.filter, q.data.cursor ?? null));
  });

  app.get("/api/right", (req, res) => {
    const q = pageQuery.safeParse(req.query);
    if (!q.success) return sendError(res, "validation_error", q.error.issues[0]?.message);
    res.json(store.getRightItems(q.data.filter, q.data.cursor ?? null));
  });

  app.post("/api/select", (req, res) => {
    const b = idBody.safeParse(req.body);
    if (!b.success) return sendError(res, "validation_error", b.error.issues[0]?.message);
    sendResult(res, store.selectItem(b.data.id));
  });

  app.post("/api/deselect", (req, res) => {
    const b = idBody.safeParse(req.body);
    if (!b.success) return sendError(res, "validation_error", b.error.issues[0]?.message);
    sendResult(res, store.deselectItem(b.data.id));
  });

  app.post("/api/move", (req, res) => {
    const b = moveBody.safeParse(req.body);
    if (!b.success) return sendError(res, "validation_error", b.error.issues[0]?.message);
    sendResult(res, store.moveItem(b.data.id, b.data.targetId, b.data.place));
  });

  app.post("/api/add", (req, res) => {
    const b = idBody.safeParse(req.body);
    if (!b.success) return sendError(res, "validation_error", b.error.issues[0]?.message);
    sendResult(res, store.addItem(b.data.id));
  });

  //  неожиданная ошибка превращается в JSON 500.
  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    sendError(res, "internal_error", "Internal server error");
  };
  app.use(onError);

  return app;
}