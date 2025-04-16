export type FileWithPath = File & {
  path?: string;
};

export type UpbaseErrorResponse = {
  message: string;
  timestamp: string;
  success: false;
};
