import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import AddedReply from '../../Domains/replies/entities/AddedReply.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  #pool;

  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async addReply(newReply, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this.#idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies (id, comment_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, content, owner, date],
    };

    const result = await this.#pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyExists(replyId, commentId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [replyId],
    };

    await this.#pool.query(query);
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete, replies.comment_id
             FROM replies
             LEFT JOIN users ON replies.owner = users.id
             LEFT JOIN comments ON replies.comment_id = comments.id
             WHERE comments.thread_id = $1
             ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const result = await this.#pool.query(query);

    return result.rows;
  }
}

export default ReplyRepositoryPostgres;
