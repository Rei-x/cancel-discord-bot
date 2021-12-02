import { Message, CollectorFilter, MessageReaction, User, Collection } from "discord.js";
import { YES_EMOJI, NO_EMOJI } from "../../emojis";

export default async (
  message: Message<true>,
  seconds: number
): Promise<Record<string, Collection<string, User>>> => {
  const filter: CollectorFilter<[MessageReaction, User]> = (reaction, user) =>
    [YES_EMOJI, NO_EMOJI].includes(reaction.emoji.name || "") && !user.bot;

  const collector = message.createReactionCollector({
    filter,
    time: seconds * 1000,
  });

  collector.on("collect", (r) => {
    console.log(`Collected ${r.emoji}`);
  });

  return new Promise<Record<string, Collection<string, User>>>((resolve) => {
    collector.on("end", async (collected) => {
      console.log(`Collected ${collected.size} items`);

      const emojis = await collected.reduce(async (acc, reaction) => {
        const awaitedAcc = await acc;
        awaitedAcc[reaction.emoji.name || "unnamed"] = (
          await reaction.users.fetch()
        ).filter((user) => !user.bot);
        return awaitedAcc;
      }, Promise.resolve({}) as Promise<Record<string, Collection<string, User>>>);

      resolve(emojis);
    });
  });
};
