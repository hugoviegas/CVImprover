import { parseDocument } from '../services/parsers/masterParser';

export const parseResume = async (file: File): Promise<string> => {
  try {
    return await parseDocument(file);
  } catch (error) {
    console.error('Error in parseResume:', error);
    throw error;
  }
};
