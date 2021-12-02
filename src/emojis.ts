import { Collection, User } from "discord.js";

const YES_EMOJI = "✅";
const NO_EMOJI = "❌";

const countEmojis = (
  emojis: { [x: string]: Collection<string, User> },
  emoji: string
) => {
  if (emoji in emojis) return Array.from(emojis[emoji].values()).length;
  return 0;
};

const getUsersIdByEmoji = (
  emojis: { [x: string]: Collection<string, User> },
  emoji: string
) => {
  if (emoji in emojis) return Array.from(emojis[emoji].keys());
  return [];
};

export { YES_EMOJI, NO_EMOJI, countEmojis, getUsersIdByEmoji };
