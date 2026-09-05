import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';

class ThreadsHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const addThreadUseCase = this.#container.getInstance(AddThreadUseCase.name);
      const addedThread = await addThreadUseCase.execute(req.body, req.user.id);

      res.status(201).json({
        status: 'success',
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getThreadHandler(req, res, next) {
    try {
      const getThreadDetailUseCase = this.#container.getInstance(GetThreadDetailUseCase.name);
      const thread = await getThreadDetailUseCase.execute(req.params.threadId);

      res.json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ThreadsHandler;
