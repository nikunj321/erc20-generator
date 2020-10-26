<template>
    <div class="pricing-table">
        <b-row>
            <b-col lg="3" v-for="(t) in tokenDetails">
                <b-card no-body class="mb-3">
                    <b-card-title class="pt-5 font-weight-light text-center">
                        {{ t.name }}
                    </b-card-title>
                    <p class="card-price text-center">
                        {{ t.price }} <small class="term">ETH</small>
                    </p>

                    <b-list-group flush>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ERC20 Compliant
                            <b-badge :variant="t.standard ? 'success' : 'danger'" pill>
                                {{ t.standard ? '√' : 'x' }}
                            </b-badge>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Capped Supply
                            <b-badge :variant="t.capped ? 'success' : 'danger'" pill>
                                {{ t.capped ? '√' : 'x' }}
                            </b-badge>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Mintable
                            <b-badge :variant="t.mintable ? 'success' : 'danger'" pill>
                                {{ t.mintable ? '√' : 'x' }}
                            </b-badge>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Burnable
                            <b-badge :variant="t.burnable ? 'success' : 'danger'" pill>
                                {{ t.burnable ? '√' : 'x' }}
                            </b-badge>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Token Recover
                            <b-badge :variant="t.tokenRecover ? 'success' : 'danger'" pill>
                                {{ t.tokenRecover ? '√' : 'x' }}
                            </b-badge>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ERC1363
                            <b-badge :variant="t.erc1363 ? 'success' : 'danger'" pill>
                                {{ t.erc1363 ? '√' : 'x' }}
                            </b-badge>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Remove Copyright
                            <b-badge :variant="t.removeCopyright ? 'success' : 'danger'" pill>
                                {{ t.removeCopyright ? '√' : 'x' }}
                            </b-badge>
                        </b-list-group-item>
                    </b-list-group>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  export default {
    name: 'PricingTable',
    data () {
      return {
        tokenDetails: [
          {
            name: 'SimpleERC20',
            standard: true,
            capped: true,
            mintable: false,
            burnable: false,
            tokenRecover: false,
            erc1363: false,
            removeCopyright: false,
            price: 0,
          },
          {
            name: 'StandardERC20',
            standard: true,
            capped: true,
            mintable: false,
            burnable: false,
            tokenRecover: false,
            erc1363: false,
            removeCopyright: true,
            price: 0.1,
          },
          {
            name: 'CommonERC20',
            standard: true,
            capped: true,
            mintable: true,
            burnable: true,
            tokenRecover: false,
            erc1363: false,
            removeCopyright: true,
            price: 0.2,
          },
          {
            name: 'PowerfulERC20',
            standard: true,
            capped: true,
            mintable: true,
            burnable: true,
            tokenRecover: true,
            erc1363: true,
            removeCopyright: true,
            price: 0.3,
          },
        ],
      };
    },
  };
</script>
