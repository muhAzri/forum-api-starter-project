import { vi } from 'vitest';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddCommentUseCase from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };
    const threadId = 'thread-123';
    const owner = 'user-123';

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = vi.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, threadId, owner);

    // Assert
    expect(addedComment).toBe(mockAddedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);
    const [calledNewComment, calledThreadId, calledOwner] = mockCommentRepository
      .addComment.mock.calls[0];
    expect(calledNewComment.equals(new NewComment(useCasePayload))).toBe(true);
    expect(calledThreadId).toEqual(threadId);
    expect(calledOwner).toEqual(owner);
  });

  it('should not add comment when thread does not exist', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };
    const threadId = 'thread-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.reject(new Error('thread tidak ditemukan')));
    mockCommentRepository.addComment = vi.fn();

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute(useCasePayload, threadId, owner))
      .rejects.toThrowError('thread tidak ditemukan');
    expect(mockCommentRepository.addComment).not.toBeCalled();
  });
});
