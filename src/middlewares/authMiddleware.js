import CustomError from "../utils/CustomError.js";
import { getError } from "../utils/generalErrors.js";
import jwtService from "../utils/jwtService.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const errorToken = getError(7);
    throw new CustomError(errorToken);
  }

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error)
  }
};

export default authMiddleware;
