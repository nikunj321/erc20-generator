<template>
    <div>
        <b-jumbotron bg-variant="dark"
                     text-variant="white"
                     header="ERC20 Token Generator"
                     lead="Create your Token for FREE"
                     class="mb-0"
                     fluid>
            <p>
                <b-img :src="`https://img.shields.io/badge/version-${version}-blue`"></b-img>
                <b-link href="https://travis-ci.com/github/vittominacori/erc20-generator" target="_blank">
                    <b-img src="https://travis-ci.com/vittominacori/erc20-generator.svg?branch=master"></b-img>
                </b-link>
                <b-link href="https://coveralls.io/github/vittominacori/erc20-generator" target="_blank">
                    <b-img src="https://coveralls.io/repos/github/vittominacori/erc20-generator/badge.svg?branch=master"></b-img>
                </b-link>
            </p>
            <p>{{ $site.description }}</p>
            <hr class="my-4">
            <a class="btn btn-lg btn-outline-warning"
               href="#token-generator"
               v-smooth-scroll="{ duration: 1000, offset: -50, updateHistory: false }">
                Create a Token
            </a>
            <b-button to="/docs.html" size="lg" variant="light">
                Documentation
            </b-button>
        </b-jumbotron>
        <b-row>
            <b-col lg="10" offset-lg="1" class="mb-3 p-0">
                <b-card v-if="!loading" bg-variant="transparent" border-variant="0">
                    <b-alert show variant="danger" v-if="!metamask.installed">
                        NOTE: to use this app we install <a href="https://metamask.io/" target="_blank">MetaMask</a> extension on Chrome Desktop.<br>
                        Use any other wallet at your own risk.
                    </b-alert>

                    <b-card header="Making transaction..."
                            header-bg-variant="info"
                            header-text-variant="white"
                            v-if="makingTransaction || transactionStarted"
                            class="mt-3">
                        <div v-if="!trxHash">Please wait...</div>
                        <div v-else>
                            <b>Well! Transaction done!</b><br>
                            Transaction id <a :href="trxLink" target="_blank"><span v-html="trxHash"></span></a><br>

                            Retrieving Token.
                            <div v-if="!token.address">Please wait...</div>
                            <div v-else>
                                <b>Your Token</b>
                                <b-link :href="token.link" target="_blank"><span v-html="token.address"></span></b-link>
                            </div>
                        </div>
                    </b-card>

                    <ValidationObserver
                            id="token-generator"
                            ref="observer"
                            tag="form"
                            @submit.prevent="generateToken()"
                            v-if="!makingTransaction">
                        <fieldset :disabled="formDisabled">
                            <b-row>
                                <b-col lg="8">
                                    <b-card header="Token Details"
                                            header-bg-variant="dark"
                                            header-text-variant="white"
                                            class="mt-3">
                                        <ValidationProvider
                                                name="token name"
                                                :rules="{ required: true }"
                                                v-slot="{ errors }">
                                            <b-form-group
                                                    description="Choose a name for your token."
                                                    label="Token name *"
                                                    label-for="tokenName">
                                                <b-form-input
                                                        id="tokenName"
                                                        name="tokenName"
                                                        placeholder="Your token name"
                                                        v-model.trim="token.name"
                                                        size="lg"
                                                        :class="{'is-invalid': errors.length > 0}"
                                                        maxlength="20">
                                                </b-form-input>
                                                <small v-show="errors.length > 0" class="text-danger">
                                                    {{ errors[0] }}
                                                </small>
                                            </b-form-group>
                                        </ValidationProvider>

                                        <ValidationProvider
                                                name="token symbol"
                                                :rules="{ required: true }"
                                                v-slot="{ errors }">
                                            <b-form-group
                                                    description="Choose a symbol for your token (usually 3-5 chars)."
                                                    label="Token symbol *"
                                                    label-for="tokenSymbol">
                                                <b-form-input
                                                        id="tokenSymbol"
                                                        name="tokenSymbol"
                                                        placeholder="Your token symbol"
                                                        v-model.trim="token.symbol"
                                                        size="lg"
                                                        :class="{'is-invalid': errors.length > 0}"
                                                        maxlength="5">
                                                </b-form-input>
                                                <small v-show="errors.length > 0" class="text-danger">
                                                    {{ errors[0] }}
                                                </small>
                                            </b-form-group>
                                        </ValidationProvider>

                                        <ValidationProvider
                                                name="token decimals"
                                                :rules="{ required: true, numeric: true, min_value: 0, max_value: 36 }"
                                                v-slot="{ errors }">
                                            <b-form-group
                                                    description="Insert the decimal precision of your token. If you don't know what to insert, use 18."
                                                    label="Token decimals *"
                                                    label-for="tokenDecimals">
                                                <b-form-input
                                                        id="tokenDecimals"
                                                        name="tokenDecimals"
                                                        placeholder="Your token decimals"
                                                        type="number"
                                                        :disabled="['SimpleERC20'].includes(tokenType)"
                                                        v-model.trim="token.decimals"
                                                        size="lg"
                                                        :class="{'is-invalid': errors.length > 0}"
                                                        step="1">
                                                </b-form-input>
                                                <small v-show="errors.length > 0" class="text-danger">
                                                    {{ errors[0] }}
                                                </small>
                                            </b-form-group>
                                        </ValidationProvider>

                                        <ValidationProvider
                                                name="token max supply"
                                                :rules="{ required: true, numeric: true, min_value: 1, max_value: 1000000000000000 }"
                                                v-slot="{ errors }">
                                            <b-form-group
                                                    description="Insert the maximum number of tokens available."
                                                    label="Total supply *"
                                                    label-for="tokenCap">
                                                <b-form-input
                                                        id="tokenCap"
                                                        name="tokenCap"
                                                        placeholder="Your token max supply"
                                                        type="number"
                                                        v-model.trim="token.cap"
                                                        size="lg"
                                                        v-on:update="updateInitialBalance"
                                                        :class="{'is-invalid': errors.length > 0}"
                                                        step="1">
                                                </b-form-input>
                                                <small v-show="errors.length > 0" class="text-danger">
                                                    {{ errors[0] }}
                                                </small>
                                            </b-form-group>
                                        </ValidationProvider>

                                        <ValidationProvider
                                                name="token initial supply"
                                                :rules="{ required: true, numeric: true, min_value: 0, max_value: token.cap || 0 }"
                                                v-slot="{ errors }">
                                            <b-form-group
                                                    description="Insert the initial number of tokens available. Will be put in your account."
                                                    label="Initial supply *"
                                                    label-for="tokenInitialBalance">
                                                <b-form-input
                                                        id="tokenInitialBalance"
                                                        name="tokenInitialBalance"
                                                        placeholder="Your token initial supply"
                                                        type="number"
                                                        :disabled="['SimpleERC20', 'StandardERC20'].includes(tokenType)"
                                                        v-model.trim="token.initialBalance"
                                                        size="lg"
                                                        :class="{'is-invalid': errors.length > 0}"
                                                        step="1">
                                                </b-form-input>
                                                <small v-show="errors.length > 0" class="text-danger">
                                                    {{ errors[0] }}
                                                </small>
                                            </b-form-group>
                                        </ValidationProvider>
                                    </b-card>
                                </b-col>
                                <b-col lg="4">
                                    <b-card header="Advanced"
                                            header-bg-variant="dark"
                                            header-text-variant="white"
                                            class="mt-3">
                                        <b-row>
                                            <b-col lg="12">
                                                <b-form-group
                                                        description="Choose your Network."
                                                        label="Network *"
                                                        label-for="network">
                                                    <b-form-select id="network"
                                                                   v-model="currentNetwork"
                                                                   size="lg"
                                                                   @input="initDapp">
                                                        <option v-for="(n, k) in network.list" :value="k">{{ n.name }}
                                                        </option>
                                                    </b-form-select>
                                                </b-form-group>

                                                <b-alert show variant="warning" v-if="currentNetwork !== 'mainnet'">
                                                    <strong>
                                                        You selected a TEST Network.
                                                    </strong>
                                                    <hr>
                                                    To deploy on Main Network you must select Main Ethereum Network.
                                                </b-alert>
                                            </b-col>
                                            <b-col lg="12">
                                                <b-form-group
                                                        description="Choose your Token."
                                                        label="Token Type *"
                                                        label-for="tokenType">
                                                    <b-form-select id="tokenType"
                                                                   v-model="tokenType"
                                                                   size="lg"
                                                                   @input="loadToken">
                                                        <option v-for="(n, k) in tokenList" :value="k">{{ n.contractName }}
                                                        </option>
                                                    </b-form-select>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>
                                    </b-card>

                                    <b-card header="Payment"
                                            header-bg-variant="dark"
                                            header-text-variant="white"
                                            class="mt-3">
                                        <b-card-text class="text-right">
                                            Token deployment fee: <b>{{ web3.fromWei(feeAmount) }} ETH</b>
                                        </b-card-text>
                                        <template #footer>
                                            <small>GAS fee will be added to final amount</small>
                                        </template>
                                    </b-card>

                                    <b-row class="mt-3">
                                        <b-col lg="12" class="text-right">
                                            <b-button variant="warning" size="lg" type="submit">Create Token</b-button>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </fieldset>
                    </ValidationObserver>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  import dapp from '../mixins/dapp';
  import utils from '../mixins/utils';

  export default {
    name: 'Generator',
    mixins: [
      dapp,
      utils,
    ],
    data () {
      return {
        loading: true,
        currentNetwork: null,
        tokenType: 'SimpleERC20',
        trxHash: '',
        transactionStarted: false,
        makingTransaction: false,
        formDisabled: false,
        feeAmount: 0,
        token: {
          name: '',
          symbol: '',
          decimals: 18,
          cap: '',
          initialBalance: '',
        },
      };
    },
    mounted () {
      this.currentNetwork = this.getParam('network') || this.network.default;
      this.initDapp();
    },
    methods: {
      async initDapp () {
        this.network.current = this.network.list[this.currentNetwork];
        try {
          await this.initWeb3(this.currentNetwork, true);
          this.initService(this.currentNetwork);
          await this.loadToken();
        } catch (e) {
          console.log(e); // eslint-disable-line no-console
          this.makeToast(
            'Some errors occurred',
            e,
            'danger',
          );
          // document.location.href = this.$withBase('/');
        }
      },
      async loadToken () {
        this.token.decimals = ['SimpleERC20'].includes(this.tokenType) ? 18 : this.token.decimals;
        this.updateInitialBalance();

        this.feeAmount = await this.promisify(this.contracts.service.getPrice, this.tokenType);

        this.initToken(this.tokenType);
        this.loading = false;
      },
      async generateToken () {
        this.$refs.observer.validate().then(async (result) => {
          if (result) {
            if (!this.metamask.installed) {
              this.makeToast(
                'Warning',
                'To create a Token please install MetaMask!',
                'danger',
              );
              return;
            } else {
              if (this.metamask.netId !== this.network.current.id) {
                this.makeToast(
                  'Warning',
                  `Your MetaMask in on the wrong network. Please switch on ${this.network.current.name} and try again!`,
                  'warning',
                );
                return;
              }
            }

            try {
              this.trxHash = '';
              this.formDisabled = true;
              this.makingTransaction = true;

              if (!this.legacy) {
                await this.web3Provider.enable();
              }

              setTimeout(() => {
                const params = this.getDeployParams();

                this.contracts.token.new(
                  ...params,
                  this.contracts.service.address,
                  {
                    from: this.web3.eth.coinbase,
                    data: this.contracts.token.bytecode,
                    value: this.feeAmount,
                  },
                  (e, tokenContract) => {
                    this.deployCallback(e, tokenContract);
                  },
                );
              }, 500);
            } catch (e) {
              this.makingTransaction = false;
              this.formDisabled = false;
              this.makeToast(
                'Some error occurred',
                e.message,
                'danger',
              );
            }
          }
        }).catch((e) => {
          console.log(e); // eslint-disable-line no-console
          this.makingTransaction = false;
          this.makeToast(
            'Some error occurred',
            e.message,
            'danger',
          );
        });
      },
      updateInitialBalance () {
        this.token.initialBalance = ['SimpleERC20', 'StandardERC20'].includes(this.tokenType) ? this.token.cap : this.token.initialBalance;
      },
      getDeployParams () {
        const name = this.token.name;
        const symbol = this.token.symbol.toUpperCase();
        const decimals = new this.web3.BigNumber(this.token.decimals);
        const cap = new this.web3.BigNumber(this.token.cap).mul(Math.pow(10, this.token.decimals));
        const initialBalance = new this.web3.BigNumber(this.token.initialBalance).mul(Math.pow(10, this.token.decimals)); // eslint-disable-line max-len

        const params = [name, symbol];

        switch (this.tokenType) {
        case 'SimpleERC20':
          params.push(cap);
          break;
        case 'StandardERC20':
          params.push(decimals);
          params.push(cap);
          break;
        case 'CommonERC20':
        case 'PowerfulERC20':
          params.push(decimals);
          params.push(cap);
          params.push(initialBalance);
          break;
        default:
          throw new Error(
            'Invalid Token Type',
          );
        }

        return params;
      },
      getParam (param) {
        const vars = {};
        window.location.href.replace(location.hash, '').replace(
          /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
          function (m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
          },
        );

        if (param) {
          return vars[param] ? vars[param] : null;
        }
        return vars;
      },
      deployCallback (e, tokenContract) {
        if (e) {
          console.log(e); // eslint-disable-line no-console
          this.makingTransaction = false;
          this.formDisabled = false;
          this.makeToast(
            'Some error occurred',
            e.message,
            'danger',
          );
        } else {
          // NOTE: The callback will fire twice!
          // Once the contract has the transactionHash property
          // set and once its deployed on an address.
          if (!tokenContract.address) {
            this.transactionStarted = true;
            this.trxHash = tokenContract.transactionHash;
            this.trxLink = this.network.current.etherscanLink + '/tx/' + this.trxHash;

            this.gaSend('transaction', `trx_${this.network.current.id}`, this.trxHash);
          } else {
            this.token.address = tokenContract.address;
            this.token.link = this.network.current.etherscanLink + '/token/' + this.token.address;
            this.$forceUpdate();
            this.makeToast(
              'Well done!',
              `Your token has been deployed at ${this.token.address}`,
              'success',
            );

            this.gaSend('token', `token_${this.network.current.id}`, this.token.address);
          }
        }
      },
    },
  };
</script>
