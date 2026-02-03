import { UserIF } from "../types/users.interface";
import { getAllUsersAPI, getUserDetailsAPI } from "../apis/user.api";
import { UserFilterIF } from "../types/users.interface";

class UserCacheService {
  private usersList: UserIF[] = [];

  async updateUsersCache(uids: (string | undefined)[]): Promise<void> {
    const availableUIDs = new Set(this.usersList.map((u) => u.uid));

    const newUIDsToFetch = uids.filter((uid) => uid && !availableUIDs.has(uid));

    if (newUIDsToFetch.length > 0) {
      try {
        const result = await getAllUsersAPI({
          page: 1,
          count: 12,
          filters: { userType: "all" },
        });

        if (result?.users && result.users.length > 0) {
          this.usersList.push(...result.users);
          console.log(
            `Cached ${result.users.length} users for assistance requests`,
          );
        } else {
          console.warn("No users returned from API for UIDs:", newUIDsToFetch);
        }
      } catch (error) {
        console.error("Error updating users cache:", error);
      }
    }
  }

  async getUserFromCache(
    uid: string | undefined | null,
  ): Promise<UserIF | null> {
    if (!uid) return null;

    const user = this.usersList.find((u) => u.uid === uid);

    if (user) return user;

    // If not in cache, fetch it
    try {
      const result = await getUserDetailsAPI(uid);
      if (result) {
        this.usersList.push(result);
        return result;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }

    return null;
  }

  getUserFromCacheSync(uid: string | undefined | null): UserIF | null {
    if (!uid) return null;
    return this.usersList.find((u) => u.uid === uid) || null;
  }

  clearCache(): void {
    this.usersList = [];
  }
}

export const userCacheService = new UserCacheService();
