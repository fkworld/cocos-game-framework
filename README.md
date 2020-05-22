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
        |--
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

- 【去依赖】框架除依赖 cocos creator 之外，不依赖其他外部库。
- 【独立化】减少框架内模块的相互依赖。
- 【扁平化】文件即作为一个模块。模块中 export 的全部内容均处于全局「fy」下。针对部分模块不适合放在全局下的，可以额外添加 1 层。

### 命名规范：大驼峰，小驼峰，大写下划线，小写下划线，连接符

- 方法名，变量名采用「小写下划线」。
- 常量名，事件名使用「大写下划线」。
- 模块名使用「小驼峰」。
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
- 使用 undefined 而不是 null。二者几乎没差别，但 null 一般表示此处不应该有值，undefined 一般表示此处有应该有值但未定义。
- 使用 export 而不是 export default。
- 使用 export namespace（模块） 而不是 namespace（命名空间）。
- 优先使用 private 而不是 public。
- 一般不要使用 \_ 作为命名的开头。例外情况是：这个方法需要被导出，但并不希望被使用。
- 使用箭头函数而不是 function。
- 将方法参数中，object 或 function 类型的参数，置于最后。
- 优先使用 implements（组合） 而不是 extends（继承）。
- 使用「双引号」或「反引号」而不是单引号。
- 使用「字符串字面量类型」或「字符串枚举」而不是「数字枚举」。
- 使用 forEach 或者其他高阶方法遍历而不是 for 循环。（for 循环的性能最高，在大数组遍历时可以使用）（高阶方法参考：https://www.yuque.com/fengyong/game-develop-road/gwv8xo ）。还应该避免在 for 循环时添加 break 和 return 逻辑，这样做会影响循环的语义性。
