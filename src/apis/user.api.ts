import { UserIF, UsersListIF, UserFilterIF } from '../types/users.interface';
import { httpService } from '../services/http.service';

export const getUserDetailsAPI = async (
  uid?: string
): Promise<UserIF | null> => {
  try {
    const params: Record<string, any> = {};
    if (uid) {
      params.uid = uid;
    }
    
    const res: any = await httpService.get('getUser', params);

    if (res.status) {
      return res.payload;
    } else {
      throw new Error(res.data);
    }
  } catch (err) {
    console.log('getUserDetailsAPI [ERR]: ', err);
    return null;
  }
};

export const getAllUsersAPI = async ({
  page,
  count,
  filters,
  search,
}: {
  page?: number;
  count?: number;
  filters?: UserFilterIF;
  search?: string;
}): Promise<UsersListIF | null> => {
  try {
    const params: Record<string, any> = {};

    if (page) {
      params.page = page;
    }
    if (count) {
      params.count = count;
    }
    if (search) {
      params.search = search;
    }
    if (filters) {
      params.filter = JSON.stringify(filters);
    }
    
    const res: any = await httpService.get('getAllUsers', params);

    if (res.status) {
      return res.payload;
    } else {
      throw new Error(res.data);
    }
  } catch (err) {
    console.log('getAllUsersAPI [ERR]: ', err);
    return null;
  }
};

export const updateUserDetailsAPI = async (
  updatedUserDetails: UserIF,
  uid?: string
): Promise<UserIF | null> => {
  try {
    const res: any = await httpService.patch('updateUser', {
      uid: uid,
      userUpdateDetails: updatedUserDetails,
    });

    if (res.status) {
      return res.payload;
    } else {
      throw new Error(res);
    }
  } catch (err) {
    console.log('updateUserDetailsAPI [ERR]: ', err);
    return null;
  }
};

