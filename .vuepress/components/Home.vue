<template>
    <div>
        <b-jumbotron bg-variant="dark"
                     text-variant="white"
                     header="ERC20 Token Generator"
                     lead="Create your Token for FREE"
                     class="mb-0"
                     fluid>
            <p>
                <b-img :src="`https://img.shields.io/badge/version-${this.version}-blue`"></b-img>
                <b-link href="https://travis-ci.com/github/vittominacori/erc20-generator" target="_blank">
                    <b-img src="https://travis-ci.com/vittominacori/erc20-generator.svg?branch=master"></b-img>
                </b-link>
                <b-link href="https://coveralls.io/github/vittominacori/erc20-generator" target="_blank">
                    <b-img src="https://coveralls.io/repos/github/vittominacori/erc20-generator/badge.svg?branch=master"></b-img>
                </b-link>
            </p>
            <p>{{ $site.description }}</p>
            <hr class="my-4">
            <b-button to="create-token" size="lg" variant="outline-warning">
                Create a Token
            </b-button>
            <a class="btn btn-lg btn-light"
               href="#features"
               v-smooth-scroll="{ duration: 1000, offset: 0, updateHistory: false }">
                Features
            </a>

        </b-jumbotron>
        <b-row id="features" class="aqua-gradient mx-0">
            <b-col lg="10" offset-lg="1" class="mb-3">
                <h2 class="p-5 font-weight-lighter text-center text-light">Features</h2>
                <ui--pricing-table></ui--pricing-table>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  import config from '../config';

  export default {
    name: 'Home',
    data () {
      return {
        version: config.version,
      };
    },
  };
</script>
