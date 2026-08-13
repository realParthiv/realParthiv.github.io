import { defineCollection, z } from 'astro:content';

const workCollection = defineCollection({
  type: 'content',
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
  type: 'content',
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
