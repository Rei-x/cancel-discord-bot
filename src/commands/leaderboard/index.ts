import { CommandInteraction, CacheType } from "discord.js";
import { PrismaClient } from "@prisma/client";
import * as converter from "discord-emoji-convert";

export default async (interaction: CommandInteraction<CacheType>) => {
  const prisma = new PrismaClient();

  const users = await prisma.cancels.groupBy({
    by: ["cancelledUserId"],
    where: {
      guildId: interaction.guildId,
      cancelled: true,
    },
    _count: true,
    orderBy: {
      _count: {
        cancelledUserId: "desc",
      },
    },
  });

  const message = await Promise.all(
    users.map(
      async (user) =>
        `${
          (
            await interaction.client.users.fetch(user.cancelledUserId)
          ).username
        } - ${converter.convert(user._count.toString())} cancels`
    )
  );
  await interaction.reply(message.join("\n"));
};
