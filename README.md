# cocos游戏基础框架

### 简介
适用于新手，包含一些基础的游戏内容管理

### 主要文件介绍
- [/framework/AppMain.js] 游戏启动唯一主入口（显示调用资源载入过程）
- [/framework/G.js] 封装一些通用方法
- [/framework/L.js] 本地存储相关
- [/framework/MRes.js] 资源管理，链式载入resource下面的资源
- [/framework/MPanel.js] 界面管理，每一个界面独立成为一个prefab，每次需要打开时载入
- [/framework/MAudio.js] 音频管理，包括静音功能
- [/framework/tools] 一些中介性质工具
- [/anima] 一些有完整生命周期的动画
- [/panel] panel脚本
- [/gameplay] gameplay相关脚本（个人不习惯将所有游戏运行逻辑放在一个文件中，因此会拆分放到一个文件夹中）

### 逐一文件介绍

###### [MRes.js] 资源管理文件
在游戏中有一些需要动态载入的资源，特别是需要使用到cc.loadResDir()方法载入的集体资源，可以使用本文件进行载入、存储。

**需要满足的要求是**：
1. 【可能】需链式载入。B资源的载入可能需要A资源载入完毕后才可以载入。
2. 【必然】异步载入。引擎中`cc.loadResDir()`方法是一个异步方法，一些同步操作则需要异步方法执行完毕后使用。

**对应的解决思路**：可以使用ES6提供的`Promise`来解决异步载入和链式载入的问题。使用Promise封装`cc.loadResDir()`方法，在资源载入完毕后抛出`resolve()`。同时编写一个链式执行多个`Promise`的工具（参考G.js）来完成链式载入。

###### [MPanel.js] 界面管理文件
在游戏中需要一些子界面，子界面的内容应当是尽量独立的，因此常用的解决方案是将子界面独立制作成一个`cc.Prefab`，在需要使用到的时候通过`cc.instantiate()`方法载入进游戏场景中。

**要求**：
1. 进行统一的管理，可以方便的调用打开和关闭方法。
2. 可以编写默认的打开/关闭动画。
3. 进行屏幕适配。
4. 额外进行自定义Loading子界面管理（进度条+健康游戏忠告）。

**思路**：
* 有3种处理处理方案。第1种是全部载入`cc.Prefab`的同时创建`cc.Node`，然后通过`cc.Node.active`的来隐藏和显示。第2种是通过`cc.loadRes()`方法获取到界面名称载入`cc.Prefab`，然后创建`cc.Node`表示打开，使用`cc.Node.destory()`方法删除节点表示关闭。第3种是全部载入`cc.Prefab`但是并不创建`cc.Node`，在需要打开的时候创建，在需要关闭的时候删除。3种方法各有优劣。方法1适合界面较少，方法2适合界面较多，全部载入耗费时间过长，方法3则比较中庸。本项目采用方法3。
* 实现默认的打开/关闭动画，目前采用`try-catch`进行处理。优先寻找子界面对应同名脚本的`open()`方法，如果没有，则进行默认的`open()`方法。关键代码如下所示：
```javascript
try {
    node.getComponent(panel_name).open()
} catch (error) {
    MPanel.open(node)
}
```
这种处理思路并不合理，比如当脚本内的`open()`方法为空方法时，则基本会出现异常。未来会考虑加入`AnimaOpenClose`脚本，来进行打开过程中界面内各组件的分别动画管理，在`open`过程中直接调用。
* 通过`cc.winSize`（游戏运行时窗口大小）来进行屏幕适配。分成2部分，1部分是整体屏幕适配，通过修改`[cc.Canvas.fitWidth,cc.Canvas.fitHeight]`来进行；另一部分是子窗口的屏幕适配，通过修改子窗口根节点大小来进行。关键代码如下所示：
```javascript
// 本部分适配由于是游戏整体适配，故而写在AppMain.js中
// 设计屏幕大小自定义，建议写在文件开头的配置C中
if (cc.winSize.height / cc.winSize.width > 1136 / 640) {
    [this.canvas.fitHeight, this.canvas.fitWidth] = [false, true]
} else {
    [this.canvas.fitHeight, this.canvas.fitWidth] = [true, false]
}
```
```javascript
// 在创建子界面node的时候修改node的大小
// 注意前后分号不要省略，有些结构下可能会导致异常；使用解构赋值时特别要注意分号问题
;[node.width, node.height] = [cc.winSize.width, cc.winSize.height];
```
* Loading建议直接放在游戏场景中而不是放在`cc.Prefab`中，因为大多数的Loading界面都非常相似，并且Loading界面最好是直接显示出来而不是通过有延迟的载入显示出来。因此Loading界面的动画需要单独定制，参考`AppMain.js`。

###### [MAudio] 音频管理文件
**要求**：
1. 方便的播放声音。
2. 静音功能。
3. 【可能】区别music/sound/...等不同的音效类型。

**思路**：
* `cc.AudioClip`在载入过程中，载入成功后返回的是一串字符串（可能是引擎bug），因此不适合全部载入，只能用`cc.loadRes()`载入。
* 通过本地存储（参考`L.js`）确定音效是否可以播放。