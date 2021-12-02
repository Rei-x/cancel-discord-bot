import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "./config";

const commands = [
  new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Cancelluje oponenta")
    .addUserOption((option) =>
      option
        .setName("użytkownik")
        .setDescription("Użytkownik, którego chcesz zcancellować")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("tabela")
    .setDescription("Pokazuje tabele kto ile razy został zcancellowany"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(config.TOKEN);

rest
  .put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
