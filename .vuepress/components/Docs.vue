<template>
    <div>
        <b-row>
            <b-col lg="10" offset-lg="1" class="mt-4 p-0" v-if="!loading">
                <b-card :title="$site.title" bg-variant="transparent" border-variant="0">
                    <p class="card-text">
                        {{ $site.description }}
                    </p>
                    <b-card bg-variant="light"
                            header="Token Type"
                            header-bg-variant="dark"
                            header-text-variant="white">
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
                                        <option v-for="(n, k) in tokenList" :value="k">{{ n.contractName }}
                                        </option>
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-card bg-variant="light"
                            header="Token Details"
                            header-bg-variant="dark"
                            header-text-variant="white"
                            class="mt-3">
                        <ul>
                            <li>
                                Source Code:
                                <b-link :href="sourceCode"
                                        target="_blank">
                                    <b>{{ contracts.token.contractName }}.dist.sol</b>
                                </b-link>
                            </li>
                            <li>Contract Name: <b>{{ contracts.token.contractName }}</b></li>
                            <li>Compiler: <b>{{ contracts.token.compiler.version }}</b></li>
                            <li>Optimization: <b>Yes</b></li>
                            <li>Runs (Optimizer): <b>200</b></li>
                            <li>Constructor Arguments: <b>your ABI-encoded arguments</b></li>
                        </ul>
                        <div class="form-group">
                            <label><b>ABI</b></label>
                            <textarea class="form-control"
                                      readonly="readonly" rows="5"
                                      v-model="contracts.token.stringifiedAbi"></textarea>
                        </div>
                    </b-card>
                    <b-card bg-variant="light"
                            header="Methods"
                            header-bg-variant="dark"
                            header-text-variant="white"
                            class="mt-3">
                        <b-card v-for="(method, key) in contracts.token.abi"
                                :header="method.name || 'constructor'"
                                :sub-title="`Type: ${method.type}`"
                                :key="key"
                                class="mt-4">
                            <b-card-text v-if="method.stateMutability">
                                State Mutability: {{ method.stateMutability }}
                            </b-card-text>
                            <b-card-text v-if="method.inputs && method.inputs.length > 0">
                                <p>Inputs:</p>
                                <ul>
                                    <li v-for="(param, key) in method.inputs" :key="key">
                                        <b>{{ param.type }}</b> {{ param.name }}
                                    </li>
                                </ul>
                            </b-card-text>
                            <b-card-text v-if="method.outputs && method.outputs.length > 0">
                                <p>Outputs:</p>
                                <ul>
                                    <li v-for="(param, key) in method.outputs" :key="key">
                                        <b>{{ param.type }}</b> {{ param.name }}
                                    </li>
                                </ul>
                            </b-card-text>
                        </b-card>
                    </b-card>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  import dapp from '../mixins/dapp';

  export default {
    name: 'Docs',
    mixins: [
      dapp,
    ],
    data () {
      return {
        loading: true,
        currentNetwork: null,
        tokenType: 'SimpleERC20',
      };
    },
    computed: {
      sourceCode: function () {
        return `https://github.com/vittominacori/erc20-generator/blob/v${this.version}/dist/${this.contracts.token.contractName}.dist.sol`;
      },
    },
    mounted () {
      this.initDapp();
    },
    methods: {
      async initDapp () {
        try {
          await this.loadToken();
        } catch (e) {
          console.log(e);
          this.makeToast(
            'Some error occurred',
            e,
            'danger',
          );
          // document.location.href = this.$withBase('/');
        }
      },
      async loadToken () {
        this.initToken(this.tokenType);

        this.loading = false;
      },
    },
  };
</script>
