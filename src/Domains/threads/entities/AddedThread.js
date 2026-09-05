class AddedThread {
  #id;

  #title;

  #owner;

  constructor(payload) {
    this.#verifyPayload(payload);

    this.#id = payload.id;
    this.#title = payload.title;
    this.#owner = payload.owner;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get owner() {
    return this.#owner;
  }

  equals(other) {
    return other instanceof AddedThread
      && this.#id === other.id
      && this.#title === other.title
      && this.#owner === other.owner;
  }

  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      owner: this.#owner,
    };
  }

  #verifyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddedThread;
