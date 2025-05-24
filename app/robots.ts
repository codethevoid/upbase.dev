import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api-keys", "/profile", "/settings", "/storage"],
    },
  };
};

export default robots;
