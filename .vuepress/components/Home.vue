<template>
    <div>
        <b-jumbotron bg-variant="dark"
                     text-variant="white"
                     header="ERC20 Token Generator"
                     lead="The most used Smart Contract Generator for ERC20 Token"
                     class="mb-0"
                     fluid>
            <hr class="my-4">
            <b-button to="create-token" size="lg" variant="outline-warning" class="px-4">
                Create a Token
            </b-button>
            <a class="btn btn-lg btn-light px-4"
               href="#features"
               v-smooth-scroll="{ duration: 1000, offset: 0, updateHistory: false }">
                Features
            </a>

        </b-jumbotron>
        <b-row id="how-it-works" class="mx-0">
            <b-col lg="8" offset-lg="2" class="mb-3">
                <h2 class="p-5 font-weight-lighter text-center text-dark">How it works</h2>
                <h4 class="text-center font-weight-light">
                    Create an ERC20 Token in less than a minute.
                </h4>
                <p class="text-center font-weight-light">
                    No login.
                    No setup.
                    No coding required.
                </p>
                <ui--how-it-works></ui--how-it-works>
            </b-col>
        </b-row>
        <b-row id="features" class="aqua-gradient mx-0">
            <b-col lg="10" offset-lg="1" class="mb-3">
                <h2 class="p-5 font-weight-lighter text-center text-light">Features</h2>
                <ui--pricing-table></ui--pricing-table>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  export default {
    name: 'Home',
  };
</script>
