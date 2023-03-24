import useAuthFetch from "./useAuthFetch";
import { Prisma } from "@prisma/client";
import type { User } from "../types";

export default function () {
  function editUser(body: { id: number; data: Prisma.UserUpdateInput }) {
    return useAuthFetch<User>("/api/auth/admin/users/edit", {
      method: "PUT",
      body,
    });
  }

  function listUsers(body: Prisma.UserFindManyArgs = {}) {
    return useAuthFetch<User[]>("/api/auth/admin/users/list", {
      method: "POST",
      body,
    });
  }

  function countUsers(body: Prisma.UserCountArgs = {}) {
    return useAuthFetch<{ count: number }>("/api/auth/admin/users/count", {
      method: "POST",
      body,
    });
  }

  return { editUser, listUsers, countUsers };
}
