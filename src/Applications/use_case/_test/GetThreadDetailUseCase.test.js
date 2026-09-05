import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        'is_delete': false,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'komentar yang dihapus',
        'is_delete': true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
        username: 'dicoding',
        'is_delete': false,
        'comment_id': 'comment-123',
      },
      {
        id: 'reply-456',
        content: 'balasan yang dihapus',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        'is_delete': true,
        'comment_id': 'comment-123',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);

    expect(threadDetail.equals(new ThreadDetail({
      id: mockThread.id,
      title: mockThread.title,
      body: mockThread.body,
      date: mockThread.date,
      username: mockThread.username,
      comments: threadDetail.comments,
    }))).toBe(true);

    expect(threadDetail.comments).toHaveLength(2);
    expect(threadDetail.comments[0].id).toEqual('comment-123');
    expect(threadDetail.comments[0].content).toEqual('sebuah comment');
    expect(threadDetail.comments[0].replies).toHaveLength(2);
    expect(threadDetail.comments[0].replies[0].content).toEqual('sebuah balasan');
    expect(threadDetail.comments[0].replies[1].content).toEqual('**balasan telah dihapus**');

    expect(threadDetail.comments[1].id).toEqual('comment-456');
    expect(threadDetail.comments[1].content).toEqual('**komentar telah dihapus**');
    expect(threadDetail.comments[1].replies).toHaveLength(0);
  });
});
