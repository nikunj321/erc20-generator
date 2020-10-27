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
                            ERC20 Compliant <checkmark :value="t.standard"></checkmark>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Capped Supply <checkmark :value="t.capped"></checkmark>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Mintable <checkmark :value="t.mintable"></checkmark>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Burnable <checkmark :value="t.burnable"></checkmark>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Token Recover <checkmark :value="t.tokenRecover"></checkmark>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ERC1363 <checkmark :value="t.erc1363"></checkmark>
                        </b-list-group-item>

                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            Remove Copyright <checkmark :value="t.removeCopyright"></checkmark>
                        </b-list-group-item>

                        <b-list-group-item variant="warning"
                                :to="{ path: 'create-token/', query: { tokenType: t.name }}"
                                class="justify-content-between align-items-center text-center">
                            Create
                        </b-list-group-item>
                    </b-list-group>
                </b-card>
            </b-col>
        </b-row>
        <p class="text-center text-light">
            <small>GAS will be added to final amount</small>
        </p>
    </div>
</template>

<script>
  import Checkmark from './Checkmark';
  
  export default {
    name: 'PricingTable',
    components: { Checkmark },
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
