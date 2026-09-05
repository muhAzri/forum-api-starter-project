import ThreadsHandler from './handler.js';
import createThreadsRouter from './routes.js';
import createCommentsRouter from '../comments/index.js';

export default (container) => {
  const threadsHandler = new ThreadsHandler(container);
  const commentsRouter = createCommentsRouter(container);
  return createThreadsRouter(threadsHandler, container, commentsRouter);
};
