import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';

class CommentsHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const addCommentUseCase = this.#container.getInstance(AddCommentUseCase.name);
      const addedComment = await addCommentUseCase.execute(
        req.body,
        req.params.threadId,
        req.user.id,
      );

      res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const deleteCommentUseCase = this.#container.getInstance(DeleteCommentUseCase.name);
      await deleteCommentUseCase.execute(
        req.params.threadId,
        req.params.commentId,
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

export default CommentsHandler;
