import * as dotenv from "dotenv";
dotenv.config();

export const adminSecret = process.env.ADMIN_SECRET as string;
export const adminKey = process.env.ADMIN_KEY as string;
