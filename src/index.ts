import { Client, Intents } from "discord.js";
import config from "./config";
import cancel from "./commands/cancel";
import leaderboard from "./commands/leaderboard";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "cancel") {
    await cancel(interaction);
  }
  if (interaction.commandName === "tabela") {
    await leaderboard(interaction);
  }
});

client.login(config.TOKEN);
