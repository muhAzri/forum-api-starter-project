import express from 'express';
import authenticate from '../../../../Infrastructures/http/middlewares/authenticate.js';

const createThreadsRouter = (handler, container, commentsRouter) => {
  const router = express.Router({ mergeParams: true });
  const auth = authenticate(container);

  router.post('/', auth, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadHandler);
  router.use('/:threadId/comments', commentsRouter);

  return router;
};

export default createThreadsRouter;
