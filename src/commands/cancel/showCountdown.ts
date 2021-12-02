import { Message } from "discord.js";

export default ({
  message,
  seconds,
  baseMessage,
}: {
  message: Message<true>;
  seconds: number;
  baseMessage: string;
}) => {
  let secondsToWait = seconds;
  const interval = setInterval(async () => {
    secondsToWait -= 1;
    if (secondsToWait < 0) {
      clearInterval(interval);
      await message.edit(`${baseMessage}\nKoniec głosowania`);
    } else {
      await message.edit(`${baseMessage}\nZostało ${secondsToWait} sekund`);
    }
  }, 1000);
  return interval;
};
