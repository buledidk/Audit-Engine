/**
 * ENCRYPTION SERVICE - AES-256-CBC for PII data protection
 * Used for encrypting sensitive data like email, SSN, bank details
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || "default-32-byte-key-do-not-use").padEnd(32, "0").slice(0, 32);

export const encrypt = (data) => {
  if (!data) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (data) => {
  if (!data) return null;
  const [iv, encrypted] = data.split(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

export default { encrypt, decrypt };
