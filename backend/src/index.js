import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./server.js";

const PORT = process.env.PORT || 5000;
const app = createServer();

app.listen(Number(PORT), () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
