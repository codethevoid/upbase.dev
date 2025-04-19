import byteSize from "byte-size";

const convertToMetricUnit = (
  unit: "KiB" | "MiB" | "GiB" | "TiB" | "PiB" | "EiB" | "ZiB" | "YiB",
) => {
  const units = {
    KiB: "kB",
    MiB: "MB",
    GiB: "GB",
    TiB: "TB",
    PiB: "PB",
    EiB: "EB",
    ZiB: "ZB",
    YiB: "YB",
  };
  return units[unit];
};

export const formatBytes = (bytes: number) => {
  const result = byteSize(bytes, { precision: 2, units: "iec" });
  return `${result.value} ${convertToMetricUnit(result.unit as keyof typeof convertToMetricUnit)}`;
};
