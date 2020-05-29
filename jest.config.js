// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: "ts-jest",
  // 缺少global-afterEnv版本的配置，所以每个模块执行前都会执行1次，花费时间约为330ms
  setupFilesAfterEnv: ["./__test__/jest.setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__test__/cocos2d-js-min.js"],
};
