import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

const authenticate = (container) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing authentication');
    }

    const token = authHeader.substring('Bearer '.length);
    const authenticationTokenManager = container.getInstance(AuthenticationTokenManager.name);

    await authenticationTokenManager.verifyAccessToken(token);
    const { id, username } = await authenticationTokenManager.decodePayload(token);

    req.user = { id, username };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
