import request from 'supertest';
import container from '../../container.js';
import createServer from '../createServer.js';

describe('/hello endpoint', () => {
  describe('when GET /hello', () => {
    it('should response 200 and Hello World message', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/hello');

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.message).toEqual('Hello World');
    });
  });
});
