class AddedReply {
  #id;

  #content;

  #owner;

  constructor(payload) {
    this.#verifyPayload(payload);

    this.#id = payload.id;
    this.#content = payload.content;
    this.#owner = payload.owner;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  get owner() {
    return this.#owner;
  }

  equals(other) {
    return other instanceof AddedReply
      && this.#id === other.id
      && this.#content === other.content
      && this.#owner === other.owner;
  }

  toJSON() {
    return {
      id: this.#id,
      content: this.#content,
      owner: this.#owner,
    };
  }

  #verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddedReply;
