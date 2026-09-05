class ReplyDetail {
  #id;

  #content;

  #date;

  #username;

  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, content, date, username, isDelete,
    } = payload;

    this.#id = id;
    this.#content = isDelete ? '**balasan telah dihapus**' : content;
    this.#date = date;
    this.#username = username;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  get date() {
    return this.#date;
  }

  get username() {
    return this.#username;
  }

  equals(other) {
    return other instanceof ReplyDetail
      && this.#id === other.id
      && this.#content === other.content
      && this.#date === other.date
      && this.#username === other.username;
  }

  toJSON() {
    return {
      id: this.#id,
      content: this.#content,
      date: this.#date,
      username: this.#username,
    };
  }

  #verifyPayload({
    id, content, date, username, isDelete,
  }) {
    if (
      !id
      || content === undefined
      || !date
      || !username
      || isDelete === undefined
    ) {
      throw new Error('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof username !== 'string'
      || typeof isDelete !== 'boolean'
    ) {
      throw new Error('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ReplyDetail;
