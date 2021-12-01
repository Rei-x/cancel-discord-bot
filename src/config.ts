import dotenv from "dotenv";

dotenv.config();

const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;
if (!CLIENT_ID || !GUILD_ID || !TOKEN) {
  console.error(
    "Client ID, Guild ID or Token wasn't specified as environmental variable"
  );
  process.exit(1);
}

export default { CLIENT_ID, GUILD_ID, TOKEN };
