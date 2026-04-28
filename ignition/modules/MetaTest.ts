import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const metaTestModule = buildModule("MetaTestModule", (m) => {
    const metaTest = m.contract("MetaTest");

  return { metaTest };
});
export default metaTestModule;