const STATE_BYTES = 32;
const REFRESH_BYTES = 48;
const DEFAULT_ACCESS_EXPIRES_MS = 15 * 60 * 1000;
const DEFAULT_REFRESH_EXPIRES_MS = 30 * 24 * 60 * 60 * 1000;
const STATE_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;
const MS_IN = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

const parseDurationMs = (value, fallbackMs) => {
  if (!value) return fallbackMs;
  const match = String(value)
    .trim()
    .match(/^(\d+)([smhd])?$/i);
  if (!match) throw new Error("Invalid token expiration format");
  const amount = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();
  return amount * MS_IN[unit];
};

const stateCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: STATE_COOKIE_MAX_AGE_MS,
};

const accessCookieOptions = {
  httpOnly: false,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: parseDurationMs(
    process.env.JWT_ACCESS_EXPIRES,
    DEFAULT_ACCESS_EXPIRES_MS
  ),
};

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: parseDurationMs(
    process.env.JWT_REFRESH_EXPIRES,
    DEFAULT_REFRESH_EXPIRES_MS
  ),
};

export {
  STATE_BYTES,
  REFRESH_BYTES,
  DEFAULT_ACCESS_EXPIRES_MS,
  DEFAULT_REFRESH_EXPIRES_MS,
  parseDurationMs,
  stateCookieOptions,
  accessCookieOptions,
  refreshCookieOptions,
};
