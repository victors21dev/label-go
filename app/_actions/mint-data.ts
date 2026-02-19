import crypto from "crypto";

const SECRET = process.env.CRYPTO_SECRET || "zedamanga";

function b64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function keyFromSecret(secret: string) {
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

// Esta é a função que você chamará de outros arquivos
export function generateEncryptedToken(payload: object) {
  const key = keyFromSecret(SECRET);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");

  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Formato: iv (12) + ciphertext + tag (16)
  const packed = Buffer.concat([iv, ciphertext, tag]);
  return b64url(packed);
}
