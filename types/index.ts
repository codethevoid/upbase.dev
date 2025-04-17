export type FileWithPath = File & {
  path?: string;
};

export type RestashErrorResponse = {
  message: string;
  timestamp: string;
  success: false;
};
