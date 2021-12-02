import { Client, Intents, Message } from "discord.js";
import config from "./config";
import { countStringsInArray, NO_EMOJI, YES_EMOJI } from "./emojis";
import { createCancelImage } from "./imageFormatting/cancelImage";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "cancel") {
    const cancelledUser = interaction.options.getUser("użytkownik");
    if (!cancelledUser) return;

    const attachment = await createCancelImage(interaction.user, cancelledUser);

    const baseMessage = `<@${interaction.user.id}> chce zcancellować <@${cancelledUser.id}>`;

    const message = (await interaction.reply({
      files: [attachment],
      allowedMentions: { users: [interaction.user.id] },
      content: baseMessage,
      fetchReply: true,
    })) as Message<true>;

    await message.react("✅");
    await message.react("❌");

    let seconds = 15;
    let emojis: string[];
    const interval = setInterval(async () => {
      seconds -= 1;
      await message.edit(`${baseMessage}\nZostało ${seconds} sekund`);
      if (seconds === 0) {
        clearInterval(interval);

        const yesCount = countStringsInArray(YES_EMOJI, emojis);
        const noCount = countStringsInArray(NO_EMOJI, emojis);

        await message.reply(
          `<@${interaction.user.id}> zcancellował <@${cancelledUser.id}>
          \n${YES_EMOJI}: ${yesCount}
          \n${NO_EMOJI}: ${noCount}`
        );
      }
    }, 1000);
    const collector = message.createReactionCollector({ time: seconds * 1000 });
    collector.on("collect", (r) => {
      console.log(`Collected ${r.emoji.name}`);
    });
    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} items`);
      console.log();
      emojis = collected.map((reaction) => reaction.emoji.name || "");
    });
  }
});

client.login(config.TOKEN);
