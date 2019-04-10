import LuckyBot from '../src';

const run = async () => {
  const user = process.env.LUCKYBOT_USER;
  const pass = process.env.LUCKYBOT_PASS;

  if (!user || !pass) {
    throw new Error('No username or password')
  }

  const cookiePath = `${__dirname}/cookies`;
  const bot = new LuckyBot(user, pass, {debug: true, cookiePath});

  await bot.login();
  await likeFollowersPhotos(bot);
  // await likeHashtag(bot);
  console.log('CLOSE...');
  await bot.close();
};

const likeFollowersPhotos = async (bot: LuckyBot) => {
  const likedMedias = await bot.likeFollowersPhotos('5465909933', {maxLikes: 2});
  console.log({likedMedias});
}

const likeHashtag = async (bot: LuckyBot) => {
  const hastag = process.env.LUCKYBOT_HASTAG || 'travelphotography';

  await bot.likePhotos(hastag, {maxLikes: 5});
}

run();