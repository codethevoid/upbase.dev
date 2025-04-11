import byteSize from "byte-size";

export const formatBytes = (bytes: number) => {
  const result = byteSize(bytes);
  return `${result.value}${result.unit}`;
};
