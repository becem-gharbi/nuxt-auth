import { defineEventHandler, readBody } from "h3";
import { createUser, findUser, handleError, privateConfig } from "#auth";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name } = await readBody(event);

    const schema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z
        .string()
        .regex(RegExp(privateConfig.registration?.passwordValidationRegex)),
    });

    schema.parse({ email, password, name });

    if (privateConfig.registration?.enable === false) {
      throw new Error("registration-disabled");
    }

    const user = await findUser({ email: email });

    if (user) {
      throw new Error(`email-used-with-${user.provider}`);
    }

    await createUser({
      email,
      password,
      name,
    });

    return "ok";
  } catch (error) {
    await handleError(error);
  }
});
