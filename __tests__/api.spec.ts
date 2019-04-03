jest.mock('instagram-private-api');
jest.mock('../src/util/sleep')

import InstagramClient from 'instagram-private-api';
import { RestApi } from "../src/strategies/api";

describe('Api Strategy', () => {
  const setup = () => {
    const searchResults: any[] = [{
      id: '1', _params: {webLink: ''}
    }, {
      id: '2', _params: {webLink: ''}
    }, {
      id: '3', _params: {webLink: ''}
    }, {
      id: '4', _params: {webLink: ''}
    }];
    const sessionValue = {}

    InstagramClient.V1.Feed.TaggedMedia.mockImplementation(() => ({
      get: () => searchResults
    }))
    InstagramClient.V1.Session.create.mockReturnValue(sessionValue)

    return {
      searchResults,
      sessionValue
    }
  }

  describe('login()', () => {
    it('should create a session with the right params', async () => {
      const {sessionValue} = setup();
      const api = new RestApi();
      const session = await api.login('some-user', 'some-pass');

      expect(InstagramClient.V1.Session.create).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        'some-user',
        'some-pass'
      )
      expect(session).toEqual(sessionValue)
    });

    it('should use given cookiePath', async () => {
      setup();
      const api = new RestApi({cookiePath: 'some-folder'});
      await api.login('some-user', 'some-pass');

      expect(InstagramClient.V1.CookieFileStorage).toBeCalledTimes(1)
      expect(InstagramClient.V1.CookieFileStorage).toBeCalledWith('some-folder/some-user.json')
    });
  });

  describe('likeMedias()', () => {
    it('should limit the number of likes', async () => {
      setup();
      const api = new RestApi();
      const likedMedia = await api.likeMedias('dogs', {maxLikes: 2});
      expect(likedMedia).toHaveLength(2);
      expect(likedMedia).toEqual([{id: '1', webLink: ''}, {id: '2', webLink: ''}])
    });
  
    it('should pass hashtag to search method', async () => {
      setup();
      const api = new RestApi();
      await api.likeMedias('dogs', {maxLikes: 2});
  
      expect(InstagramClient.V1.Feed.TaggedMedia).toBeCalledTimes(1);
      expect(InstagramClient.V1.Feed.TaggedMedia).toBeCalledWith(undefined, 'dogs')
    });

    it('should pass the session when searching', async () => {
      const {sessionValue} = setup();
      const api = new RestApi();

      await api.login('', '');
      await api.likeMedias('dogs', {maxLikes: 2});
  
      expect(InstagramClient.V1.Feed.TaggedMedia).toBeCalledWith(sessionValue, 'dogs')
    })
  })
});