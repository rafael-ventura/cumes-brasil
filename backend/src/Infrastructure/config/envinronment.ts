import path from "path";
import * as env from "dotenv";

export const initializeEnvConfig = () => {
    console.log("initializeEnvConfig");
    const rootDir = path.resolve(__dirname, "../../../../");
    const envPath = path.join(rootDir, '.env');

    env.config({ path: envPath });
}