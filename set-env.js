const fs = require("fs");
const path = require("path");

const apiUrl =
  process.env.API_URL ||
  "http://127.0.0.1:5001/atom-fb-task-manager/us-central1/api";
const isProd = process.env.NODE_ENV === "production";

const envDirectory = path.join(__dirname, "./src/environments");

if (!fs.existsSync(envDirectory)) {
  fs.mkdirSync(envDirectory);
}

const targetPath = isProd
  ? path.join(envDirectory, "environment.prod.ts")
  : path.join(envDirectory, "environment.ts");

const envConfigFile = `
export const environment = {
  production: ${isProd},
  apiUrl: '${apiUrl}',
  firebase: {
    apiKey: "${process.env.FIREBASE_API_KEY || ""}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || ""}",
    projectId: "${process.env.FIREBASE_PROJECT_ID || ""}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || ""}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || ""}",
    appId: "${process.env.FIREBASE_APP_ID || ""}"
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`✅ Environment file generated at ${targetPath}`);
