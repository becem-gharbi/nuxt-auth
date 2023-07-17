import useAuthFetch from "./useAuthFetch";
import type { Prisma } from "@prisma/client";
import type { User } from "../types";

/**
 * Users with role `admin` are considered admins
 * @Returns Admin API helpers, make sure `admin.enable` is true
 */
export default function () {
  /**
   * A helper to edit `User` entity, usefull to suspend account
   */
  function editUser(body: { id: User["id"]; data: Prisma.UserUpdateInput }) {
    return useAuthFetch<User>("/api/auth/admin/users/edit", {
      method: "PUT",
      body,
    });
  }

  /**
   * List users that satisfies certain conditions
   * @param body is argument for `prisma` findMany
   */
  function listUsers(body: Prisma.UserFindManyArgs = {}) {
    return useAuthFetch<User[]>("/api/auth/admin/users/list", {
      method: "POST",
      body,
    });
  }

  /**
   * Count users that satisfies certain conditions
   * @param body is argument for `prisma` count
   */
  function countUsers(body: Prisma.UserCountArgs = {}) {
    return useAuthFetch<number>("/api/auth/admin/users/count", {
      method: "POST",
      body,
    });
  }

  return { editUser, listUsers, countUsers };
}
