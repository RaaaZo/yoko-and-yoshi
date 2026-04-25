import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  redact: {
    paths: [
      "*.password",
      "*.email",
      "headers.authorization",
      "headers.cookie",
      "*.access_token",
      "*.refresh_token",
      "*.service_role_key",
      "process.env.SUPABASE_SERVICE_ROLE_KEY",
      "process.env.RESEND_API_KEY",
      "process.env.UPSTASH_REDIS_REST_TOKEN",
    ],
    censor: "[REDACTED]",
  },
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "HH:MM:ss" },
    },
  }),
});
