import LuckyBot from '../src';

const ninetyMin = 90 * 60 * 1000;
const run = async () => {
  const user = process.env.LUCKYBOT_USER;
  const pass = process.env.LUCKYBOT_PASS;
  const hastag = process.env.LUCKYBOT_HASTAG || 'travelphotography';

  if (!user || !pass) {
    throw new Error('No username or password')
  }

  const cookiePath = `${__dirname}/cookies`;
  const bot = new LuckyBot(user, pass, {debug: true, cookiePath});

  await bot.login();
  await bot.likePhotos(hastag, {maxLikes: 5});
  await bot.close();
};

const likeFollowersPhotos = async (bot: LuckyBot) => {
  const followers = await bot.getFollowers('');
  console.log(followers);
}

run();