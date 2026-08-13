import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    stack: z.array(z.string()),
    year: z.number(),
    status: z.enum(["VERIFIED — LIVE", "VERIFIED — SHIPPED"]),
    url: z.string().url().optional(),
    order: z.number()
  })
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    excerpt: z.string()
  })
});

export const collections = {
  'work': workCollection,
  'blog': blogCollection,
};
