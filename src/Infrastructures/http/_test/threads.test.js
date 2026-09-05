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

describe('/threads endpoint', () => {
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

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual(requestPayload.title);
    });

    it('should response 401 when request does not contain access token', async () => {
      // Arrange
      const app = await createServer(container);
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      // Action
      const response = await request(app).post('/threads').send(requestPayload);

      // Assert
      expect(response.status).toEqual(401);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const requestPayload = {
        title: 'sebuah thread',
      };

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken } = await registerAndLoginUser(app);
      const requestPayload = {
        title: 'sebuah thread',
        body: 12345,
      };

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/threads/thread-xxx');

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });

    it('should response 200 and thread detail with comments and replies correctly ordered, and hide deleted content', async () => {
      // Arrange
      const app = await createServer(container);
      const { accessToken: firstAccessToken } = await registerAndLoginUser(app, {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });
      const { accessToken: secondAccessToken } = await registerAndLoginUser(app, {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });

      const threadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });
      const { id: threadId } = threadResponse.body.data.addedThread;

      const firstCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({ content: 'comment pertama' });
      const { id: firstCommentId } = firstCommentResponse.body.data.addedComment;

      const secondCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .send({ content: 'comment kedua' });
      const { id: secondCommentId } = secondCommentResponse.body.data.addedComment;

      const firstReplyResponse = await request(app)
        .post(`/threads/${threadId}/comments/${firstCommentId}/replies`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .send({ content: 'balasan pertama' });
      const { id: firstReplyId } = firstReplyResponse.body.data.addedReply;

      // delete the second comment and the reply, both should be soft-deleted
      await request(app)
        .delete(`/threads/${threadId}/comments/${secondCommentId}`)
        .set('Authorization', `Bearer ${secondAccessToken}`);
      await request(app)
        .delete(`/threads/${threadId}/comments/${firstCommentId}/replies/${firstReplyId}`)
        .set('Authorization', `Bearer ${secondAccessToken}`);

      // Action
      const response = await request(app).get(`/threads/${threadId}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');

      const { thread } = response.body.data;
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toEqual('sebuah thread');
      expect(thread.body).toEqual('sebuah body thread');
      expect(thread.username).toEqual('dicoding');
      expect(thread.comments).toHaveLength(2);

      const [comment1, comment2] = thread.comments;
      expect(comment1.id).toEqual(firstCommentId);
      expect(comment1.username).toEqual('dicoding');
      expect(comment1.content).toEqual('comment pertama');
      expect(comment1.replies).toHaveLength(1);
      expect(comment1.replies[0].id).toEqual(firstReplyId);
      expect(comment1.replies[0].content).toEqual('**balasan telah dihapus**');
      expect(comment1.replies[0].username).toEqual('johndoe');

      expect(comment2.id).toEqual(secondCommentId);
      expect(comment2.content).toEqual('**komentar telah dihapus**');
      expect(comment2.replies).toHaveLength(0);
    });
  });
});
