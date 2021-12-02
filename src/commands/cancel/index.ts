import {
  CommandInteraction,
  CacheType,
  Message,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import {
  countEmojis,
  YES_EMOJI,
  NO_EMOJI,
  getUsersIdByEmoji,
} from "../../emojis";
import { createCancelImage } from "../../imageFormatting/cancelImage";
import showCountdown from "./showCountdown";
import getEmojis from "./getEmojis";

export default async (interaction: CommandInteraction<CacheType>) => {
  const prisma = new PrismaClient();

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

  const seconds = 15;

  showCountdown({ message, seconds, baseMessage });

  const emojis = await getEmojis(message, seconds);

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
};
