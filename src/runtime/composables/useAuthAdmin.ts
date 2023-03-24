import useAuthFetch from "./useAuthFetch";
import { Prisma } from "@prisma/client";
import type { User } from "../types";

export default function () {
  function editUser(input: { id: number; data: Prisma.UserUpdateInput }) {
    return useAuthFetch<User>("/api/auth/admin/users/edit", {
      body: input,
      method: "PUT",
    });
  }

  function listUsers() {
    const body: Prisma.UserFindManyArgs = {
      where: {
        name: {
          contains: "test",
        },
      },
    };

    return useAuthFetch<User[]>("/api/auth/admin/users/list", {
      method: "POST",
      body,
    });
  }

  return { editUser, listUsers };
}
