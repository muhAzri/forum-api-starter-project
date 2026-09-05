class DeleteReplyUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async execute(threadId, commentId, replyId, owner) {
    await this.#threadRepository.verifyThreadExists(threadId);
    await this.#commentRepository.verifyCommentExists(commentId, threadId);
    await this.#replyRepository.verifyReplyExists(replyId, commentId);
    await this.#replyRepository.verifyReplyOwner(replyId, owner);
    await this.#replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
