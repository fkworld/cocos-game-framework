# cocos 轻量级游戏框架

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![blog](https://img.shields.io/badge/blog-game--develop--road-yellow.svg)](https://www.yuque.com/fengyong/game-develop-road)
![](https://img.shields.io/badge/Cocos--Creator-2.3.3-blue)
![](https://img.shields.io/badge/框架版本-1.0.0-blue)
![](https://img.shields.io/badge/脚本语言-TypeScript-blue)

## 说明

- 以个人实践为主，有些方案并非是最佳实践。我刚入门游戏开发，还在不断学习中。
- 适用于轻量级游戏，单一场景，界面使用 prefab 进行管理。
- 适用于新手，包含一些基础的游戏界面、逻辑、音频、本地存储、多语言管理。

## 使用方法

- 拷贝 release 包下的所有文件到自己的项目中。
  - 可以参考示例项目。
  - fy-1.0.0.js，需要作为插件脚本导入。
  - types/，自定义的声明文件，放在 assets**外**即可。

## 项目结构

```
cocos-game-framework（项目目录）
（环境部分）
|-- .vscode （vscode配置）
|-- .gitignore （git配置）
|-- package.json （依赖）
|-- package-lock.json
|-- rollup.config.js （rollup配置）
|-- tsconfig.json （typescript配置）
（框架部分）
|-- framwork
    |-- dist （框架输出）
    |-- src （框架源码）
|-- types
    |-- fy （自动生成的框架代码声明文件）
    |-- fy.d.ts （将框架导出为umd声明）
    |-- game.d.ts （自定义cocos引擎相关额外说明）
（cocos项目部分）
|-- creator.d.ts （放在types外，因为需要从编辑器自动生成来更新）
```

## 规范

### 扁平化

- 文件作为逻辑上的模块区分，不作为实际上的逻辑区分，所有方法，类，接口，类型均位于全局唯一模块「fy」之下。

### 框架 0 依赖

- 框架层为 0 依赖

### 命名规范：大驼峰，小驼峰，大写下划线，小写下划线，连接符

- 使用「restful-api」的形式完整描述。
  - get：获取某个值。
  - set：设置某个值，可以使用 flag 来规定是否直接设置。
  - change：修改某个值。
  - to：转义某个值。
  - do：执行某个逻辑。
  - is：判断某个逻辑。
  - load：载入某个资源，一般用于引擎资源载入。
  - init：初始化某个模块。
  - call：调用原生。
  - log：生成 log 信息。
  - try：尝试执行某逻辑，一般返回 boolean 是否执行成功。
  - random：获取某个随机值
  - De：特殊方法，用于类的装饰器。
  - EVENT：触发事件
- 文件夹名，文件名使用「连接符」。
- 类名，装饰器方法使用「大驼峰」。
- enum，interface，type 使用「大驼峰」，并利用前缀进行含义标注：
  - Type：表示类型。
  - Param：表示参数（不论入参还是出参）。
  - Data：表示数据。
  - Config：特殊数据，用于配置文件。
  - Need：表示在不能使用抽象类作为父类时，继承类必须实现的方法
- 常量名，事件名使用「大写下划线」。
- 变量名、方法名使用「小写下划线」：
  - 本项为了与引擎自带方法区分开，如果引擎使用「小写下划线」，则本项使用「小驼峰」。
- 一些特殊命名：
  - meta：表示配置表。
  - wp，lp：表示直接坐标，本地坐标。

### 代码规范

- 框架代码次序为：import，event，enum|interface|type，变量，方法。
- 游戏代码次序为：import，cc.\_decorator，C（静态数据），enum|interface|type，namespace|class。
- 使用「字符串字面量类型」或者「常量枚举类型」而不是「枚举类型」。因为前者在编译后会删除，后者则不会。
- 使用「export」而不是「export default」。
- 使用「export namespace」而不是「namespace」或者「类的静态方法」。
- 在类中，优先使用「private」而不是「public」。
- 在函数内部使用箭头函数而不是 function。外部函数定义可以使用 function。
- 使用 forEach 或者其他高阶方法遍历而不是 for 循环。（for 循环的性能最高，在大数组遍历时可以使用）（高阶方法参考：https://www.yuque.com/fengyong/game-develop-road/gwv8xo ）
- 避免在遍历时添加 break 和 return 逻辑，这样做会影响循环的语义性。
- 避免对 object 类型的遍历，如果不可避免，则通过 Object.keys 方法转化为数组后遍历。
- 使用双引号，反引号，而不是单引号。

### 架构规范

- 保证框架层的独立性，避免在框架层中直接写入数据。（参考 FColor 与 DataColor）。
- 数据与显示分离，数据优于显示。（参考：https://www.yuque.com/fengyong/game-develop-road/toqqxe ）
- 唯有设计上的统一性才能保证架构上的统一性，切记！
