import { getAccessTokenFromHeader, verifyAccessToken } from "#auth";

export default defineEventHandler((event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      event.context.auth = payload;

      //User is authenticated
      // console.log(`User authenticated ${JSON.stringify(payload)}`);
    }
  } catch (error) {}
});
