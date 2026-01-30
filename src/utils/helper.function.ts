export const getAvatarLetters = (fullName: string): string => {
  const nameParts = fullName.trim().split(/\s+/);
  let letters = '';

  if (nameParts.length === 1) {
    letters = nameParts[0].charAt(0);
  } else {
    letters = nameParts[0].charAt(0) + nameParts[1].charAt(0);
  }

  return letters.toUpperCase();
};

export const removeWhitespace = (input: string): string => {
  return input.replace(/\s+/g, '');
};

export const goToLink = (url: string) => {
  window.open(url, '_blank');
};

export const isValidFirebaseUID = (uid: string | null): boolean => {
  if (!uid) return false;
  const firebaseUIDRegExp = /^[a-zA-Z0-9:_\-]{1,128}$/;
  return firebaseUIDRegExp.test(uid);
};

export const isValidObjectId = (id: string | null): boolean => {
  if (!id) return false;
  const hexRegExp = /^[0-9a-fA-F]{24}$/;
  return hexRegExp.test(id);
};

export const getEnumValue = (enumObj: any, key: string): string | undefined => {
  return enumObj[key as keyof typeof enumObj];
};

export const getDateFromObjectId = (objectId: string): string => {
  const timestampHex = objectId.substring(0, 8);
  const timestamp = parseInt(timestampHex, 16); // Convert hexadecimal to an integer
  return new Date(timestamp * 1000).toISOString(); // Convert seconds to milliseconds
};

