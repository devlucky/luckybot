# luckybot
> Opinionated Instagram automation tool


### Install

```
$ yarn add luckybot
```

### Usage

```typescript
import LuckyBot from 'luckybot'

const bot = new LuckyBot('my_user', 'password');

await bot.login();
await bot.likePhotos('travel', {maxLikes: 50});
await bot.close();
```

### Development

**install dependencies**

```
$ yarn
```

**run dev mode**

```
$ LUCKYBOT_USER=your_instagram_user LUCKYBOT_PASS=your_instagram_password LUCKYBOT_HASTAG=hashtag_to_like yarn dev
```

**check types**

```
$ yarn typecheck
```

**build**

```
$ yarn build
```

**tests**

```
$ yarn test
```

Watch mode

```
$ yarn test --watch
```