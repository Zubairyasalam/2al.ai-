/* eslint-disable @typescript-eslint/no-require-imports */
let PrismaClientModule = require("@prisma/client").PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export function getDb(): any {
  if (!globalForPrisma.prisma || !globalForPrisma.prisma.domain) {
    if (process.env.NODE_ENV !== "production") {
      // Clear Node.js require cache for Prisma so newly generated models are loaded from disk
      if (typeof require !== "undefined" && require.cache) {
        for (const key of Object.keys(require.cache)) {
          if (key.includes(".prisma") || key.includes("@prisma")) {
            delete require.cache[key];
          }
        }
      }
      try {
        PrismaClientModule = require("@prisma/client").PrismaClient;
      } catch (e) {
        console.error("Failed to reload PrismaClient:", e);
      }
    }
    globalForPrisma.prisma = new PrismaClientModule({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma: any = new Proxy({}, {
  get(_target, prop) {
    const db = getDb();
    const value = db[prop];
    if (typeof value === "function") {
      return value.bind(db);
    }
    return value;
  }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = getDb();

export default prisma;
