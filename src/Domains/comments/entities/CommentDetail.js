class CommentDetail {
  #id;

  #username;

  #date;

  #content;

  #replies;

  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, username, date, content, isDelete, replies,
    } = payload;

    this.#id = id;
    this.#username = username;
    this.#date = date;
    this.#replies = replies;
    this.#content = isDelete ? '**komentar telah dihapus**' : content;
  }

  get id() {
    return this.#id;
  }

  get username() {
    return this.#username;
  }

  get date() {
    return this.#date;
  }

  get content() {
    return this.#content;
  }

  get replies() {
    return this.#replies;
  }

  equals(other) {
    return other instanceof CommentDetail
      && this.#id === other.id
      && this.#username === other.username
      && this.#date === other.date
      && this.#content === other.content
      && this.#replies.length === other.replies.length
      && this.#replies.every((reply, index) => reply.equals(other.replies[index]));
  }

  toJSON() {
    return {
      id: this.#id,
      username: this.#username,
      date: this.#date,
      replies: this.#replies,
      content: this.#content,
    };
  }

  #verifyPayload({
    id, username, date, content, isDelete, replies,
  }) {
    if (
      !id
      || !username
      || !date
      || content === undefined
      || isDelete === undefined
      || !replies
    ) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof isDelete !== 'boolean'
      || !Array.isArray(replies)
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default CommentDetail;
