import LuckyBot, { StrategyType } from '../src';

const ninetyMin = 90 * 60 * 1000;
const run = async () => {
  const user = 'ma';
  const pass = 'mmmm';
  const hastag = process.env.LUCKYBOT_HASTAG || 'nepaltravel';
  const bot = new LuckyBot(user, pass, StrategyType.PrivateAPIs);

  console.log('LOGIN...')
  await bot.login();
  console.log('LIKING PHOTOS...')
  await bot.likePhotos(hastag, {maxLikes: 5});
  console.log('CLOSE...')
  await bot.close();
};

run();
setInterval(run, ninetyMin)