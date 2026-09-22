import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Parthiv Parmar — Log',
    description: 'Writing by Parthiv Parmar on AI infrastructure, agent design, LLM architecture and the engineering discipline behind production machine learning.',
    site: context.site,
    items: sorted.map(post => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags ?? []
    })),
    customData: `<language>en-us</language>`
  });
}
