import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api-keys/*", "/profile/*", "/settings/*", "/storage/*"],
    },
    sitemap: "https://restash.io/sitemap.xml",
  };
};

export default robots;
