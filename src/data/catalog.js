/* =====================================================================
   Catalog data
   Single source of truth for everything the site prints as fact. Keep
   model names, specs and prices current here. Nothing else hardcodes
   them. `kind` groups the model list page; `detail` is the context
   window for text models and the headline spec for everything else.
   ===================================================================== */

export const PROVIDERS = [
  { code: 'OA', name: 'OpenAI' },
  { code: 'AN', name: 'Anthropic' },
  { code: 'GG', name: 'Google' },
  { code: 'XA', name: 'xAI' },
  { code: 'DS', name: 'DeepSeek' },
  { code: 'MT', name: 'Meta' },
  { code: 'MS', name: 'Mistral' },
  { code: 'BF', name: 'Black Forest Labs' },
  { code: 'SA', name: 'Stability AI' },
];

export const KINDS = [
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
  { id: 'music', label: 'Music' },
];

/* Ordered flagship first: the home page prints the top six text models,
   the ticker runs the whole list, the models page groups by kind. */
export const MODELS = [
  {
    name: 'GPT-4o',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'text',
    detail: '128K',
    bestFor: 'Everyday reasoning and vision',
    description:
      'The safe default when you are not sure which model to reach for. Quick, reads images as input, and strong across almost everything.',
  },
  {
    name: 'o3',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'text',
    detail: '200K',
    bestFor: 'Hard maths, proofs, planning',
    description:
      'Thinks for longer before it answers. Worth the wait on proofs, multi step plans and any problem where a wrong answer is expensive.',
  },
  {
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    code: 'AN',
    kind: 'text',
    detail: '200K',
    bestFor: 'Long documents and drafting',
    description:
      'The strongest writer in the catalog. Holds a long document in its head, edits carefully, and produces prose that does not read like a machine.',
  },
  {
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    code: 'AN',
    kind: 'text',
    detail: '200K',
    bestFor: 'Code review and refactors',
    description:
      'The balanced daily driver. Reads a large repository, follows instructions closely, and stays quick enough for back and forth work.',
  },
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    code: 'GG',
    kind: 'text',
    detail: '1M',
    bestFor: 'Whole repositories and video',
    description:
      'A million token window that also accepts video and audio, so it can watch a recording or read an entire codebase and answer questions about it.',
  },
  {
    name: 'Grok 4',
    provider: 'xAI',
    code: 'XA',
    kind: 'text',
    detail: '256K',
    bestFor: 'Live search and conversation',
    description:
      'Reaches live sources while it answers, which makes it the one to ask about anything that happened this week.',
  },
  {
    name: 'GPT-4.1',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'text',
    detail: '1M',
    bestFor: 'Very long inputs',
    description:
      'Takes a million tokens in a single request, so whole document sets and codebases go in at once without chunking.',
  },
  {
    name: 'o4-mini',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'text',
    detail: '200K',
    bestFor: 'Cheap reasoning at volume',
    description:
      'Most of the reasoning of o3 at a fraction of the cost. Built for batch jobs and agent loops that run all day.',
  },
  {
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'text',
    detail: '128K',
    bestFor: 'Fast everyday tasks',
    description: 'The cheapest sensible default for classification, extraction and short replies.',
  },
  {
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    code: 'AN',
    kind: 'text',
    detail: '200K',
    bestFor: 'Quick drafts and routing',
    description:
      'Fast and inexpensive, with enough judgement to triage a queue of work before a larger model picks up what matters.',
  },
  {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    code: 'GG',
    kind: 'text',
    detail: '1M',
    bestFor: 'High volume, low latency',
    description: 'The same enormous context at a fraction of the latency. Made for pipelines that run at scale.',
  },
  {
    name: 'Grok 3',
    provider: 'xAI',
    code: 'XA',
    kind: 'text',
    detail: '128K',
    bestFor: 'Conversation and search',
    description: 'The previous generation, still capable at open conversation and quick research.',
  },
  {
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    code: 'DS',
    kind: 'text',
    detail: '128K',
    bestFor: 'Open reasoning at low cost',
    description:
      'Open weights with its reasoning on show. Competitive with closed models on maths and code for a fraction of the price.',
  },
  {
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    code: 'DS',
    kind: 'text',
    detail: '128K',
    bestFor: 'General open weight work',
    description: 'A capable general model that you could also self host, if you ever want the option to leave.',
  },
  {
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    code: 'MT',
    kind: 'text',
    detail: '128K',
    bestFor: 'Open weights, private hosting',
    description: 'Small enough to run on your own hardware, supported by nearly every tool in the ecosystem.',
  },
  {
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    code: 'MT',
    kind: 'text',
    detail: '128K',
    bestFor: 'The largest open model',
    description: 'The biggest openly licensed model here. Slower to answer, but it holds its own against closed frontier models.',
  },
  {
    name: 'Mistral Large',
    provider: 'Mistral',
    code: 'MS',
    kind: 'text',
    detail: '128K',
    bestFor: 'Fast structured generation',
    description: 'Reliable at JSON, tool calls and anything that has to match a schema exactly, first time.',
  },
  {
    name: 'Mistral Small',
    provider: 'Mistral',
    code: 'MS',
    kind: 'text',
    detail: '128K',
    bestFor: 'Cheap classification and tags',
    description: 'Tiny and quick. Ideal for tagging, routing and cleanup passes where a large model is waste.',
  },

  /* ------------------------------------------------------------ images */
  {
    name: 'FLUX.1',
    provider: 'Black Forest Labs',
    code: 'BF',
    kind: 'image',
    detail: 'Up to 2K',
    bestFor: 'Photoreal generation',
    description:
      'Sharp, photoreal images with unusually good prompt adherence. The default for product shots and editorial work.',
  },
  {
    name: 'GPT Image',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'image',
    detail: 'Up to 2K',
    bestFor: 'Editing and inpainting',
    description:
      'Generates and edits. Hand it an existing image with a mask and it changes only the part you pointed at.',
  },
  {
    name: 'Imagen 4',
    provider: 'Google',
    code: 'GG',
    kind: 'image',
    detail: 'Up to 2K',
    bestFor: 'Text inside images',
    description: 'The best here at rendering readable text inside a generated image, which most image models still fumble.',
  },
  {
    name: 'Stable Diffusion 3.5',
    provider: 'Stability AI',
    code: 'SA',
    kind: 'image',
    detail: 'Up to 2K',
    bestFor: 'Open image generation',
    description: 'Open weights, a wide style range, and a huge library of community fine tunes to draw on.',
  },

  /* ------------------------------------------------------------- video */
  {
    name: 'Sora',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'video',
    detail: 'Up to 20s',
    bestFor: 'Video from a prompt',
    description: 'Short clips from a written description, holding subjects and style consistent across shots.',
  },
  {
    name: 'Veo 3',
    provider: 'Google',
    code: 'GG',
    kind: 'video',
    detail: 'Up to 8s',
    bestFor: 'Video with sound',
    description: 'Generates video with matching audio, so a clip arrives with its own effects and atmosphere already on it.',
  },

  /* ------------------------------------------------------------- audio */
  {
    name: 'Whisper',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'audio',
    detail: '90+ languages',
    bestFor: 'Transcription',
    description: 'Turns speech into accurate text across languages and accents, and copes with noisy recordings.',
  },
  {
    name: 'GPT-4o Audio',
    provider: 'OpenAI',
    code: 'OA',
    kind: 'audio',
    detail: 'Speech to speech',
    bestFor: 'Voice interfaces',
    description: 'Speech in, speech out, in one call. Used for voice products that answer without a text round trip.',
  },

  /* ------------------------------------------------------------- music */
  {
    name: 'Lyria',
    provider: 'Google',
    code: 'GG',
    kind: 'music',
    detail: 'Instrumental',
    bestFor: 'Music generation',
    description: 'Writes instrumental tracks from a description, with control over genre, mood and tempo.',
  },
];

export const MODEL_TOTAL = 40;

export function countByKind(kind) {
  return MODELS.filter((m) => m.kind === kind).length;
}

/* Publicly listed consumer plan prices for the apps people stack up.
   Verify before launch. */
export const STACKED_PLANS = [
  { app: 'ChatGPT Plus', code: 'OA', price: 20 },
  { app: 'Claude Pro', code: 'AN', price: 20 },
  { app: 'Google AI Pro', code: 'GG', price: 20 },
  { app: 'SuperGrok', code: 'XA', price: 30 },
];

/* Token optimisation. The levers are real product behaviour; the
   headline figure and the billed share are PLACEHOLDERS and need
   measuring against a real workload before this ships. */
export const TOKEN_SAVING = {
  headline: 'Up to 60%',
  note: 'fewer tokens billed',
  billedPct: 34,
  levers: ['Smart routing', 'Context caching', 'Prompt trimming'],
};


/* Placeholder pricing. Replace with the live plan sheet. */
export const OUR_PRICE = 20;

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    unit: 'forever',
    line: 'Try the layer.',
    features: ['A daily allowance across every model', 'One memory workspace', 'Nothing stored'],
    cta: 'Start a chat',
    primary: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: `$${OUR_PRICE}`,
    unit: 'per month',
    line: 'One plan instead of four.',
    features: [
      'Every model, no separate subscriptions',
      'Council Mode',
      'Unified memory and file uploads',
      'API access included',
    ],
    cta: 'Go Pro',
    primary: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$30',
    unit: 'per seat',
    line: 'Shared memory, one invoice.',
    features: ['Everything in Pro', 'Shared workspace memory', 'Roles, seats and spend limits', 'SSO and audit log'],
    cta: 'Start a team',
    primary: false,
  },
];
