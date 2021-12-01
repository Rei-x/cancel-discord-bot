import { Client, Intents, Message } from "discord.js";
import config from "./config";
import { createCancelImage } from "./imageFormatting/cancelImage";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "cancel") {
    const cancelledUser = interaction.options.getUser("użytkownik");
    if (!cancelledUser) return;

    const attachment = await createCancelImage(interaction.user, cancelledUser);

    const message = (await interaction.reply({
      files: [attachment],
      allowedMentions: { users: [interaction.user.id] },
      content: `<@${interaction.user.id}> chce zcancellować <@${cancelledUser.id}> \n\n Cancellujemy?`,
      fetchReply: true,
    })) as Message<true>;
    await message.react("✅");
    await message.react("❌");
  }
});

client.login(config.TOKEN);
