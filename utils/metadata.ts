import { Metadata } from "next";

export const constructMetadata = ({
  title = "Restash - Global Storage for Developers",
  description = "Restash is a global storage solution built for developers. It provides a simple way to store and access files with just a few lines of code.",
}: {
  title?: string;
  description?: string;
}): Metadata => {
  return {
    title,
    description,
    icons: "/restash.svg",
    metadataBase: new URL("https://restash.io"),
  };
};
