import { expect } from "chai";
import hre from "hardhat";
//import { loadFixture } from "hardhat";
//import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
//import { loadFixture } from "@nomicfoundation/hardhat-network-helpers/dist/src/loadFixture";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers/loadFixture";

describe("MetaNFTAuction", function () { 
    let auction: any;
    let auctionV2: any;
    let proxy: any;
    let proxyAdmin: any;
    let nft: any;
    let usdc: any;
    let ethOracle: any;
    let usdcOracle: any;

    let admin: any;
    let proxyAdminSigner: any;
    let seller: any;
    let bidder1: any;
    let bidder2: any;

    async function deployAuctionFixture() {
    //beforeEach(async function () {
        //建立网络连接，获取签名账户
        const networkconnect = await hre.network.create();
        const ethers = networkconnect.ethers;
        [admin, proxyAdminSigner, seller, bidder1, bidder2] = await ethers.getSigners();

        //部属实现合约，编码初始化数据
        const MetaNFTAuctionFactory = await ethers.getContractFactory("MetaNFTAuction");
        const impl = await MetaNFTAuctionFactory.deploy();
        const initdata = impl.interface.encodeFunctionData("initialize", [admin.address]);

        //部属代理合约
        const TransparentUpgradeableProxyFactory = await ethers.getContractFactory("TransparentUpgradeableProxy");
        proxy = await TransparentUpgradeableProxyFactory.deploy(
            await impl.getAddress(),
            proxyAdminSigner.address,
            initdata
        );

        //连接代理合约到实现合约
        auction = MetaNFTAuctionFactory.attach(await proxy.getAddress());

        //获取代理管理员合约地址
        const adminslot = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
        const proxyAdminAddressRaw = await ethers.provider.getStorage(
            await proxy.getAddress(),
            adminslot
        );
        const proxyAdminAddress = ethers.getAddress("0x" + proxyAdminAddressRaw.slice(-40));

        //建立代理管理员合约对象
        const proxyAdminFactory = await ethers.getContractFactory("proxyAdmin");
        proxyAdmin = proxyAdminFactory.attach(proxyAdminAddress);

        //部属nft合约
        const MetaNFTFactory = await ethers.getContractFactory("MetaNFT");
        nft = await MetaNFTFactory.deploy();

        //部属usdc代币合约
        const MetaERC20Factory = await ethers.getContractFactory("MetaERC20");
        usdc = await MetaERC20Factory.deploy("USDC", "USDC", 6, ethers.parseUnits("1000000", 6));

        //部属预言机
        const MetaOracleFactory = await ethers.getContractFactory("MetaOracle");
        ethOracle = await MetaOracleFactory.deploy(ethers.parseUnits("3000", 8));
        usdcOracle = await MetaOracleFactory.deploy(ethers.parseUnits("1", 8));

        //设置预言机
        await auction.connect(admin).setTokenOracle(ethers.ZeroAddress, await ethOracle.getAddress());
        await auction.connect(admin).setTokenOracle(await usdc.getAddress(), await usdcOracle.getAddress());

        //获取nft，授权给实现合约
        await nft.mint(seller.address, 1);
        await nft.mint(seller.address, 2);
        await nft.mint(seller.address, 10);
        await nft.connect(seller).setApprovalForAll(await auction.getAddress(), true);

        // return {
        //     auction,
        //     proxy,
        //     proxyAdmin,
        //     nft,
        //     usdc,
        //     ethOracle,
        //     usdcOracle,
        //     admin,
        //     proxyAdminSigner,
        //     seller,
        //     bidder1,
        //     bidder2
        // }
    }

    beforeEach(async function () {
        const fixture = await loadFixture(deployAuctionFixture);
    });
})