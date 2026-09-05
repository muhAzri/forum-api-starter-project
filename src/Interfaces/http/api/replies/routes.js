import express from 'express';
import authenticate from '../../../../Infrastructures/http/middlewares/authenticate.js';

const createRepliesRouter = (handler, container) => {
  const router = express.Router({ mergeParams: true });
  const auth = authenticate(container);

  router.post('/', auth, handler.postReplyHandler);
  router.delete('/:replyId', auth, handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;
