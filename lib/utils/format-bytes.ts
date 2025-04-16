import byteSize from "byte-size";

export const formatBytes = (bytes: number) => {
  const result = byteSize(bytes, { precision: 2 });
  return `${result.value} ${result.unit}`;
};
