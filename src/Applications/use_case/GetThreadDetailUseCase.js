import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';
import CommentDetail from '../../Domains/comments/entities/CommentDetail.js';
import ReplyDetail from '../../Domains/replies/entities/ReplyDetail.js';

class GetThreadDetailUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this.#threadRepository.getThreadById(threadId);
    const comments = await this.#commentRepository.getCommentsByThreadId(threadId);
    const replies = await this.#replyRepository.getRepliesByThreadId(threadId);

    const commentDetails = comments.map((comment) => new CommentDetail({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      isDelete: comment.is_delete,
      replies: replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new ReplyDetail({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
          isDelete: reply.is_delete,
        })),
    }));

    return new ThreadDetail({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: commentDetails,
    });
  }
}

export default GetThreadDetailUseCase;
