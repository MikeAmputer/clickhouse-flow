import { parseEnv } from "znv";
import { z } from "zod";

export const ENV = parseEnv(process.env, {
  CHF_CONFIG_PATH: z.string().nonempty().optional().default('/app/config/config.json'),
  CHF_CACHE_CONFIG: z.coerce.boolean().optional().default(true),

  CHF_DEFAULT_DB_URL: z.string().nonempty().optional(),
  CHF_DEFAULT_DB_USERNAME: z.string().nonempty().optional(),
  CHF_DEFAULT_DB_PASSWORD: z.string().optional(),
  CHF_DEFAULT_DB_NAME: z.string().nonempty().optional(),
  CHF_DEFAULT_DB_CONFIG_NAME: z.string().nonempty().optional(),

  CHF_EXPORT_FORMAT: z.enum(['PDF', 'SVG']).optional(),
  CHF_EXPORT_PADDING: z.coerce.number().int().nonnegative().optional(),

  NODE_ENV: z.enum(['development', 'production', 'test']),
});