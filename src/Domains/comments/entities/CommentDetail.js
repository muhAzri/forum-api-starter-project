class CommentDetail {
  #id;

  #username;

  #date;

  #content;

  #replies;

  #likeCount;

  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, username, date, content, isDelete, replies, likeCount,
    } = payload;

    this.#id = id;
    this.#username = username;
    this.#date = date;
    this.#replies = replies;
    this.#content = isDelete ? '**komentar telah dihapus**' : content;
    this.#likeCount = likeCount;
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

  get likeCount() {
    return this.#likeCount;
  }

  equals(other) {
    return other instanceof CommentDetail
      && this.#id === other.id
      && this.#username === other.username
      && this.#date === other.date
      && this.#content === other.content
      && this.#likeCount === other.likeCount
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
      likeCount: this.#likeCount,
    };
  }

  #verifyPayload({
    id, username, date, content, isDelete, replies, likeCount,
  }) {
    if (
      !id
      || !username
      || !date
      || content === undefined
      || isDelete === undefined
      || !replies
      || likeCount === undefined
    ) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof isDelete !== 'boolean'
      || !Array.isArray(replies)
      || typeof likeCount !== 'number'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default CommentDetail;
