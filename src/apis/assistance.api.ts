import { AssistanceIF, AssistanceFilterIF, AssistanceListIF } from '../types/assistance.interface';
import { httpService } from '../services/http.service';

export const getAssistanceDetailsAPI = async (
  id: string
): Promise<AssistanceIF | null> => {
  try {
    const params: Record<string, any> = { id };
    const res: any = await httpService.get('getAssistance', params);

    if (res.status) {
      return res.payload;
    } else {
      throw new Error(res.data);
    }
  } catch (err) {
    console.log('getAssistanceDetailsAPI [ERR]: ', err);
    return null;
  }
};

export const getAllAssistanceAPI = async ({
  page,
  count,
  filters,
  search,
}: {
  page?: number;
  count?: number;
  filters?: AssistanceFilterIF;
  search?: string;
}): Promise<AssistanceListIF | null> => {
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

    const res: any = await httpService.get('getAllAssistance', params);

    if (res.status) {
      return res.payload;
    } else {
      throw new Error(res.data);
    }
  } catch (err) {
    console.log('getAllAssistanceAPI [ERR]: ', err);
    return null;
  }
};

export const updateAssistanceDetailsAPI = async (
  updatedAssistanceDetails: AssistanceIF,
  id: string
): Promise<AssistanceIF | null> => {
  try {
    const res: any = await httpService.patch('updateAssistance', {
      id: id,
      updateDetails: updatedAssistanceDetails,
    });

    if (res.status) {
      return res.payload;
    } else {
      throw new Error(res);
    }
  } catch (err) {
    console.log('updateAssistanceDetailsAPI [ERR]: ', err);
    return null;
  }
};


