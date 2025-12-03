import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 config: used by `prisma migrate` and other CLI commands
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
