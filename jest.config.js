// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: "ts-jest",
  // 缺少global-afterEnv版本的配置，所以每个模块执行前都会执行1次，花费时间约为330ms
  setupFilesAfterEnv: ["./__test__/jest.setup.js"],
  // 测试覆盖率
  collectCoverageFrom: ["src/**/*"],
};
