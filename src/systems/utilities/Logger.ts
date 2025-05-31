const isDev = process.env.NODE_ENV !== "PRODUCTION";

export const log = (...args: any[]) => {
  if (isDev) {
    console.log("[LOG]", ...args);
  }
};

export const warn = (...args: any[]) => {
  if (isDev) {
    console.warn("[WARN]", ...args);
  }
};

export const error = (...args: any[]) => {
  if (isDev) {
    console.error("[ERROR]", ...args);
  }
};
