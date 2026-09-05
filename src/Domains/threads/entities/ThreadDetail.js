class ThreadDetail {
  #id;

  #title;

  #body;

  #date;

  #username;

  #comments;

  constructor(payload) {
    this.#verifyPayload(payload);

    this.#id = payload.id;
    this.#title = payload.title;
    this.#body = payload.body;
    this.#date = payload.date;
    this.#username = payload.username;
    this.#comments = payload.comments;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get body() {
    return this.#body;
  }

  get date() {
    return this.#date;
  }

  get username() {
    return this.#username;
  }

  get comments() {
    return this.#comments;
  }

  equals(other) {
    return other instanceof ThreadDetail
      && this.#id === other.id
      && this.#title === other.title
      && this.#body === other.body
      && this.#date === other.date
      && this.#username === other.username
      && this.#comments.length === other.comments.length
      && this.#comments.every((comment, index) => comment.equals(other.comments[index]));
  }

  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      body: this.#body,
      date: this.#date,
      username: this.#username,
      comments: this.#comments,
    };
  }

  #verifyPayload({
    id, title, body, date, username, comments,
  }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof username !== 'string'
      || !Array.isArray(comments)
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ThreadDetail;
