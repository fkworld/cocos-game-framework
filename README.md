# cocos游戏轻量级框架
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![blog](https://img.shields.io/badge/blog-game--develop--road-yellow.svg)](https://www.yuque.com/fengyong/game-develop-road)
![](https://img.shields.io/badge/Cocos--Creator-2.1.3-blue)

## 说明
* 以个人实践为主，有些方案并非是最佳实践。我刚入门游戏开发，还在不断学习中。
* 适用于轻量级游戏，单一场景，界面使用 prefab 进行管理。
* 适用于新手，包含一些基础的游戏界面、逻辑、音频、本地存储、多语言管理。

## 使用方法
* 拷贝整个项目作为基础使用。
* 单文件直接使用，文件依赖参考文件头部import部分。针对3种特殊的依赖：
    1. G，在 g-global.ts 中找到对应的方法，拷贝。
    2. FMLog，使用 cc.log 代替，或者使用自定义的 log 方法。
    3. FMVersion，使用 true/false 代替，或者直接删除，或者使用自定义的版本判定方法。
* 思路参考，某些处理并非是最优解，但是提供了一个还算不错的思路可以参考。

## 文件说明
- [**`App`**] 游戏启动唯一主入口
- [**`G`**] 通用方法
- [**F系列脚本**] 框架层
    - [**`FAnima`**] 动画
    - [**`FColor`**] 颜色数据存储；绑定数据文件 data/color.ts
    - [**`FHttp`**] 网络交互
    - [**`FLocal`**] 本地存储；绑定数据文件 data/local.ts
    - [**`FLog`**] 日志
    - [**`FPanel`**] 界面
    - [**`FSound`**] 声音；绑定数据文件 data/suond.ts
    - [**`FText`**] 文字数据；绑定数据文件 data/text-*.ts
    - [**`FVersion`**] 游戏版本
- [**T系列脚本**] 工具层，一些独立的功能脚本
    - [**`TChild`**] 子节点组合
    - [**`TColor`**] 绑定颜色
    - [**`TSize`**] 修改大小
    - [**`TText`**] 绑定文字
    - [**`TZIndex`**] 修改节点渲染顺序
- [**data系列脚本**] 数据文件
- [**C系列脚本**] controller 的缩写，表示控制器脚本
- [**S系列脚本**] system 的缩写，表示系统脚本
- [**Panel系列脚本**] 每个界面下挂载的默认脚本

## 规范（仅针对 typescript）
### 命名规范（大驼峰，小驼峰，下划线，连接符）
* 类名/模块名使用大驼峰，文件名与文件中主类（主模块）相同。
* 常量使用下划线+大写字母
* 变量/方法使用下划线+小写字母。（本项为了与引擎自带方法区分开，如果引擎使用下划线+小写字母命名，则本项使用小驼峰）
* typescript 中的 enum/interface/type 使用大驼峰，并且利用前缀进行含义说明：
    * Type* 表示类型
    * Params* 表示参数（不论入参还是出参）
    * Data* 表示数据。
* 最多使用 1 个前缀表示大类别，其余用后缀表示。
    * anima_*，表示动画函数的前缀。
    * *_btn，表示组件类型的后缀，类似的还有 _label/_sp 等。
    * *_list，表示数据结构的后缀。（不要使用复数命名，使用单数对应的数据结构如 array/list/set/map 等）
* 保证命名的统一性：如介词的使用（本项目中使用 to 和 by，其中 to 后面接输出值，by 后面接输入值），前缀，后缀，系统名等。
### 代码规范
* 代码次序为：import/cc._decorator，C（静态数据），enum/interface/type，main-class/main-namespace
* 使用字符串枚举而不是数字枚举。不要使用 enum/cc.Enum，或者其他数字枚举，数字枚举再描述性上非常差。
* 使用 export 而不是 export default。
* 使用 module（export namespace）而不是 namespace。
* 使用 module（export namespace）而不是 class 中的 static 方法。
* 在 class 中，对于不需要外部调用的属性和方法，使用 private 而不是 public。
* 在 module 中，不要轻易使用 export。
* 在函数内部使用箭头函数而不是 function。外部函数定义可以使用 function。
* 使用 forEach 或者其他高阶方法遍历而不是 for 循环。（for 循环的性能最高，在大数组遍历时可以使用）（高阶方法参考：https://www.yuque.com/fengyong/game-develop-road/gwv8xo ）
* 避免在遍历时添加 break 和 return 逻辑，这样做会影响循环的语义性。
* 避免对 object 类型的遍历，如果不可避免，则通过 Object.keys 方法转化为数组后遍历。
* 使用双引号，反引号，而不是单引号。
### 架构规范
* 极力避免对底层/中台进行修改，使用底层代码 + 数据配置文件的方案进行规避。（参考 FColor/FText/FSound）
* 数据与显示分离，数据优于显示。（参考：https://www.yuque.com/fengyong/game-develop-road/toqqxe ）
* 唯有设计上的统一性才能保证架构上的统一性，切记！
