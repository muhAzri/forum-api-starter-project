import express from 'express';
import authenticate from '../../../../Infrastructures/http/middlewares/authenticate.js';

const createCommentsRouter = (handler, container, repliesRouter) => {
  const router = express.Router({ mergeParams: true });
  const auth = authenticate(container);

  router.post('/', auth, handler.postCommentHandler);
  router.delete('/:commentId', auth, handler.deleteCommentHandler);
  router.use('/:commentId/replies', repliesRouter);

  return router;
};

export default createCommentsRouter;
