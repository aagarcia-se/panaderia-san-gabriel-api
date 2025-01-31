
import jwt from "../auth/jwt.js";
import CustomError from "../utils/CustomError.js";
import { getError } from "../utils/generalErrors.js";


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const errorToken = getError(7);
    throw new CustomError(errorToken);
  }

  try {
    const decoded = jwt.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error)
  }
};

export default authMiddleware;
