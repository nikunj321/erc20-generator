import config from '../config';

import SimpleERC20 from '../abi/token/SimpleERC20.json';
import StandardERC20 from '../abi/token/StandardERC20.json';
import CommonERC20 from '../abi/token/CommonERC20.json';
import PowerfulERC20 from '../abi/token/PowerfulERC20.json';

import ServiceReceiverArtifact from '../abi/service/ServiceReceiver.json';

const tokenList = {
  SimpleERC20,
  StandardERC20,
  CommonERC20,
  PowerfulERC20,
};

export default {
  data () {
    return {
      version: '4.0.0',
      legacy: false,
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
            id: '1',
            name: 'Main Ethereum Network',
          },
          ropsten: {
            web3Provider: 'https://ropsten.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://ropsten.etherscan.io',
            id: '3',
            name: 'Ropsten Test Network',
          },
          rinkeby: {
            web3Provider: 'https://rinkeby.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://rinkeby.etherscan.io',
            id: '4',
            name: 'Rinkeby Test Network',
          },
          kovan: {
            web3Provider: 'https://kovan.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://kovan.etherscan.io',
            id: '42',
            name: 'Kovan Test Network',
          },
          goerli: {
            web3Provider: 'https://goerli.infura.io/v3/12ca5f4d25964a428951747cf4cd5660',
            etherscanLink: 'https://goerli.etherscan.io',
            id: '5',
            name: 'Goerli Test Network',
          },
        },
      },
      serviceReceiver: {
        mainnet: '0x0',
        ropsten: '0x0',
        rinkeby: '0x50261e88A4051B9A80ed66756d2164e5477FD52F',
        kovan: '0x0',
        goerli: '0x0',
      },
      contracts: {
        token: null,
        service: null,
      },
    };
  },
  methods: {
    initWeb3 (network, checkWeb3) {
      if (!this.network.list.hasOwnProperty(network)) { // eslint-disable-line no-prototype-builtins
        throw new Error(
          `Failed initializing network ${network}. Allowed values are ${Object.keys(this.network.list)}.`,
        );
      }

      return new Promise((resolve) => {
        if (checkWeb3 && (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined')) {
          if (window.ethereum) {
            console.log('injected web3'); // eslint-disable-line no-console
            this.web3Provider = window.ethereum;
          } else {
            console.log('injected web3 (legacy)'); // eslint-disable-line no-console
            this.web3Provider = window.web3.currentProvider;
            this.legacy = true;
          }

          this.web3 = new Web3(this.web3Provider);
          this.metamask.installed = true;
          this.web3.version.getNetwork(async (err, netId) => {
            if (err) {
              console.log(err); // eslint-disable-line no-console
            }
            this.metamask.netId = netId;
            if (netId !== this.network.list[network].id) {
              this.network.current = this.network.list[this.network.map[netId]];
              await this.initWeb3(network, false);
            }
            resolve();
          });
        } else {
          console.log('provided web3'); // eslint-disable-line no-console
          this.network.current = this.network.list[network];
          this.web3Provider = new Web3.providers.HttpProvider(this.network.list[network].web3Provider);
          this.web3 = new Web3(this.web3Provider);

          resolve();
        }
      });
    },
    initService(network) {
      this.contracts.service = this.web3.eth.contract(ServiceReceiverArtifact.abi).at(this.serviceReceiver[network]);
    },
    initToken (tokenType) {
      const TokenArtifact = tokenList[tokenType];

      this.contracts.token = this.web3.eth.contract(TokenArtifact.abi);
      this.contracts.token.contractName = TokenArtifact.contractName;
      this.contracts.token.compiler = TokenArtifact.compiler;
      this.contracts.token.bytecode = TokenArtifact.bytecode;
      this.contracts.token.devdoc = TokenArtifact.devdoc;
      this.contracts.token.stringifiedAbi = JSON.stringify(TokenArtifact.abi);
    },
  },
};
