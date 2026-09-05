import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // Env loading is handled by src/Commons/config.js (NODE_ENV-aware: it loads
    // .test.env under test, .env otherwise). Preloading 'dotenv/config' here would
    // populate process.env from .env first, and since dotenv never overrides
    // already-set vars, config.js's .test.env load would then be a silent no-op.
    // Integration/functional tests share one real Postgres database (not per-worker
    // isolated), so test files must also run sequentially to avoid cross-file id collisions.
    fileParallelism: false,
  },
});