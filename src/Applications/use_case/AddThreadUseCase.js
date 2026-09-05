import NewThread from '../../Domains/threads/entities/NewThread.js';

class AddThreadUseCase {
  #threadRepository;

  constructor({ threadRepository }) {
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const newThread = new NewThread(useCasePayload);
    return this.#threadRepository.addThread(newThread, owner);
  }
}

export default AddThreadUseCase;
