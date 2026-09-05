class DeleteCommentUseCase {
  #threadRepository;

  #commentRepository;

  constructor({ threadRepository, commentRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(threadId, commentId, owner) {
    await this.#threadRepository.verifyThreadExists(threadId);
    await this.#commentRepository.verifyCommentExists(commentId, threadId);
    await this.#commentRepository.verifyCommentOwner(commentId, owner);
    await this.#commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;
