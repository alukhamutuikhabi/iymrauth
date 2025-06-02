import fs from "fs";
import path from "path";
import { generateKeyPairSync } from "crypto";
import { exportJWK } from "jose";

async function generateKeys() {
  const jwksPath = path.resolve(process.cwd(), process.env.OIDC_JWKS_PATH);
  
  if (fs.existsSync(jwksPath)) {
    console.log("JWKS already exists at", jwksPath);
    return;
  }

  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const pubJwk = await exportJWK(publicKey);
  const privJwk = await exportJWK(privateKey);
  pubJwk.kid = privJwk.kid = "default";

  const jwks = { keys: [pubJwk, privJwk] };

  fs.mkdirSync(path.dirname(jwksPath), { recursive: true });
  fs.writeFileSync(jwksPath, JSON.stringify(jwks, null, 2));
  console.log("Generated JWKS at", jwksPath);
}

generateKeys().catch(console.error);