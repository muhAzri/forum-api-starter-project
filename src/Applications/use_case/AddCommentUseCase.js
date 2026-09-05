import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  #threadRepository;

  #commentRepository;

  constructor({ threadRepository, commentRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    await this.#threadRepository.verifyThreadExists(threadId);
    const newComment = new NewComment(useCasePayload);
    return this.#commentRepository.addComment(newComment, threadId, owner);
  }
}

export default AddCommentUseCase;
