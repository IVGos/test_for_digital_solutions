import { createApp } from "./app.ts";
import { createStore } from "./store.ts";

const PORT = Number(process.env.PORT) || 3000;
const app = createApp(createStore());

app.listen(PORT, () => {
  console.log(`server: http://localhost:${PORT}`);
});