import {
  Client,
  Collection,
  CollectorFilter,
  Intents,
  Message,
  MessageReaction,
  User,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import config from "./config";
import { countEmojis, getUsersIdByEmoji, NO_EMOJI, YES_EMOJI } from "./emojis";
import { createCancelImage } from "./imageFormatting/cancelImage";

const prisma = new PrismaClient();

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
    let emojis: { [x: string]: Collection<string, User> };
    const interval = setInterval(async () => {
      seconds -= 1;
      await message.edit(`${baseMessage}\nZostało ${seconds} sekund`);
      if (seconds === 0) {
        clearInterval(interval);

        const yesCount = countEmojis(emojis, YES_EMOJI);
        const noCount = countEmojis(emojis, NO_EMOJI);
        console.log(yesCount);
        const isCancelled = yesCount > noCount;
        if (isCancelled) {
          await message.reply(
            `<@${interaction.user.id}> zcancellował <@${cancelledUser.id}>
            \n${YES_EMOJI}: ${yesCount}  ${NO_EMOJI}: ${noCount}`
          );
        } else {
          await message.reply(
            `<@${interaction.user.id}> nie udało się zcancellować <@${cancelledUser.id}>
            \n${YES_EMOJI}: ${yesCount}  ${NO_EMOJI}: ${noCount}`
          );
        }
        await prisma.cancels.create({
          data: {
            guildId: interaction.guildId,
            cancelledUserId: cancelledUser.id,
            whoStartedId: interaction.user.id,
            whoVotedForYes: getUsersIdByEmoji(emojis, YES_EMOJI),
            whoVotedForNo: getUsersIdByEmoji(emojis, NO_EMOJI),
            cancelled: isCancelled,
          },
        });
      }
    }, 1000);

    const filter: CollectorFilter<[MessageReaction, User]> = (reaction, user) =>
      [YES_EMOJI, NO_EMOJI].includes(reaction.emoji.name || "") && !user.bot;

    const collector = message.createReactionCollector({
      filter,
      time: seconds * 1000,
    });

    collector.on("collect", (r) => {
      console.log(`Collected ${r.emoji}`);
    });
    collector.on("end", async (collected) => {
      console.log(`Collected ${collected.size} items`);

      emojis = await collected.reduce(async (acc, reaction) => {
        const awaitedAcc = await acc;
        awaitedAcc[reaction.emoji.name || "unnamed"] = (
          await reaction.users.fetch()
        ).filter((user) => !user.bot);
        return awaitedAcc;
      }, Promise.resolve({}) as Promise<Record<string, Collection<string, User>>>);
    });
  }
});

client.login(config.TOKEN);
