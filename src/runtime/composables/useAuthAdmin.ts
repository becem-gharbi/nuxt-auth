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

  function listUsers(args: Prisma.UserFindManyArgs) {
    return useAuthFetch<User[]>("/api/auth/admin/users", {
      query: args,
    });
  }

  return { editUser, listUsers };
}
