# cocos游戏轻量级框架
* 以个人实践为主，某些处理可能并非是最佳实践。我刚入门游戏开发，还在不断学习中。
* 个人游戏开发博客，欢迎交流。https://www.yuque.com/fengyong/game-develop-road

###### 重要更新
* 2019-1-30，更新项目名称为cocos-game-framework，更新一些资源的命名方式

### 适用范围
* cocos-creator版本：2.0.8。
* 适用于新手，包含一些基础的游戏界面、逻辑、音频、本地存储、多语言管理。
* 适用于轻量级游戏，单一场景，界面使用prefab进行管理。

### 使用方法
* 拷贝整个项目作为基础使用。
* 单文件直接使用，文件依赖参考文件头部import部分。
    * 依赖处理
        * G，在G.ts文件中找到对应方法，复制到当前文件中替换
        * MLog，直接MLog替换为cc，或者是自定义的log方法
        * MVersion，根据实际需求替换为true/false，或者直接删除
        * 其余组件，根据依赖特别处理
* 思路参考，某些处理并非是最优解，但是提供了一个还算不错的思路可以参考。

### 文件说明
- [**`AppMain`**] 游戏启动唯一主入口，完成资源初始化，部分单例脚本初始化，本地存储初始化，loading界面逻辑管理
- [**`GamePlay`**] 游戏的主Gameplay
- [**`G`**] 通用方法
- [**`L`**] 本地存储方法
- [**`M系列`**] 管理组
    - [**`MPanel`**] 界面管理，界面UI动画管理
    - [**`MSoud`**] 声音管理
    - [**`Mi18n`**] 多语言管理
    - [**`MAction`**] 动画管理
    - [**`MLog`**] log信息管理
    - [**`MVersion`**] 版本管理，运行环境管理
- [**`T系列`**] 工具组，一般需要挂载到节点上
    - [**`TAddPrefab`**] onLoad()时添加一个prefab
    - [**`TChildNode`**] 子节点管理
    - [**`TNull`**] 空脚本
    - [**`TSize`**] 节点比例化修改大小
    - [**`TZIndex`**] 编辑器中修改节点zIndex
    - [**`TErase`**] 橡皮擦效果
    - [**`TColor`**] 颜色控制工具
    - [**`TFollow`**] 节点跟随工具
    - [**`TScrollList`**] 滑动列表工具
- [**`Panel系列`**] 界面组，脚本命名方式为Panel*，需要挂载在界面的同名prefab下
    - [**`PanelLoading`**] 开场时的loading页面
    - [**`PanelBase`**] 标准页面（建议新建panel时直接复制PanelBase.prefab和PanelBase.ts并重命名）
    - [**`PanelWait`**] 一个通用的等待页面
    - [**`PanelGuide`**] 一个个人使用的新手引导页面
    - [**`PanelMessage`**] 一个通用的消息页面
- [**`Action系列`**] 动画组，脚本命名方式为Anima*，包含一些游戏中常用的复杂动画
- [**`System系列`**] 子系统组，脚本命名方式为S*，游戏子系统管理
- [**`Controller系列`**] 控制器组，脚本命名方式为C*，游戏中重要组件的控制器

### 规范
##### 命名规范
* 文件名采用PascalCase
* 文件的主类名和文件同名
* 常量采用“大写字母+下划线”命名
* 类中的变量、方法采用“小写字母+下划线”命名，本项是为了与引擎自带方法区分开，如果引擎是“小写字母+下划线”写的方法，则使用camelCase
##### export规范
* 使用export而不是export default
* 一般一个文件只有一个export，如果有enum，interface类型的数据也可以有多个export，注意命名冲突
##### class or namespace
* 目前量级较少，使用class来显示脚本与脚本的依赖关系，不使用namespace
* 如果项目较大，则使用namespace做区域划分
##### public or private
* typescript默认为public
* 建议全部private化，只有需要外部调用的方法public

### 两层逻辑设计：数据逻辑层system + 显示逻辑层controller
1. 数据逻辑层system
    * 实现游戏逻辑，处理游戏数据
    * 以子系统的方式区分逻辑和数据，例如：新手引导系统，离线奖励系统，分数系统
2. 显示逻辑层controller
    * 界面的显示逻辑，对于只有单一Panel对应的子系统，进行代码合并，在Panel中即处理数据，也处理显示
    * 界面中重要组件的显示逻辑