class NewThread {
  #title;

  #body;

  constructor(payload) {
    this.#verifyPayload(payload);

    this.#title = payload.title;
    this.#body = payload.body;
  }

  get title() {
    return this.#title;
  }

  get body() {
    return this.#body;
  }

  equals(other) {
    return other instanceof NewThread
      && this.#title === other.title
      && this.#body === other.body;
  }

  #verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewThread;
