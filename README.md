# cocos 轻量级游戏框架

![](https://img.shields.io/badge/Cocos--Creator-2.3.3-blue)
![](https://img.shields.io/badge/框架版本-1.0.0-blue)
![](https://img.shields.io/badge/脚本语言-TypeScript-blue)

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![blog](https://img.shields.io/badge/blog-game--develop--road-yellow.svg)](https://www.yuque.com/fengyong/game-develop-road)

## 说明

- 以个人实践为主，有些方案并非是最佳实践。
- 适用于轻量级游戏，单一场景，界面使用 prefab 进行管理。
- 适用于新手，仅包含一些基础的游戏模块。

## 使用方法

- 拷贝 release 包下的所有文件到自己的项目中。
  - 可以参考示例项目。
  - fy-1.0.0.js，需要作为插件脚本导入。
  - types/，自定义的声明文件，放在 assets **外**即可。

## 项目结构

```
cocos-game-framework（项目目录）
（环境部分）
|-- .vscode （vscode 配置）
|-- .gitignore （git 配置）
|-- package.json （依赖配置）
|-- package-lock.json
|-- rollup.config.js （rollup 配置）
|-- tsconfig.json （typescrip t配置）
（框架部分）
|-- framwork
    |-- dist （框架输出）
    |-- src （框架源码）
|-- types
    |-- fy （自动生成的框架代码声明文件）
    |-- fy.d.ts （将框架导出为 umd 声明）
    |-- game.d.ts （自定义 cocos 引擎相关额外说明）
（cocos项目部分）
|-- creator.d.ts （放在 types 外，因为需要从编辑器自动生成来更新）
|-- ...
```

## 规范

### 组织规范

- 【0 依赖】框架除去依赖 cocos creator 之外，不依赖其他外部库。
- 【扁平化】文件作为逻辑上的模块区分，不作为实际上的逻辑区分，大多数通用方法，类，接口，类型均位于全局唯一模块「fy」之下。少部分方法也只会封装 1 层，位于全局模块下。

### 命名规范：大驼峰，小驼峰，大写下划线，小写下划线，连接符

- 方法名，变量名采用「小写下划线」。
- 常量名，事件名使用「大写下划线」。
- 类名，装饰器方法，枚举（enum），接口（interface），类型别名（type）使用「大驼峰」。
- 文件夹名，文件名使用「连接符」。
- 使用英文而不是拼音。注意时态和单复数正确。
- 方法名使用动宾结构（do_something）完整描述。包括不限于：
  动词 | 含义
  -- | --
  get | 获取某个值。
  set | 设置某个值。一般没有返回值。
  change | 修改某个值。
  to | 转义某个值。
  do | 执行某个逻辑。
  try | 尝试执行某逻辑，一般后面还需要一个动词。一般返回 boolean 表示是否执行成功。
  is | 判断某个逻辑。不要使用 are 来做区分。
  load | 载入某个资源，一般用于引擎资源载入。
  init | 初始化某个模块。
  call | 调用原生。
  log | 生成 log 信息。
  random | 获取某个随机值。
  De | 特殊方法，用于装饰器。
  ... | ...
- 一般不要使用缩写。可以使用一些通用的，常用的缩写。使用时应该保证大小写相同。即 `fsm` `FSM`。包括不限于：
  缩写 | 完整 | 含义
  -- | -- | --
  wp | world position | 世界坐标
  lp | local position | 本地坐标
  fsm | finite state machine | 有限状态机
  ins | instance | 实例
  ... | ... | ...
- 一般不要使用前缀后缀。可以使用一些通用的，常用的前缀后缀。使用时可以自由更改大小写。即 `config` `CONFIG` `Config`。包括不限于：
  前缀后缀 | 含义
  -- | --
  config | 配置信息
  event | 事件名
  meta | 配置表信息
  params | 参数，一般为复数

### git commit message 规范

- 参考资料：http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html
- TODO：未来会增加自动 change log。
- 7 个标识：
  标识 | 含义
  -- | --
  feat | 新功能（feature）
  fix | 修补 bug
  docs | 文档（documentation）
  style | 格式（不影响代码运行的变动）
  refactor | 重构（即不是新增功能，也不是修改 bug 的代码变动）
  test | 增加测试
  chore | 构建过程或辅助工具的变动

### 代码规范

- 代码次序为：
  - export ...
  - import ...
  - cc.\_decorator
  - C 只在此模块中使用的配置数据
  - EVENT 事件
  - enum|interface|type
  - namespace|class
  - 依赖方法。比如通过继承需要实现的方法。
  - 常量
  - 变量
  - 方法
- 使用 export 而不是 export default。
- 使用模块而不是命名空间。注意 export namespace 定义的是模块而不是命名空间。
- 严格控制导出，优先使用 private 而不是 public。
- 使用箭头函数而不是 function。
- 针对类，使用组合 implements 而不是继承 extends。
- 使用双引号，反引号，而不是单引号。
- 使用「字符串字面量类型」或者「常量字符串枚举」而不是「普通枚举」。因为前者在编译后会删除，后者则不会。
- 使用 forEach 或者其他高阶方法遍历而不是 for 循环。（for 循环的性能最高，在大数组遍历时可以使用）（高阶方法参考：https://www.yuque.com/fengyong/game-develop-road/gwv8xo ）
- 避免在遍历时添加 break 和 return 逻辑，这样做会影响循环的语义性。
