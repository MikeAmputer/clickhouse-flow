import { parseEnv } from "znv";
import { z } from "zod";

export const ENV = parseEnv(process.env, {
  CHF_CONFIG_PATH: z.string().nonempty().optional().default('/app/config/config.json'),
  CHF_CACHE_CONFIG: z.coerce.boolean().optional().default(true),

  CHF_DB_URL: z.string().nonempty().optional(),
  CHF_DB_USERNAME: z.string().nonempty().optional(),
  CHF_DB_PASSWORD: z.string().optional(),
  CHF_DB_NAME: z.string().nonempty().optional(),
  CHF_DB_CONFIG_NAME: z.string().nonempty().optional(),

  CHF_EXPORT_FORMAT: z.enum(['PDF', 'SVG']).optional(),
  CHF_EXPORT_PADDING: z.coerce.number().int().nonnegative().optional(),

  CHF_CANVAS_SNAP_TO_GRID: z.coerce.boolean().optional(),
  CHF_CANVAS_GRID_SIZE: z.coerce.number().int().positive().optional(),
  CHF_CANVAS_AUTO_FIT_VIEW: z.coerce.boolean().optional(),
  CHF_CANVAS_BACKGROUND_COLOR: z
    .string()
    .nonempty()
    .regex(/^#([0-9a-fA-F]{6})$/, {
      message: 'Invalid hex color format. Expected format: #rrggbb',
    })
    .optional(),

  CHF_MAT_VIEWS_RENDER_MODE: z.enum(['ROWS', 'AS_SELECT', 'CREATE_COMMAND']).optional(),

  NODE_ENV: z.enum(['development', 'production', 'test']),
});