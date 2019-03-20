import LuckyBot from '../src';

(async () => {
  const user = process.env.LUCKYBOT_USER;
  const pass = process.env.LUCKYBOT_PASS;
  const hastag = 'travelholic';

  if (!user || !pass) {
    throw new Error('No username or password')
  }
  
  const bot = new LuckyBot(user, pass);

  await bot.login();
  await bot.getPhotos(hastag);
})();