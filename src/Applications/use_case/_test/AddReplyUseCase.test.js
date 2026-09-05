import { vi } from 'vitest';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import AddReplyUseCase from '../AddReplyUseCase.js';

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
    };
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = vi.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(
      useCasePayload,
      threadId,
      commentId,
      owner,
    );

    // Assert
    expect(addedReply).toBe(mockAddedReply);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId, threadId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledTimes(1);
    const [calledNewReply, calledCommentId, calledOwner] = mockReplyRepository
      .addReply.mock.calls[0];
    expect(calledNewReply.equals(new NewReply(useCasePayload))).toBe(true);
    expect(calledCommentId).toEqual(commentId);
    expect(calledOwner).toEqual(owner);
  });

  it('should not add reply when comment does not exist', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
    };
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.reject(new Error('komentar tidak ditemukan')));
    mockReplyRepository.addReply = vi.fn();

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload, threadId, commentId, owner))
      .rejects.toThrowError('komentar tidak ditemukan');
    expect(mockReplyRepository.addReply).not.toBeCalled();
  });
});
