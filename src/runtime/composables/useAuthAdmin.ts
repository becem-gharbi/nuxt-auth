import useAuthFetch from "./useAuthFetch";
import { Prisma } from "@prisma/client";
import type { User } from "../types";

export default function () {
  function editUser(input: { id: number; data: Prisma.UserUpdateInput }) {
    return useAuthFetch<User>("/api/auth/admin/users", {
      body: input,
    });
  }

  function listUsers(args: Prisma.UserFindManyArgs) {
    return useAuthFetch<User[]>("/api/auth/admin/users", {
      body: args,
      method: "get",
    });
  }

  return { editUser, listUsers };
}
