/* =====================================================================
   $OPEN
   PLACEHOLDER FIGURES. Every number in SUPPLY, STATS and the vesting
   language below is a stand in so the page can be designed and reviewed.
   Replace them with the published tokenomics before this page ships.
   ===================================================================== */

export const TOKEN = {
  symbol: '$OPEN',
  supply: '1B', // placeholder
  supplyNote: 'Fixed supply. No inflation switch.',
};

export const STATS = [
  { value: TOKEN.supply, label: 'Fixed supply of $OPEN. No inflation switch.' },
  { value: '1', label: 'One token across the whole network. No child tokens.' },
  { value: '9', label: 'Providers the network routes to, capped by governance.' },
  { value: 'Day one', label: 'Revenue buys $OPEN and rewards providers from launch.' },
];

export const FLOW = [
  {
    step: '01',
    title: 'Product revenue',
    body: 'People pay to use every model in the catalog. Live today.',
  },
  {
    step: '02',
    title: 'Protocol fees',
    body: 'A share of every credit spent flows to the protocol.',
  },
  {
    step: '03',
    title: 'Market buys $OPEN',
    body: 'Fees purchase $OPEN on the open market. Bought, not minted.',
  },
  {
    step: '04',
    title: 'Providers rewarded, surplus burns',
    body: 'Providers are rewarded first for the work they deliver. Whatever the network does not need is burned, verifiably on chain.',
    highlight: true,
  },
];

export const PRINCIPLES = [
  {
    tag: 'Earned, not airdropped',
    body: 'No mercenary airdrop. Rewards go to people who used the product or built on it, vested, and forfeited if they stop.',
  },
  {
    tag: 'Skin in the game',
    body: 'Operators and providers stake $OPEN to serve traffic and are slashed for bad work. Slashed tokens are burned, never redistributed.',
  },
  {
    tag: 'Governance with teeth',
    body: 'On chain timelocks on every emissions change. Emergency powers expire on their own after 72 hours. No silent edits.',
  },
  {
    tag: 'Product before token',
    body: 'The layer is live and earning today. Tokenomics freeze at least 30 days before launch, with the emissions simulation published.',
  },
];

export const UTILITY = [
  ['Pay for usage', 'Credits for every model in the catalog'],
  ['Stake to serve', 'Providers and operators post $OPEN to take traffic'],
  ['Vote on the rules', 'Emissions, provider caps and treasury spend'],
  ['Earn for work', 'Rewarded for inference served and data contributed'],
];
