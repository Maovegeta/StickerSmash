// utils/logger.ts

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

export const Logger = {
  info: (msg: string, data?: any) =>
    console.log(`${COLORS.green}[INFO]${COLORS.reset} ${msg}`, data ?? ""),

  warn: (msg: string, data?: any) =>
    console.warn(`${COLORS.yellow}[WARN]${COLORS.reset} ${msg}`, data ?? ""),

  error: (msg: string, data?: any) =>
    console.error(`${COLORS.red}[ERROR]${COLORS.reset} ${msg}`, data ?? ""),

  debug: (msg: string, data?: any) =>
    console.log(`${COLORS.cyan}[DEBUG]${COLORS.reset} ${msg}`, data ?? ""),
};
