/* =====================================================================
   Capabilities
   What each kind of model is actually for. The catalog page answers
   "which models are there"; this answers "what can I make with them".
   ===================================================================== */

export const CAPABILITIES = [
  {
    kind: 'text',
    label: 'Text',
    line: 'Chat, code, analysis and search.',
    body: 'The workhorse. Ask a question, hand over a contract, paste a repository, or let a model search the live web and come back with sources.',
    uses: [
      ['Write and edit', 'Drafts, rewrites and long documents held whole'],
      ['Code', 'Reviews, refactors and whole repositories read at once'],
      ['Reason', 'Proofs, planning and problems worth thinking slowly about'],
      ['Search', 'Live sources, fetched and cited while it answers'],
    ],
  },
  {
    kind: 'image',
    label: 'Images',
    line: 'Generate, edit and inpaint.',
    body: 'Describe what you want, or hand over an image and change only the part you point at. Sizes up to 2K, with open weight options if you need to self host.',
    uses: [
      ['Generate', 'Photoreal or illustrated, from a written brief'],
      ['Edit', 'Mask a region and replace only what is inside it'],
      ['Type', 'Readable text rendered inside the image itself'],
      ['Iterate', 'Variations on a result you already like'],
    ],
  },
  {
    kind: 'audio',
    label: 'Audio',
    line: 'Speech in, speech out, and music.',
    body: 'Turn recordings into accurate text, answer out loud without a text round trip, or write an instrumental track from a description.',
    uses: [
      ['Transcribe', 'Over 90 languages, accents and noisy rooms included'],
      ['Speak', 'Speech to speech in a single call, for voice products'],
      ['Compose', 'Instrumental tracks with control over genre and tempo'],
      ['Narrate', 'Long form reading from a written script'],
    ],
  },
  {
    kind: 'video',
    label: 'Video',
    line: 'Clips from a written description.',
    body: 'Short video from a prompt, holding subjects and style steady across shots, and in some cases arriving with its own sound already on it.',
    uses: [
      ['Generate', 'Clips up to twenty seconds from a description'],
      ['Sound', 'Matching audio and effects generated alongside'],
      ['Continuity', 'The same subject and look held across shots'],
      ['Storyboard', 'Quick passes before anything expensive is filmed'],
    ],
  },
];
