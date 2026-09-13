import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentLikeRepository from '../../../Domains/comment_likes/CommentLikeRepository.js';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should like the comment when it is not liked yet', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLikedByUser = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.addCommentLike = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.removeCommentLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(threadId, commentId, owner);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId, threadId);
    expect(mockCommentLikeRepository.isCommentLikedByUser).toBeCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.removeCommentLike).not.toBeCalled();
  });

  it('should unlike the comment when it is already liked', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLikedByUser = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.addCommentLike = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.removeCommentLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(threadId, commentId, owner);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId, threadId);
    expect(mockCommentLikeRepository.isCommentLikedByUser).toBeCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.removeCommentLike).toBeCalledWith(commentId, owner);
    expect(mockCommentLikeRepository.addCommentLike).not.toBeCalled();
  });

  it('should not toggle like when thread does not exist', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.reject(new Error('thread tidak ditemukan')));
    mockCommentRepository.verifyCommentExists = vi.fn();
    mockCommentLikeRepository.isCommentLikedByUser = vi.fn();

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action and Assert
    await expect(toggleCommentLikeUseCase.execute(threadId, commentId, owner))
      .rejects.toThrowError('thread tidak ditemukan');
    expect(mockCommentRepository.verifyCommentExists).not.toBeCalled();
    expect(mockCommentLikeRepository.isCommentLikedByUser).not.toBeCalled();
  });
});
