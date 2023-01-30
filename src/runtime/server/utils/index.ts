export { privateConfig, publicConfig } from "./config";

export { sendMail } from "./mail";

export {
  createAccessToken,
  getAccessTokenFromHeader,
  verifyAccessToken,
  setAccessTokenCookie,
  getAccessTokenFromCookie,
  deleteAccessTokenCookie,
} from "./token/accessToken";

export {
  createRefreshToken,
  deleteManyRefreshTokenByUser,
  deleteRefreshToken,
  deleteRefreshTokenCookie,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
  updateRefreshToken,
  verifyRefreshToken,
  findManyRefreshTokenByUser,
  findRefreshTokenById,
} from "./token/refreshToken";

export {
  createEmailVerifyToken,
  verifyEmailVerifyToken,
} from "./token/emailVerify";

export {
  createResetPasswordToken,
  verifyResetPasswordToken,
} from "./token/passwordReset";

export {
  changePassword,
  createUser,
  findUser,
  setUserEmailVerified,
  verifyPassword,
} from "./user";

export { handleError } from "./error";
