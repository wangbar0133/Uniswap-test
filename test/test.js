const { ethers, upgrades } = require('hardhat');
const { expect } = require('chai');
const { setBalance } = require('@nomicfoundation/hardhat-network-helpers');



describe('UniswapV2', function () {

  let owner, victim, player;
  let usdc, usdt, weth, router;

  before(async function () {
    [owner, victim, player] = await ethers.getSigners();
  
    // Deploy 3 token
    const USDC = await hre.ethers.getContractFactory("USDC");
    usdc = await USDC.deploy();
    await usdc.deployed();
    await usdc.mint(owner.address, 100000100000);
    expect(await usdc.balanceOf(owner.address)).to.equal(100000100000);

    const USDT = await hre.ethers.getContractFactory("USDT");
    usdt = await USDT.deploy();
    await usdt.deployed();
    await usdt.mint(owner.address, 100000100000);
    expect(await usdt.balanceOf(owner.address)).to.equal(100000100000);

    const WETH = await hre.ethers.getContractFactory("WETH");
    weth = await WETH.deploy();
    await weth.deployed();
    await weth.mint(owner.address, 20000000);
    expect(await weth.balanceOf(owner.address)).to.equal(20000000);

    // Deploy Factory Contract and create 3 pairs of 3 token
    const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(owner.address);
    await factory.deployed();

    await factory.createPair(usdt.address, usdc.address);
    // const usdcUsdtPair = await factory.callStatic.getPair(usdc.address, usdt.address);

    await factory.createPair(weth.address, usdc.address);
    // const wethUsdcPair = await factory.callStatic.getPair(weth.address, usdc.address);

    await factory.createPair(weth.address, usdt.address);
    // const wethUsdtPair = await factory.callStatic.getPair(weth.address, usdt.address);
    
    const Router = await hre.ethers.getContractFactory("UniswapV2Router");
    router = await Router.deploy(factory.address, owner.address, owner.address);
    await router.deployed();
    
    await usdc.approve(router.address, 9999999999999);
    await usdt.approve(router.address, 9999999999999);
    await weth.approve(router.address, 9999999999999);

    expect(await usdc.allowance(owner.address, router.address)).to.equal(9999999999999);
    expect(await usdt.allowance(owner.address, router.address)).to.equal(9999999999999);
    expect(await weth.allowance(owner.address, router.address)).to.equal(9999999999999);

    
    await router.addLiquidity(
      usdc.address,
      usdt.address,
      100000,
      100000,
      0,
      0,
      owner.address,
      1768095287
    );
    
    await router.addLiquidity(
      weth.address,
      usdt.address,
      100000,
      100000000,
      0,
      0,
      owner.address,
      1768095287
    );

    await router.addLiquidity(
      weth.address,
      usdc.address,
      100000,
      100000000,
      0,
      0,
      owner.address,
      1768095287
    );
    
    await usdc.mint(victim.address, 900000);
    expect(await usdc.balanceOf(victim.address)).to.equal(900000);

    await usdc.connect(victim).approve(router.address, 9999999999999);
    expect(await usdc.allowance(victim.address, router.address)).to.equal(9999999999999);

    await router.connect(victim).swapExactTokensForTokens(
      900000,
      0,
      [usdc.address, usdt.address],
      victim.address,
      1768095287
    );

    await usdt.mint(player.address, 90000);
  });

  it('Execution', async function () {
      /** CODE YOUR SOLUTION HERE */
      await usdt.connect(player).approve(router.address, 9999999999999);
      await router.connect(player).swapExactTokensForTokens(
        90000,
        0,
        [usdt.address, usdc.address],
        player.address,
        1768095287
      );
  });

  after(async function () {
      /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */
      expect(await usdc.balanceOf(player.address)).to.gt(800000);
  });
});
