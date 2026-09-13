import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js';

describe('CommentLikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('isCommentLikedByUser function', () => {
    it('should return false when the user has not liked the comment', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await commentLikeRepositoryPostgres
        .isCommentLikedByUser('comment-123', 'user-123');

      // Assert
      expect(isLiked).toEqual(false);
    });

    it('should return true when the user has liked the comment', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await commentLikeRepositoryPostgres
        .isCommentLikedByUser('comment-123', 'user-123');

      // Assert
      expect(isLiked).toEqual(true);
    });
  });

  describe('addCommentLike function', () => {
    it('should persist the comment like', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepositoryPostgres.addCommentLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper
        .findCommentLikesByCommentIdAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('removeCommentLike function', () => {
    it('should remove the comment like', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      await commentLikeRepositoryPostgres.removeCommentLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper
        .findCommentLikesByCommentIdAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('getLikeCountsByThreadId function', () => {
    it('should return the like count for each liked comment in the thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addCommentLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addCommentLike({ id: 'like-456', commentId: 'comment-123', owner: 'user-456' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await commentLikeRepositoryPostgres.getLikeCountsByThreadId('thread-123');

      // Assert
      expect(likeCounts).toHaveLength(1);
      expect(likeCounts[0].comment_id).toEqual('comment-123');
      expect(Number(likeCounts[0].count)).toEqual(2);
    });

    it('should return an empty array when no comment in the thread is liked', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeCounts = await commentLikeRepositoryPostgres.getLikeCountsByThreadId('thread-123');

      // Assert
      expect(likeCounts).toHaveLength(0);
    });
  });
});
