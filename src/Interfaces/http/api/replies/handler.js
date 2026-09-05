import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';

class RepliesHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next) {
    try {
      const addReplyUseCase = this.#container.getInstance(AddReplyUseCase.name);
      const addedReply = await addReplyUseCase.execute(
        req.body,
        req.params.threadId,
        req.params.commentId,
        req.user.id,
      );

      res.status(201).json({
        status: 'success',
        data: {
          addedReply,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const deleteReplyUseCase = this.#container.getInstance(DeleteReplyUseCase.name);
      await deleteReplyUseCase.execute(
        req.params.threadId,
        req.params.commentId,
        req.params.replyId,
        req.user.id,
      );

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default RepliesHandler;
