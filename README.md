# cocos游戏轻量级框架
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg?style=flat-square)](https://996.icu)
* 以个人实践为主，某些处理可能并非是最佳实践。我刚入门游戏开发，还在不断学习中。
* 个人游戏开发博客，欢迎交流。https://www.yuque.com/fengyong/game-develop-road 。

###### 重要更新
* 2019-6-17，使用dash规范重命名文件。
* 2019-1-30，更新项目名称为cocos-game-framework，更新一些资源的命名方式

### 适用范围
* cocos-creator版本：2.0.10。
* 适用于轻量级游戏，单一场景，界面使用prefab进行管理。
* 适用于新手，包含一些基础的游戏界面、逻辑、音频、本地存储、多语言管理。

### 使用方法
* 拷贝整个项目作为基础使用。
* 单文件直接使用，文件依赖参考文件头部import部分。针对3种特殊的依赖：
    1. G，在g-global.ts中找到对应的方法，拷贝。
    2. FMLog，使用cc.log代替，或者使用自定义的log方法。
    3. FMVersion，使用true/false代替，或者直接删除，或者使用自定义的版本判定方法。
* 思路参考，某些处理并非是最优解，但是提供了一个还算不错的思路可以参考。

### 文件说明
- [**`f-app`**] 游戏启动唯一主入口，完成资源初始化，部分单例脚本初始化，本地存储初始化，loading界面逻辑管理
- [**`f-global`**] 通用方法
- [**`f-local`**] 本地存储方法
- [**`fm/f-manager`**] 管理组
    - [**`fm-panel`**] 界面管理，界面UI动画管理
    - [**`fm-sound`**] 声音管理
    - [**`fm-i18n`**] 多语言管理
    - [**`fm-anima`**] 动画管理
    - [**`fm-log`**] log信息管理
    - [**`fm-version`**] 版本管理，运行环境管理
    - [**`fm-http`**] 网络
- [**`ft/f-tools`**] 工具组，一般需要挂载到节点上
    - [**`ft-add-prefab`**] 在当前节点下添加一个prefab
    - [**`ft-child`**] 添加n个子节点
    - [**`ft-null`**] 空脚本
    - [**`ft-size`**] 节点比例化修改大小
    - [**`ft-z-index`**] 编辑器中修改节点zIndex
    - [**`ft-erase`**] 橡皮擦效果
    - [**`ft-color`**] 颜色控制工具
    - [**`ft-follow`**] 节点跟随工具
    - [**`ft-scroll-list`**] 滑动列表工具
    - [**`ft-modal`**] 子对话框组件
- [**`panel/MVC-VC`**] 界面组，脚本命名方式为Panel*，需要挂载在界面的同名prefab下
    - [**`panel-loading`**] 开场时的loading页面
    - [**`panel-base`**] 标准页面（建议新建panel时直接复制PanelBase.prefab和PanelBase.ts并重命名）
    - [**`panel-wait`**] 一个通用的等待页面
    - [**`panel-guide`**] 一个个人使用的新手引导页面
    - [**`panel-message`**] 一个通用的消息页面
- [**`system/MVC-M`**] 子系统组，脚本命名方式为S*，游戏子系统管理
- [**`controller/MVC-VC`**] 控制器组，脚本命名方式为C*，游戏中重要组件的控制器
- [**`data`**] 数据文件,一般是i18n的语言脚本,color的颜色脚本等

### 规范
##### 命名规范
* 文件名采用dash规范，类名采用PascalCase规范。
* 常量采用“大写字母+下划线”命名。
* 类中的变量、方法采用“小写字母+下划线”命名，本项是为了与引擎自带方法区分开，如果引擎是“小写字母+下划线”写的方法，则使用camelCase。
##### 脚本规范
* 依次分别为`import,ccclass/C,enum/interface/type,other-class,main-class`
##### export规范
* 使用`export`而不是`export default`
* 一般一个文件只有一个`export`，如果有`enum`，`interface`类型的数据也可以有多个`export`，注意命名冲突
##### class or namespace
* cocos-creator暂时对`namespace`的支持不好，无法按照官方例子使用，因此本项建议全部使用`class`代替
##### public or private
* typescript默认为`public`
* 建议全部`private`化，只有需要外部调用的方法`public`
##### 遍历
* 通用情况：针对`Array`和`Map`类型，完全遍历(指不需要`break`或者`continue`)时候，使用`forEach()`；不完全遍历使用`for...of`。
* 数组遍历的特殊情况下，使得逻辑更加明显，可以使用一些特定的内置方法。参考：https://www.yuque.com/fengyong/game-develop-road/gwv8xo
* 大数组遍历时，使用性能最高的`普通for循环`，并提前计算好`length`。
* 尽量避免直接遍历`Object`；如果不可避免，则使用`Object.keys()`转换为`Array`后遍历。
##### 箭头函数
* 总是使用箭头函数`()=>{}`代替`function`

### 两层逻辑设计：M+VC，M-数据层system，VC-显示/控制层controller
1. 数据层system
    * 实现游戏逻辑，处理游戏数据
    * 以子系统的方式区分逻辑和数据，例如：新手引导系统，离线奖励系统，分数系统
2. 显示层panel/controller
    * panel为单个界面逻辑
    * controller为界面中重要组件逻辑
3. 合并与拆分
    * M与VC的合并：如果某个系统只对应单一的panel，则合并到panel中，如panel-message
    * VC的拆分：VC仅仅在是文件上合并，在实际逻辑中依然是拆分的