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
                        <h4 class="alert-heading">Alert</h4>
                        <p>
                            To use this app please install <a href="https://metamask.io/" target="_blank">MetaMask</a> extension on Chrome Desktop.
                        </p>
                        <hr>
                        <p class="mb-0">
                            Use any other wallet at your own risk.
                        </p>
                    </b-alert>

                    <b-card header="Making transaction..."
                            header-bg-variant="info"
                            header-text-variant="white"
                            v-if="makingTransaction || transactionStarted"
                            class="mt-3">
                        <div v-if="!trx.hash">
                            Please wait... <ui--loader :loading="true"></ui--loader>
                        </div>
                        <div v-else>
                            <b>Well! Transaction done!</b><br>
                            Transaction id <a :href="trx.link" target="_blank"><span v-html="trx.hash"></span></a><br>

                            Retrieving Token.
                            <div v-if="!token.address">
                                Please wait... <ui--loader :loading="true"></ui--loader>
                            </div>
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
                                    <b-card header="Network"
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
                                        </b-row>
                                    </b-card>

                                    <b-card header="Token Type"
                                            header-bg-variant="dark"
                                            header-text-variant="white"
                                            class="mt-3">
                                        <b-row>
                                            <b-col lg="12">
                                                <b-form-group
                                                        description="Choose your Token."
                                                        label="Token Type *"
                                                        label-for="tokenType">
                                                    <b-form-select id="tokenType"
                                                                   v-model="tokenType"
                                                                   size="lg"
                                                                   @input="loadToken">
                                                        <option v-for="(n, k) in tokenList" :value="k">
                                                            {{ n.contractName }}
                                                        </option>
                                                    </b-form-select>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>

                                        <b-alert show variant="info" class="text-right">
                                            Token deployment fee <br>
                                            <b>{{ web3.utils.fromWei(feeAmount, 'ether') }} ETH</b>
                                        </b-alert>

                                        <template #footer>
                                            <small>GAS will be added to final amount</small>
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

  export default {
    name: 'Generator',
    mixins: [
      dapp,
    ],
    data () {
      return {
        loading: true,
        currentNetwork: null,
        tokenType: 'SimpleERC20',
        trx: {
          hash: '',
          link: '',
        },
        transactionStarted: false,
        makingTransaction: false,
        formDisabled: false,
        feeAmount: '0',
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
        this.initToken(this.tokenType);

        this.token.decimals = ['SimpleERC20'].includes(this.tokenType) ? 18 : this.token.decimals;
        this.updateInitialBalance();

        this.feeAmount = await this.promisify(this.contracts.service.methods.getPrice(this.tokenType).call);

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
              this.trx.hash = '';
              this.trx.link = '';
              this.formDisabled = true;
              this.makingTransaction = true;

              await this.web3Provider.request({ method: 'eth_requestAccounts' });

              const tokenContract = new this.web3.eth.Contract(this.contracts.token.abi);

              tokenContract.deploy({
                data: this.contracts.token.bytecode,
                arguments: this.getDeployArguments(),
              })
                .send(
                  {
                    from: await this.promisify(this.web3.eth.getCoinbase),
                    value: this.feeAmount,
                  })
                .on('error', (error) => {
                  console.log(error.message); // eslint-disable-line no-console

                  this.makingTransaction = false;
                  this.formDisabled = false;

                  this.makeToast(
                    'Error!',
                    error.message,
                    'danger',
                  );
                })
                .on('transactionHash', (transactionHash) => {
                  this.transactionStarted = true;
                  this.trx.hash = transactionHash;
                  this.trx.link = `${this.network.current.etherscanLink}/tx/${this.trx.hash}`;

                  this.gaSend('transaction', `trx_${this.network.current.id}`, this.trx.hash);
                })
                .on('receipt', (receipt) => {
                  this.token.address = receipt.contractAddress;
                  this.token.link = this.network.current.etherscanLink + '/token/' + this.token.address;
                  this.$forceUpdate();
                  this.makeToast(
                    'Well done!',
                    `Your token has been deployed at ${this.token.address}`,
                    'success',
                  );

                  this.gaSend('token', `token_${this.network.current.id}`, this.token.address);
                });
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
      getDeployArguments () {
        const name = this.token.name;
        const symbol = this.token.symbol.toUpperCase();
        const decimals = this.web3.utils.toBN(this.token.decimals);
        const cap = this.web3.utils.toBN(this.token.cap).mul(this.web3.utils.toBN(Math.pow(10, this.token.decimals)));
        const initialBalance = this.web3.utils.toBN(this.token.initialBalance).mul(this.web3.utils.toBN(Math.pow(10, this.token.decimals))); // eslint-disable-line max-len

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

        params.push(this.contracts.service.options.address);

        return params;
      },
    },
  };
</script>
