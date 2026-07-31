import app from "./app.js";
import { config } from "./config/env.js";

app.listen(config.port, "0.0.0.0", () => {
  console.log(`🚀 TB Quest Backend running on http://localhost:${config.port} [${config.nodeEnv}]`);
});
