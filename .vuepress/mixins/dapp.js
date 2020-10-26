import config from '../config';
import utils from './utils';

import SimpleERC20 from '../abi/token/SimpleERC20.json';
import StandardERC20 from '../abi/token/StandardERC20.json';
import CommonERC20 from '../abi/token/CommonERC20.json';
import PowerfulERC20 from '../abi/token/PowerfulERC20.json';

import ServiceReceiverArtifact from '../abi/service/ServiceReceiver.json';

export default {
  mixins: [
    utils,
  ],
  data () {
    return {
      web3: null,
      web3Provider: null,
      metamask: {
        installed: false,
        netId: null,
      },
      network: {
        default: config.defaultNetwork,
        current: null,
        map: {
          1: 'mainnet',
          3: 'ropsten',
          4: 'rinkeby',
          42: 'kovan',
          5: 'goerli',
        },
        list: {
          mainnet: {
            web3Provider: 'https://mainnet.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://etherscan.io',
            id: 1,
            name: 'Main Ethereum Network',
          },
          ropsten: {
            web3Provider: 'https://ropsten.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://ropsten.etherscan.io',
            id: 3,
            name: 'Ropsten Test Network',
          },
          rinkeby: {
            web3Provider: 'https://rinkeby.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://rinkeby.etherscan.io',
            id: 4,
            name: 'Rinkeby Test Network',
          },
          kovan: {
            web3Provider: 'https://kovan.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://kovan.etherscan.io',
            id: 42,
            name: 'Kovan Test Network',
          },
          goerli: {
            web3Provider: 'https://goerli.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://goerli.etherscan.io',
            id: 5,
            name: 'Goerli Test Network',
          },
        },
      },
      serviceReceiver: {
        mainnet: '0x0',
        ropsten: '0xE94f8e8FBee92077d8A8F5c937CE77B5A6106eeb',
        rinkeby: '0x50261e88A4051B9A80ed66756d2164e5477FD52F',
        kovan: '0x0e8ab6196dC64C80E098efce09132121a7aAC543',
        goerli: '0x046e41D038ECd04dff2C2cc2B5F0c23dE7FC88A9',
      },
      tokenList: {
        SimpleERC20,
        StandardERC20,
        CommonERC20,
        PowerfulERC20,
      },
      contracts: {
        token: null,
        service: null,
      },
    };
  },
  methods: {
    async initWeb3 (network, checkWeb3) {
      if (!this.network.list.hasOwnProperty(network)) { // eslint-disable-line no-prototype-builtins
        throw new Error(
          `Failed initializing network ${network}. Allowed values are ${Object.keys(this.network.list)}.`,
        );
      }

      if (checkWeb3 && (typeof window.ethereum !== 'undefined')) {
        console.log('injected ethereum'); // eslint-disable-line no-console
        this.web3Provider = window.ethereum;

        this.web3 = new Web3(this.web3Provider);
        this.metamask.installed = this.web3Provider.isMetaMask;

        const netId = await this.promisify(this.web3.eth.getChainId);
        this.metamask.netId = netId;

        if (netId !== this.network.list[network].id) {
          this.network.current = this.network.list[this.network.map[netId]];
          await this.initWeb3(network, false);
        }
      } else {
        console.log('provided ethereum'); // eslint-disable-line no-console
        this.network.current = this.network.list[network];
        this.web3Provider = new Web3.providers.HttpProvider(this.network.list[network].web3Provider);
        this.web3 = new Web3(this.web3Provider);
      }
    },
    initService (network) {
      this.contracts.service = new this.web3.eth.Contract(
        ServiceReceiverArtifact.abi,
        this.serviceReceiver[network],
      );
    },
    initToken (tokenType) {
      this.contracts.token = this.tokenList[tokenType];
      this.contracts.token.stringifiedAbi = JSON.stringify(this.contracts.token.abi);
    },
  },
};
