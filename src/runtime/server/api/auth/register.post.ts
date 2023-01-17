import { defineEventHandler, readBody, createError } from "h3";
import { createUser, findUser } from "../../utils/user";

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name } = await readBody(event);

    const user = await findUser({ email: email });

    if (user) {
      throw new Error("email-already-used");
    }

    await createUser({
      email,
      password,
      name,
    });

    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
