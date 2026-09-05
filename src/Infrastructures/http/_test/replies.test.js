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

const createComment = async (app, accessToken, threadId, payload = { content: 'sebuah comment' }) => {
  const response = await request(app)
    .post(`/threads/${threadId}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(payload);

  return response.body.data.addedComment.id;
};

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
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

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);
      const commentId = await createComment(app, accessToken, threadId);

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedReply).toBeDefined();
      expect(response.body.data.addedReply.content).toEqual('sebuah balasan');
    });

    it('should response 401 when request does not contain access token', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);
      const commentId = await createComment(app, accessToken, threadId);

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .send({ content: 'sebuah balasan' });

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 404 when comment does not exist', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments/comment-xxx/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });

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
      const commentId = await createComment(app, accessToken, threadId);

      // Action
      const response = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when reply owner deletes their reply', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);
      const commentId = await createComment(app, accessToken, threadId);
      const replyResponse = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });
      const { id: replyId } = replyResponse.body.data.addedReply;

      // Action
      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies[0].is_delete).toEqual(true);
    });

    it('should response 403 when the requester is not the reply owner', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken: ownerToken } = await registerAndLoginUser(app, {
        username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      const { accessToken: otherToken } = await registerAndLoginUser(app, {
        username: 'johndoe', password: 'secret', fullname: 'John Doe',
      });
      const threadId = await createThread(app, ownerToken);
      const commentId = await createComment(app, ownerToken, threadId);
      const replyResponse = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ content: 'sebuah balasan' });
      const { id: replyId } = replyResponse.body.data.addedReply;

      // Action
      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 404 when reply does not exist', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const threadId = await createThread(app, accessToken);
      const commentId = await createComment(app, accessToken, threadId);

      // Action
      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/reply-xxx`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });
  });
});
