import { defineEventHandler, readBody } from "h3";
import { createUser, findUser, handleError } from "#auth";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name } = await readBody(event);

    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().regex(RegExp("(?=.*[a-z])(?=.*[0-9])(?=.{6,})")),
    });

    schema.parse({ email, password, name });

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
    await handleError(error);
  }
});
