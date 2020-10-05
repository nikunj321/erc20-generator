const { BN, expectRevert } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC20 } = require('@vittominacori/erc20-token/test/token/ERC20/behaviours/ERC20.behaviour');

const { shouldBehaveLikeGeneratorCopyright } = require('../utils/GeneratorCopyright.behaviour');

const SimpleERC20 = artifacts.require('SimpleERC20');

contract('SimpleERC20', function ([owner, recipient, thirdParty]) {
  const _name = 'SimpleERC20';
  const _symbol = 'ERC20';
  const _decimals = new BN(18);
  const _initialSupply = new BN(100000000);

  context('creating valid token', function () {
    describe('without initial supply', function () {
      it('should fail', async function () {
        await expectRevert(
          SimpleERC20.new(_name, _symbol, 0),
          'SimpleERC20: supply cannot be zero',
        );
      });
    });

    describe('with initial supply', function () {
      beforeEach(async function () {
        this.token = await SimpleERC20.new(
          _name,
          _symbol,
          _initialSupply,
          { from: owner },
        );
      });

      describe('once deployed', function () {
        it('total supply should be equal to initial supply', async function () {
          (await this.token.totalSupply()).should.be.bignumber.equal(_initialSupply);
        });

        it('owner balance should be equal to initial supply', async function () {
          (await this.token.balanceOf(owner)).should.be.bignumber.equal(_initialSupply);
        });
      });
    });
  });

  context('like a SimpleERC20', function () {
    beforeEach(async function () {
      this.token = await SimpleERC20.new(
        _name,
        _symbol,
        _initialSupply,
        { from: owner },
      );
    });

    context('like a ERC20', function () {
      shouldBehaveLikeERC20(
        _name, _symbol, _decimals, [owner, recipient, thirdParty], _initialSupply,
      );
    });

    context('like a GeneratorCopyright', function () {
      beforeEach(async function () {
        this.instance = this.token;
      });

      shouldBehaveLikeGeneratorCopyright();
    });
  });
});
