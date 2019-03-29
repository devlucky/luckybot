export const mockPageProvider = () => {
  const goto = jest.fn();
  const type = jest.fn();
  const click = jest.fn();
  const waitForSelector = jest.fn().mockReturnValue({
    type,
    click
  });
  const waitForNavigation = jest.fn();
  const cookies = jest.fn().mockReturnValue({cookieName: 'cookieValue'});
  const getPage = () => ({
    goto,
    waitForSelector,
    waitForNavigation,
    cookies
  });

  return {
    getPage,
    goto,
    type
  }
}