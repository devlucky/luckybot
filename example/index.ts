import LuckyBot from '../src';

const run = async () => {
  const user = process.env.LUCKYBOT_USER;
  const pass = process.env.LUCKYBOT_PASS;

  if (!user || !pass) {
    throw new Error('No username or password')
  }

  const cookiePath = `${__dirname}/cookies`;
  // const proxyUrl = 'http://127.0.0.1:8213'
  const bot = new LuckyBot(user, pass, {debug: true, cookiePath});

  await bot.login();
  // await likeFollowersPhotos(bot);
  await likeHashtag(bot);
  console.log('CLOSE...');
  await bot.close();
};

const likeHashtag = async (bot: LuckyBot) => {
  const hastag = process.env.LUCKYBOT_HASTAG || 'travelphotography';

  await bot.likePhotos(hastag, {maxLikes: 5});
}

const getUser = async (bot: LuckyBot, username: string) => {
  const user = await bot.getUser(username);

  console.log(user)
}

run();