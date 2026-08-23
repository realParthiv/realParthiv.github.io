import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderCard, type CardInput } from '../../lib/og-card';

/**
 * Build-time social cards. One PNG per page, generated from the same content
 * collections the pages render from, so a card can never describe a project
 * differently to the case study it links to.
 */
export async function getStaticPaths() {
  const work = await getCollection('work');
  const blog = await getCollection('blog');

  const staticCards: Array<{ route: string; card: CardInput }> = [
    {
      route: 'default',
      card: {
        eyebrow: 'AI/ML Engineer',
        title: 'Parthiv Parmar',
        body: 'I build systems that can prove what they did.',
        meta: 'MCP AGENTS  ·  RAG  ·  DJANGO  ·  ETHEREUM'
      }
    },
    {
      route: 'about',
      card: {
        eyebrow: 'About',
        title: 'I build systems that can prove what they did.',
        body: 'AI/ML engineer at Clicode. Backend first, machine learning second.',
        meta: 'PARTHIV PARMAR'
      }
    },
    {
      route: 'work',
      card: {
        eyebrow: 'Work Ledger',
        title: 'Production systems, end to end.',
        body: `${work.length} case studies: credential registries, MCP booking agents, RAG pipelines and recommendation engines.`,
        meta: 'PARTHIV PARMAR'
      }
    },
    {
      route: 'blog',
      card: {
        eyebrow: 'Log',
        title: 'Notes on agents, retrieval and infrastructure.',
        body: 'Writing on AI infrastructure, agent design and the engineering behind production machine learning.',
        meta: 'PARTHIV PARMAR'
      }
    },
    {
      route: 'contact',
      card: {
        eyebrow: 'Contact',
        title: 'Get in touch.',
        body: "If you're building something that has to keep working, I'd like to hear about it.",
        meta: 'PARTHIV PARMAR'
      }
    }
  ];

  return [
    ...staticCards.map(({ route, card }) => ({ params: { route }, props: { card } })),

    ...work.map(entry => ({
      params: { route: `work-${entry.id}` },
      props: {
        card: {
          eyebrow: 'Work Ledger',
          title: entry.data.title,
          body: entry.data.summary,
          meta: `${entry.data.year}  ·  ${entry.data.stack.slice(0, 4).join('  ·  ')}`
        } satisfies CardInput
      }
    })),

    ...blog.map(entry => ({
      params: { route: `blog-${entry.id}` },
      props: {
        card: {
          eyebrow: 'Log',
          title: entry.data.title,
          body: entry.data.excerpt,
          meta: entry.data.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }).toUpperCase()
        } satisfies CardInput
      }
    }))
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard(props.card as CardInput);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
};
