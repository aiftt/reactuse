# ReactUse 开发待办清单

本文档列出了需要从 VueUse 移植到 ReactUse 的所有 API。

## 核心函数 (Core Functions)

### State 状态管理
- [x] createGlobalState - 在全局范围内保持状态，可在 Vue 实例间重用
- [ ] injectLocal - 扩展的 inject，能够调用 provideLocal 在同一组件中提供值
- [ ] provideLocal - 扩展的 provide，能够调用 injectLocal 在同一组件中获取值
- [x] useLocalStorage - 响应式 LocalStorage
- [x] useSessionStorage - 响应式 SessionStorage
- [ ] useStorage - 响应式 LocalStorage/SessionStorage

### Elements 元素操作
- [ ] useResizeObserver - 报告元素内容或边框的尺寸变化
- [ ] useWindowFocus - 使用 window.onfocus 和 window.onblur 事件响应式跟踪窗口焦点
- [ ] useElementBounding - HTML 元素的响应式边界框
- [ ] useElementSize - HTML 元素的响应式大小
- [ ] useElementVisibility - 跟踪元素在视口内的可见性
- [ ] useElementStyle - 将响应式对象同步到目标元素的 CSS 样式
- [ ] useElementTransform - 将响应式对象同步到目标元素的 CSS 变换

### Browser 浏览器 API
- [ ] useActiveElement - 响应式 document.activeElement
- [ ] useBreakpoints - 响应式视口断点
- [ ] useBrowserLocation - 响应式浏览器位置
- [x] useClipboard - 响应式剪贴板 API
- [x] useColorMode - 响应式颜色模式（深色/浅色/自定义）与自动数据持久化
- [ ] useCssVar - 操作 CSS 变量
- [x] useDark - 响应式深色模式与自动数据持久化
- [x] useEventListener - 轻松使用 EventListener
- [ ] useFavicon - 响应式网站图标
- [x] useFetch - 响应式 Fetch API，提供中止请求的能力
- [ ] useFullscreen - 响应式全屏 API
- [ ] useImage - 在浏览器中响应式加载图片
- [ ] useMediaControls - 音频和视频元素的响应式媒体控制
- [ ] useMediaQuery - 响应式媒体查询
- [ ] usePermission - 响应式权限 API
- [ ] usePreferredColorScheme - 响应式 prefers-color-scheme 媒体查询
- [ ] usePreferredDark - 响应式深色主题偏好
- [ ] usePreferredLanguages - 响应式导航器语言
- [ ] useScriptTag - 脚本标签注入
- [ ] useShare - 响应式 Web Share API
- [ ] useTitle - 响应式文档标题
- [ ] useUrlSearchParams - 响应式 URLSearchParams

### Sensors 传感器
- [x] onClickOutside - 监听元素外部的点击
- [ ] onKeyStroke - 监听键盘按键
- [ ] onStartTyping - 当用户在非可编辑元素上开始输入时触发
- [ ] useBattery - 响应式电池状态 API
- [ ] useDeviceLight - 响应式 DeviceLightEvent（已废弃）
- [ ] useDeviceMotion - 响应式 DeviceMotionEvent
- [ ] useDeviceOrientation - 响应式 DeviceOrientationEvent
- [ ] useDevicePixelRatio - 响应式跟踪 window.devicePixelRatio
- [ ] useDevicesList - 响应式枚举可用的输入/输出设备
- [ ] useDocumentVisibility - 响应式跟踪 document.visibilityState
- [ ] useFocus - 跟踪或设置 DOM 元素焦点状态的响应式工具
- [ ] useFocusWithin - 跟踪元素或其后代是否有焦点的响应式工具
- [ ] useFps - 响应式 FPS（每秒帧数）
- [ ] useGeolocation - 响应式地理位置 API
- [ ] useIdle - 跟踪用户是否处于非活动状态
- [ ] useIntersectionObserver - 检测目标元素的可见性
- [ ] useMagicKeys - 响应式按键状态
- [x] useMouse - 响应式鼠标位置
- [ ] useMouseInElement - 相对于元素的响应式鼠标位置
- [ ] useMousePressed - 响应式鼠标按下状态
- [ ] useMutationObserver - 监视 DOM 树的变化
- [ ] useNetwork - 响应式网络状态
- [ ] useOnline - 响应式在线状态
- [ ] usePageLeave - 响应式状态显示鼠标是否离开页面
- [ ] useParallax - 轻松创建视差效果
- [ ] usePointerSwipe - 基于 PointerEvents 的响应式滑动检测
- [ ] useSpeechRecognition - 响应式语音识别
- [ ] useSwipe - 基于 TouchEvents 的响应式滑动检测
- [ ] useUserMedia - 响应式 mediaDevices.getUserMedia 流
- [ ] useWindowScroll - 响应式窗口滚动
- [x] useWindowSize - 响应式窗口大小

### Network 网络
- [ ] useFetch - 响应式 Fetch API，提供中止请求的能力
- [ ] useEventSource - EventSource 或服务器发送事件实例，打开到 HTTP 服务器的持久连接
- [ ] useWebSocket - 响应式 WebSocket 客户端
- [ ] useWebWorker - 简单的 Web Workers 注册和通信
- [ ] useWebWorkerFn - 运行昂贵的函数而不阻塞 UI

### Animation 动画
- [ ] useInterval - 每个间隔递增的响应式计数器
- [ ] useIntervalFn - 带控制的 setInterval 包装器
- [ ] useNow - 响应式当前日期实例
- [ ] useRafFn - 在每个 requestAnimationFrame 上调用函数
- [ ] useTimeout - 在给定时间后更新值并带控制
- [ ] useTimeoutFn - 带控制的 setTimeout 包装器
- [ ] useTimestamp - 响应式当前时间戳
- [ ] useTransition - 值之间的过渡

### Component 组件
- [ ] computedInject - 结合 computed 和 inject
- [ ] templateRef - 绑定 ref 到模板元素的简写
- [ ] tryOnMounted - 安全的 onMounted
- [ ] tryOnUnmounted - 安全的 onUnmounted
- [ ] unrefElement - DOM 元素的 unref
- [ ] useTemplateRefsList - 在 v-for 内绑定 refs 到模板元素和组件的简写
- [ ] useVModel - v-model 绑定的简写
- [ ] useVModels - props v-model 绑定的简写

### Watch 监听
- [ ] until - 承诺式一次性监听变化
- [ ] watchArray - 监听数组的添加和删除
- [ ] watchDeep - 使用 {deep: true} 监听值的简写
- [ ] watchOnce - 使用 {once: true} 监听值的简写
- [ ] whenever - 监听值为真的简写

### Reactivity 响应式
- [ ] createRef - 根据 deep 参数返回 deepRef 或 shallowRef
- [ ] reactify - 将普通函数转换为响应式函数
- [ ] reactifyObject - 将 reactify 应用到对象
- [ ] refAutoReset - 在一段时间后重置为默认值的 ref
- [ ] reactivePick - 从响应式对象中响应式选择字段
- [ ] syncRef - 双向 refs 同步
- [ ] syncRefs - 保持目标 refs 与源 ref 同步
- [ ] toRef - 将 value/ref/getter 标准化为 ref 或 computed
- [ ] toValue - 获取 value/ref/getter 的值

### Array 数组
- [ ] useArrayDifference - 响应式数组差异
- [ ] useArrayEvery - 响应式 Array.every
- [ ] useArrayFilter - 响应式 Array.filter
- [ ] useArrayFind - 响应式 Array.find
- [ ] useArrayFindIndex - 响应式 Array.findIndex
- [ ] useArrayFindLast - 响应式 Array.findLast
- [ ] useArrayIncludes - 响应式 Array.includes
- [ ] useArrayJoin - 响应式 Array.join
- [ ] useArrayMap - 响应式 Array.map
- [ ] useArrayReduce - 响应式 Array.reduce
- [ ] useArraySome - 响应式 Array.some
- [ ] useArrayUnique - 响应式数组去重

### Time 时间
- [ ] useCountdown - useIntervalFn 的包装器，提供倒计时功能
- [ ] useDateFormat - 根据传递的令牌字符串获取格式化日期
- [ ] useTimeAgo - 响应式时间前

### Utilities 工具
- [ ] and - refs 的 AND 条件
- [ ] asyncComputed - 异步函数的 computed
- [ ] autoResetRef - 在一段时间后重置为默认值的 ref
- [ ] biSyncRef - 双向 refs 同步
- [ ] controlledComputed - 显式定义 computed 的依赖
- [ ] controlledRef - 对 ref 及其响应性的细粒度控制
- [ ] createEventHook - 创建事件钩子的工具
- [ ] createUnrefFn - 创建接受 ref 和原始值作为参数的普通函数
- [ ] extendRef - 为 Ref 添加额外属性
- [ ] get - 访问 ref.value 的简写
- [ ] isDefined - Ref 的非空检查类型守卫
- [ ] makeDestructurable - 使对象和数组在同一时间具有同构解构性
- [ ] not - refs 的 NOT 条件
- [ ] or - refs 的 OR 条件
- [ ] set - ref.value = x 的简写
- [ ] useAsyncQueue - 按顺序执行每个异步任务并将当前任务结果传递给下一个任务
- [ ] useAsyncState - 响应式异步状态
- [ ] useCached - 使用自定义比较器缓存 ref
- [ ] useConfirmDialog - 创建事件钩子以支持模态和确认对话框链
- [x] useCounter - 带实用函数的基本计数器
- [ ] useDebounce - 防抖执行
- [ ] useMemoize - 根据参数缓存函数结果并保持响应式
- [ ] useStepper - 提供构建多步向导界面的助手
- [ ] useThrottle - 节流执行
- [x] useToggle - 带实用函数的布尔切换器

## 扩展包 (Add-ons)

### @vueuse/math 数学
- [ ] useClamp - 响应式地将值限制在两个其他值之间
- [ ] useFloor - 响应式 Math.floor
- [ ] useMath - 响应式 Math 方法
- [ ] useMax - 响应式 Math.max
- [ ] useMin - 响应式 Math.min
- [ ] usePrecision - 响应式数字精度
- [ ] useProjection - 从一个域到另一个域的响应式数值投影
- [ ] useRound - 响应式 Math.round
- [ ] useSum - 响应式获取数组的和
- [ ] useTrunc - 响应式 Math.trunc

### @vueuse/motion 动画
- [ ] useElementStyle - 将响应式对象同步到目标元素 CSS 样式
- [ ] useElementTransform - 将响应式对象同步到目标元素 CSS 变换
- [ ] useMotion - 让你的组件动起来
- [ ] useMotionProperties - 访问目标元素的运动属性
- [ ] useMotionVariants - 处理变体状态和选择
- [ ] useSpring - 弹簧动画

### @vueuse/router 路由
- [ ] useRouteHash - route.hash 的响应式简写
- [ ] useRouteParams - route.params 的响应式简写
- [ ] useRouteQuery - route.query 的响应式简写

### @vueuse/integrations 集成
- [ ] useAsyncValidator - async-validator 的包装器
- [ ] useAxios - axios 的包装器
- [ ] useChangeCase - change-case 的响应式包装器
- [ ] useCookies - universal-cookie 的包装器
- [ ] useDrauu - drauu 的响应式实例
- [ ] useFocusTrap - focus-trap 的响应式包装器
- [ ] useFuse - 使用 Fuse.js 轻松实现模糊搜索的组合式
- [ ] useIDBKeyval - idb-keyval 的包装器
- [ ] useJwt - jwt-decode 的包装器
- [ ] useNProgress - nprogress 的响应式包装器
- [ ] useQRCode - qrcode 的包装器
- [ ] useSortable - sortable 的包装器

### @vueuse/rxjs RxJS
- [ ] from - RxJS from() 和 fromEvent() 的包装器，允许它们接受 refs
- [ ] toObserver - 将 ref 转换为 RxJS Observable 的语法糖函数
- [ ] useExtractedObservable - 使用从一个或多个组合式中提取的 RxJS Observable
- [ ] useObservable - 使用 RxJS Observable
- [ ] useSubject - 将 RxJS Subject 绑定到 ref 并双向传播值变化
- [ ] useSubscription - 使用 RxJS Subscription 而不用担心取消订阅或创建内存泄漏
- [ ] watchExtractedObservable - 监听从一个或多个组合式中提取的 RxJS Observable 的值

### @vueuse/firebase Firebase
- [ ] useAuth - 响应式 Firebase Auth 绑定
- [ ] useFirestore - 响应式 Firestore 绑定
- [ ] useRTDB - 响应式 Firebase 实时数据库绑定

### @vueuse/electron Electron
- [ ] useIpcRenderer - 提供 ipcRenderer 及其所有 API
- [ ] useIpcRendererInvoke - 响应式 ipcRenderer.invoke API 结果
- [ ] useIpcRendererOn - 轻松使用 ipcRenderer.on 并在卸载时自动 ipcRenderer.removeListener
- [ ] useZoomFactor - 响应式 WebFrame 缩放因子
- [ ] useZoomLevel - 响应式 WebFrame 缩放级别

### @vueuse/head Head 管理
- [ ] createHead - 创建 head 管理器实例
- [ ] useHead - 响应式更新 head 元标签

### @vueuse/sound 声音
- [ ] useSound - 响应式播放音效

### @vueuse/schema-org Schema.org
- [ ] 各种 Schema.org 相关的组合式函数

### @vueuse/gesture 手势
- [ ] 各种手势识别相关的组合式函数

## 开发优先级

### 第一阶段 - 核心基础 (P0)
- State: useLocalStorage, useSessionStorage, createGlobalState
- Browser: useDark, useColorMode, useClipboard, useFetch
- Sensors: useMouse, useKeyboard, useWindowSize, useElementSize
- Animation: ✅ useInterval, ✅ useTimeout, ✅ useNow
- Utilities: useToggle, useCounter, ✅ useDebounce, ✅ useThrottle

### 第二阶段 - 常用功能 (P1)
- Elements: useResizeObserver, useElementVisibility, useIntersectionObserver
- Browser: useMediaQuery, useBreakpoints, useEventListener
- Sensors: useFocus, useIdle, useOnline, useGeolocation
- Component: useVModel, templateRef
- Watch: whenever, until

### 第三阶段 - 高级功能 (P2)
- Reactivity: syncRef, reactify, toValue
- Array: 所有数组相关函数
- Time: useDateFormat, useTimeAgo, useCountdown
- Network: useWebSocket, useEventSource

### 第四阶段 - 扩展包 (P3)
- @reactuse/math
- @reactuse/router (React Router 集成)
- @reactuse/integrations

### 第五阶段 - 特殊集成 (P4)
- @reactuse/motion (Framer Motion 集成)
- @reactuse/rxjs
- 其他第三方库集成

## 实施计划 (Implementation Plan)

### Phase 1: 项目初始化 (Week 1)
- [x] 项目架构设计
- [ ] 初始化 monorepo 项目结构
- [ ] 配置 TypeScript 和构建工具
- [ ] 设置代码规范工具 (ESLint, Prettier)
- [ ] 配置测试环境
- [ ] 设置 CI/CD 流程

### Phase 2: 核心 Hooks 开发 (Week 2-4)
- [x] 实现状态管理类 hooks
  - [x] useLocalStorage
  - [x] useSessionStorage
  - [x] useToggle
  - [x] useCounter
- [ ] 实现浏览器 API 类 hooks
  - [x] useMouse
  - [x] useWindowSize
  - [ ] useScroll
  - [ ] useClipboard
- [ ] 实现网络请求类 hooks
  - [ ] useFetch
  - [ ] useAsync
  - [ ] useDebounce
  - [ ] useThrottle

### Phase 3: DOM 操作和高级功能 (Week 5-6)
- [ ] 实现 DOM 操作类 hooks
  - [x] useEventListener
  - [x] useClickOutside
  - [ ] useIntersectionObserver
- [ ] 实现高级功能 hooks
  - [ ] useVirtualList
  - [ ] useInfiniteScroll
  - [ ] useDrag

### Phase 4: 组件和集成 (Week 7-8)
- [ ] 基于 hooks 开发组件
- [ ] 第三方库集成 hooks
- [ ] React Router 集成
- [ ] 性能优化和测试

### Phase 5: 文档和发布 (Week 9-10)
- [ ] 完善文档站点
- [ ] 编写使用指南和最佳实践
- [ ] 性能测试和优化
- [ ] 发布到 npm
- [ ] 集成 Vercel 并发布文档到 vercel
- [ ] 社区推广

## 设计原则

### 1. API 设计原则
- **一致性**: 保持 API 命名和使用方式的一致性
- **简洁性**: 提供简洁易用的 API
- **可组合性**: hooks 之间可以自由组合使用
- **类型安全**: 完整的 TypeScript 类型支持

### 2. 性能原则
- **按需加载**: 支持 tree-shaking
- **内存管理**: 自动清理副作用，防止内存泄漏
- **渲染优化**: 避免不必要的重新渲染
- **异步处理**: 合理处理异步操作和竞态条件

### 3. 兼容性原则
- **React 版本**: 支持 React 19.1+
- **浏览器兼容**: 支持现代浏览器
- **SSR 友好**: 支持服务端渲染
- **TypeScript**: 完整的类型定义

## 质量保证

### 1. 测试策略
- **单元测试**: 每个 hook 都有完整的单元测试
- **集成测试**: 测试 hooks 之间的组合使用
- **性能测试**: 确保性能符合预期
- **兼容性测试**: 多版本 React 兼容性测试

### 2. 代码质量
- **代码审查**: 严格的代码审查流程
- **静态分析**: ESLint + TypeScript 静态检查
- **文档完整**: 每个 API 都有详细文档和示例
- **版本管理**: 语义化版本控制

## 注意事项

1. **React 适配**: 所有函数需要适配 React Hooks 模式
2. **TypeScript**: 完整的 TypeScript 支持
3. **SSR**: 支持 Next.js 服务端渲染
4. **性能**: 优化 re-render 性能
5. **测试**: 每个函数都需要完整的测试覆盖
6. **文档**: 提供详细的使用文档和示例

## 进度跟踪

- 总计函数数量: 200+
- 已完成: 18 (useLocalStorage, useSessionStorage, useToggle, useCounter, useMouse, useWindowSize, useEventListener, useClickOutside, createGlobalState, useDark, useColorMode, useClipboard, useFetch, useDebounce, useThrottle, useInterval, useTimeout, useNow)
- 进行中: 0
- 待开始: 182+

---

*最后更新: 2024-12-19*
*基于 VueUse 官方文档和项目架构设计整理*