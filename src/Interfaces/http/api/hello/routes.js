import express from 'express';

const createHelloRouter = (handler) => {
  const router = express.Router();

  router.get('/', handler.getHelloHandler);

  return router;
};

export default createHelloRouter;
