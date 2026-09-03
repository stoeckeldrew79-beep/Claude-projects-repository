// AI-assisted article drafting. Drafts land unpublished in the admin
// review queue — this service never publishes anything itself. The
// prompt is deliberately restrictive: it may only describe patterns
// actually present in the data it's given, never invent specifics
// (names, phone numbers, statistics) beyond that — a factual error
// published under this site's byline is a real liability, not just an
// embarrassment, on a site people pay to trust.
import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
    client = new Anthropic();
  }
  return client;
}

export interface DraftInput {
  kind: 'category_spike' | 'recurring_contact';
  categoryName?: string;
  countLast30d?: number;
  countPrior30d?: number;
  recurringContact?: string;
  reportDescriptions: string[];
}

export interface DraftedArticle {
  title: string;
  slug: string;
  body: string;
}

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Headline for the article, under 80 characters' },
    slug: { type: 'string', description: 'URL slug: lowercase, hyphen-separated, no special characters' },
    body: { type: 'string', description: 'Article body, 3-5 paragraphs, plain text with blank lines between paragraphs' },
  },
  required: ['title', 'slug', 'body'],
  additionalProperties: false,
} as const;

export async function draftArticleFromPattern(input: DraftInput): Promise<DraftedArticle> {
  const anthropic = getClient();

  const dataSummary =
    input.kind === 'category_spike'
      ? `Category "${input.categoryName}" had ${input.countLast30d} reports in the last 30 days, up from ${input.countPrior30d} in the prior 30 days.`
      : `The contact detail "${input.recurringContact}" has appeared in multiple separate scam reports.`;

  const response = await anthropic.messages.create({
    model: 'claude-opus-5',
    max_tokens: 4096,
    system: `You are drafting a short article for ScamShield National, a consumer scam-awareness site. You write ONLY from the data given to you in the user message — real report descriptions submitted by the public. Never invent specific facts not present in that data: no fabricated statistics, no invented phone numbers or company names beyond what's given, no claims about scale ("thousands of victims") unless the data says so. It is fine, and expected, to write generally about how this type of scam works using well-established public knowledge, but anything presented as specific to THIS pattern must trace back to the provided report data. Write in the same plain, direct, factual voice as the site's existing guides: explain what's happening, why it works, and what to do. This is a DRAFT for human review before publication — do not claim it has already been verified.`,
    messages: [
      {
        role: 'user',
        content: `Pattern detected: ${dataSummary}\n\nReport descriptions this pattern is based on:\n${input.reportDescriptions.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nDraft a short article about this pattern for the review queue.`,
      },
    ],
    output_config: {
      format: { type: 'json_schema', schema: DRAFT_SCHEMA },
    },
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  if (!textBlock) throw new Error('No text content in Claude response');
  return JSON.parse(textBlock.text) as DraftedArticle;
}
