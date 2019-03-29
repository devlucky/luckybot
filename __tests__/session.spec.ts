jest.mock('puppeteer');

import { Session } from "../src/session";
import { mockPageProvider } from "./mocks";

describe('Session', () => {
  it('should go to login page and login', async () => {
    const session = new Session();
    const pageProvider = mockPageProvider();
    (session as any).pageProvider = pageProvider;

    const sessionCookies = await session.login('username', 'some-pass');

    expect(pageProvider.goto).toBeCalledWith('https://www.instagram.com/accounts/login')
    expect(pageProvider.type).toBeCalledTimes(2);
    expect(pageProvider.type).toBeCalledWith('username')
    expect(pageProvider.type).toBeCalledWith('some-pass')
    expect(sessionCookies).toEqual({cookieName: 'cookieValue'})
  });

  it('should return the session cookies if user its already logged in', () => {

  });
})