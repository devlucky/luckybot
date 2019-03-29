import LuckyBot from '../src';

const ninetyMin = 90 * 60 * 1000;
const run = async () => {
  const user = process.env.LUCKYBOT_USER;
  const pass = process.env.LUCKYBOT_PASS;
  const hastag = process.env.LUCKYBOT_HASTAG || 'nepaltravel';

  if (!user || !pass) {
    throw new Error('No username or password')
  }
  
  const bot = new LuckyBot(user, pass);

  console.log('LOGIN...')
  await bot.login();
  console.log('LIKING PHOTOS...')
  await bot.likePhotos(hastag, {maxLikes: 5});
  console.log('CLOSE...')
  await bot.close();
};

run();
setInterval(run, ninetyMin)