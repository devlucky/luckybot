jest.mock('puppeteer');
import { PageProvider } from "../src/page";

describe('PageProvider', () => {
  it('should return the same page instance', async () => {
    const pageProvider = new PageProvider();
    const pageA = await pageProvider.getPage();
    const pageB = await pageProvider.getPage();
    
    expect(pageA).toEqual(pageB);
  })
});