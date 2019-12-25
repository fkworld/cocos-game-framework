# cocos 轻量级游戏框架
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![blog](https://img.shields.io/badge/blog-game--develop--road-yellow.svg)](https://www.yuque.com/fengyong/game-develop-road)
![](https://img.shields.io/badge/Cocos--Creator-2.2.1-blue)
![](https://img.shields.io/badge/框架版本-1.0.0-blue)
![](https://img.shields.io/badge/脚本语言-TypeScript-blue)

## 说明
* 以个人实践为主，有些方案并非是最佳实践。我刚入门游戏开发，还在不断学习中。
* 适用于轻量级游戏，单一场景，界面使用 prefab 进行管理。
* 适用于新手，包含一些基础的游戏界面、逻辑、音频、本地存储、多语言管理。

## 使用方法
* 拷贝整个项目作为基础使用。
* 拷贝框架层所有文件并放入到现有项目中。推荐使用此方式，在框架层升级时可以直接替换。
* 拷贝单个文件并放入到现有项目中。
* 参考某些功能的实现方式，在现有项目中自己实现。

## 文件说明
- **`App`** 游戏启动唯一主入口
- 框架层
    - **`FColor`** 颜色数据模块
    - **`FHttp`** 网络模块（未完整实现）
    - **`FLocal`** 本地存储模块
    - **`FMeta`** 游戏数据表模块
    - **`FNodeStateAnima`** 节点动画状态模块
    - **`FPanel`** 界面模块
    - **`FSound`** 声音模块
    - **`FState`** 状态工具
    - **`FText`** 文字模块（多语言）
    - **`FTool`** 封装一些常用的方法
    - **`Fversion`** 版本管理模块
- 业务层
    - **`T*`** 一些常用的工具脚本
    - **`Data*`** 一些配置数据
    - **`Meta*`** 数据表脚本
    - **`Panel*`** 界面脚本
    - **`C*`** Controller 脚本，一般需要继承 cc.Component，进行游戏逻辑的处理
    - **`S*`** System 脚本，一般不继承 cc.Component，进行游戏数据的处理

## 规范
### 命名规范（大驼峰，小驼峰，下划线，连接符）
* 类名、模块名使用大驼峰。文件名需要与文件中的主类、主模块名相同。
* 常量名使用下划线+大写字母。
* 变量名、方法名使用下划线+小写字母。本项为了与引擎自带方法区分开，如果引擎使用下划线+小写字母命名，则本项使用小驼峰。
* enum、interface、type 使用大驼峰，并且利用前缀进行含义说明：
    * Type* 表示类型。
    * Params* 表示参数（不论入参还是出参）。
    * Data* 表示数据。
* 保证命名的统一性
    * 介词的使用，在本项目中，to 后接输出，by 后接输入。
    * 前缀，后缀，系统名等。
### 代码规范
* 代码次序为：import，cc._decorator，C（静态数据），enum，interface，type，main namespace，main class。
* 使用「字符串字面量类型」或者「常量枚举类型」而不是「枚举类型」。因为前者在编译后会删除，后者则不会。
* 使用「export」而不是「export default」。
* 使用「export namespace」而不是「namespace」或者「类的静态方法」。
* 在类中，优先使用「private」而不是「public」。
* 在函数内部使用箭头函数而不是 function。外部函数定义可以使用 function。
* 使用 forEach 或者其他高阶方法遍历而不是 for 循环。（for 循环的性能最高，在大数组遍历时可以使用）（高阶方法参考：https://www.yuque.com/fengyong/game-develop-road/gwv8xo ）
* 避免在遍历时添加 break 和 return 逻辑，这样做会影响循环的语义性。
* 避免对 object 类型的遍历，如果不可避免，则通过 Object.keys 方法转化为数组后遍历。
* 使用双引号，反引号，而不是单引号。
### 架构规范
* 保证框架层的独立性，避免在框架层中直接写入数据。（参考 FColor 与 DataColor）。
* 数据与显示分离，数据优于显示。（参考：https://www.yuque.com/fengyong/game-develop-road/toqqxe ）
* 唯有设计上的统一性才能保证架构上的统一性，切记！
