import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

const registerAndLoginUser = async (app, {
  username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
} = {}) => {
  await request(app).post('/users').send({ username, password, fullname });

  const response = await request(app).post('/authentications').send({ username, password });

  return {
    accessToken: response.body.data.accessToken,
  };
};

const createThread = async (app, accessToken, payload = { title: 'sebuah thread', body: 'sebuah body thread' }) => {
  const response = await request(app)
    .post('/threads')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(payload);

  return response.body.data.addedThread.id;
};

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah comment' });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.content).toEqual('sebuah comment');
    });

    it('should response 401 when request does not contain access token', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .send({ content: 'sebuah comment' });

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);

      // Action
      const response = await request(app)
        .post('/threads/thread-xxx/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah comment' });

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 when comment owner deletes their comment', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);
      const commentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah comment' });
      const { id: commentId } = commentResponse.body.data.addedComment;

      // Action
      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments[0].is_delete).toEqual(true);
    });

    it('should response 403 when the requester is not the comment owner', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken: ownerToken } = await registerAndLoginUser(app, {
        username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      const { accessToken: otherToken } = await registerAndLoginUser(app, {
        username: 'johndoe', password: 'secret', fullname: 'John Doe',
      });
      const threadId = await createThread(app, ownerToken);
      const commentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ content: 'sebuah comment' });
      const { id: commentId } = commentResponse.body.data.addedComment;

      // Action
      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 404 when comment does not exist', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);

      // Action
      const response = await request(app)
        .delete(`/threads/${threadId}/comments/comment-xxx`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);

      // Action
      const response = await request(app)
        .delete('/threads/thread-xxx/comments/comment-xxx')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });
  });
});
