import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async execute(useCasePayload, threadId, commentId, owner) {
    await this.#threadRepository.verifyThreadExists(threadId);
    await this.#commentRepository.verifyCommentExists(commentId, threadId);
    const newReply = new NewReply(useCasePayload);
    return this.#replyRepository.addReply(newReply, commentId, owner);
  }
}

export default AddReplyUseCase;
