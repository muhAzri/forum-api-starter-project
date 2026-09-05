import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';
import createRepliesRouter from '../replies/index.js';

export default (container) => {
  const commentsHandler = new CommentsHandler(container);
  const repliesRouter = createRepliesRouter(container);
  return createCommentsRouter(commentsHandler, container, repliesRouter);
};
