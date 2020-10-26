module.exports = {
  description: 'Easily deploy Smart Contract for a Standard, Capped, Mintable, Burnable ERC20 Token.',
  base: '/erc20-generator/',
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://vittominacori.github.io/erc20-generator' }],
    ['meta', { property: 'og:image', content: 'https://vittominacori.github.io/erc20-generator/assets/images/erc20-token-generator.png' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: 'https://vittominacori.github.io/erc20-generator/assets/images/erc20-token-generator.png' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:title', content: 'ERC20 Token Generator | Create your Token for FREE' }],
    ['script', { src: '/assets/js/web3.min.js' }],
  ],
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-115756440-2',
      },
    ],
  ],
  version: '4.0.0',
  defaultNetwork: process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? 'mainnet' : 'rinkeby',
};
