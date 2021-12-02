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
    await message.edit(`${baseMessage}\nZostało ${secondsToWait} sekund`);
    if (secondsToWait === 0) {
      clearInterval(interval);
      await message.edit(`${baseMessage}\nKoniec głosowania`);
    }
  }, 1000);
};
