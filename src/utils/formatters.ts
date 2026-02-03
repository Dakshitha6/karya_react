import { getDateFromObjectId } from './helper.function';

/**
 * Format value based on type (replaces Angular pipes)
 */
export const formatValue = (value: any, type: string): string => {
  switch (type) {
    case 'dateFromObjectId':
      if (typeof value === 'string') {
        return getDateFromObjectId(value);
      }
      return value || '';
    case 'titlecase':
      if (typeof value === 'string') {
        return value
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      return value || '';
    default:
      return value || '';
  }
};

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateString;
  }
};


