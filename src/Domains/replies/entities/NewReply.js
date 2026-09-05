class NewReply {
  #content;

  constructor(payload) {
    this.#verifyPayload(payload);

    this.#content = payload.content;
  }

  get content() {
    return this.#content;
  }

  equals(other) {
    return other instanceof NewReply && this.#content === other.content;
  }

  #verifyPayload({ content }) {
    if (!content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewReply;
