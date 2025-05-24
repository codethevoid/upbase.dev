import type { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  return [
    {
      url: "https://restash.io",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://restash.io/register",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://restash.io/login",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://restash.io/legal/privacy",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://restash.io/legal/terms",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
};

export default sitemap;
