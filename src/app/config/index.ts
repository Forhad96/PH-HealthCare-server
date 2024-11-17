import dotenv from "dotenv";
import path from "path";
import { cwd } from "process";

dotenv.config({ path: path.join(cwd(), ".env") });

export const config = {
  env: process.env.NODE_ENV,
  port:process.env.PORT,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expire_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
};
// NODE_ENV="development"
// DATABASE_URL="postgresql://postgres:123456@localhost:5432/ph_health_care?schema=public"
// PORT=5000
// ACCESS_TOKEN_SECRET="091b2c529dec033b5ff4531e622ea3f93170e045222963319662b7e4a34f0cdd"
// REFRESH_TOKEN_SECRET="41b991b21dc0a439cb45fed544992ba3fafa3f912d3c4dedebec3592d7d552fb74a86a4d69ea560bcf7bf988d173ddecaffa9815dd5a6661bcacd58c0cdb2dc5"
// ACCESS_TOKEN_EXPIRES_IN="15m"
// REFRESH_TOKEN_EXPIRES_IN="30d"
