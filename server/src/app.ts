import express from "express";
import type { Response, ErrorRequestHandler } from "express";
import { z } from "zod";
import type { RootStore, Result, StoreError } from "./store.ts";
import { createBatcher } from "./batcher.ts";
import path from "node:path";

const zQuery = z.object({
  filter: z.string().regex(/^\d*$/, "filter: только цифры").max(16).default(""),
  cursor: z.coerce.number().int().nonnegative().optional(),
});

const idBody = z.object({
  id: z.number().int().positive(),
});

const moveBody = z.object({
  id: z.number().int().positive(),
  targetId: z.number().int().positive(),
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

  const readQueue = createBatcher(1000); //чтение и изменения
  const addToQueue = createBatcher(10000); //добавления

  app.get("/api/left", async (req, res) => {
    const q = zQuery.safeParse(req.query);
    if (!q.success)
      return sendError(res, "validation_error", q.error.issues[0]?.message);
    const { filter, cursor } = q.data;
    res.json(
      await readQueue.putTaskToQueue(
        `left:${filter}:${cursor ?? ""}`,
        () => store.getLeftItems(filter, cursor ?? null),
        false,
      ),
    );
  });

  app.get("/api/right", async (req, res) => {
    const q = zQuery.safeParse(req.query);
    if (!q.success)
      return sendError(res, "validation_error", q.error.issues[0]?.message);
    const { filter, cursor } = q.data;
    res.json(
      await readQueue.putTaskToQueue(
        `right:${filter}:${cursor ?? ""}`,
        () => store.getRightItems(filter, cursor ?? null),
        false,
      ),
    );
  });

  app.post("/api/select", async (req, res) => {
    const body = idBody.safeParse(req.body);
    if (!body.success)
      return sendError(res, "validation_error", body.error.issues[0]?.message);
    const { id } = body.data;
    sendResult(
      res,
      await readQueue.putTaskToQueue(
        `select:${id}`,
        () => store.selectItem(id),
        true,
      ),
    );
  });

  app.post("/api/deselect", async (req, res) => {
    const body = idBody.safeParse(req.body);
    if (!body.success)
      return sendError(res, "validation_error", body.error.issues[0]?.message);
    const { id } = body.data;
    sendResult(
      res,
      await readQueue.putTaskToQueue(
        `deselect:${id}`,
        () => store.deselectItem(id),
        true,
      ),
    );
  });

  app.post("/api/move", async (req, res) => {
    const body = moveBody.safeParse(req.body);
    if (!body.success)
      return sendError(res, "validation_error", body.error.issues[0]?.message);
    const { id, targetId } = body.data;
    sendResult(
      res,
      await readQueue.putTaskToQueue(
        `move:${id}:${targetId}`,
        () => store.moveItem(id, targetId),
        true,
      ),
    );
  });

  app.post("/api/add", async (req, res) => {
    const body = idBody.safeParse(req.body);
    if (!body.success)
      return sendError(res, "validation_error", body.error.issues[0]?.message);
    const { id } = body.data;
    sendResult(
      res,
      await addToQueue.putTaskToQueue(
        `add:${id}`,
        () => store.addItem(id),
        true,
      ),
    );

   
  });

 //сборка фронта
    app.use(
      express.static(path.resolve(import.meta.dirname, "../../client/dist")),
    );
    
  //  неожиданная ошибка превращается в JSON 500.
  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    sendError(res, "internal_error", "Internal server error");
  };
  app.use(onError);

  return app;
}
