class ToggleCommentLikeUseCase {
  #threadRepository;

  #commentRepository;

  #commentLikeRepository;

  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId, commentId, owner) {
    await this.#threadRepository.verifyThreadExists(threadId);
    await this.#commentRepository.verifyCommentExists(commentId, threadId);

    const isLiked = await this.#commentLikeRepository.isCommentLikedByUser(commentId, owner);

    if (isLiked) {
      await this.#commentLikeRepository.removeCommentLike(commentId, owner);
    } else {
      await this.#commentLikeRepository.addCommentLike(commentId, owner);
    }
  }
}

export default ToggleCommentLikeUseCase;
