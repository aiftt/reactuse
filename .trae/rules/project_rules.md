# 编辑器规范

- 总是在生成代码之后直接应用代码，而不是让我手动应用。
- 每完成一个 api 必须更新 TODO.md 中对应 API 的状态

## 指令

- `/dev`: 按照 TODO.md 待办事项进行推进，注意项目架构 INIT.md，以及项目规范。

# ReactUse 项目规则

## 项目目标

### 核心目标
- **完整复刻 VueUse**：实现 React 版本的 VueUse，提供与 VueUse 功能对等的 React Hooks
- **Next.js 优先支持**：确保所有 hooks 在 Next.js 环境中完美运行，包括 SSR/SSG 场景
- **现代 React 支持**：仅支持 React 19+ 最新版本，充分利用现代 React 特性

### 功能范围
- 状态管理类 hooks（localStorage, sessionStorage, toggle, counter 等）
- 浏览器 API 封装（mouse, scroll, clipboard, geolocation 等）
- 网络请求类 hooks（fetch, async, debounce, throttle 等）
- DOM 操作类 hooks（eventListener, clickOutside, intersection 等）
- 工具类 hooks（date, math, array, object 操作等）
- Next.js 专用 hooks（router, head, image 等）

## 技术规范

### React 版本要求
- **React 版本**：React 19.1.0+ (仅支持最新版本)
- **TypeScript**：5.7+ (最新稳定版)
- **Next.js**：15.4+ (仅支持最新版本，App Router 优先)
- **Node.js**：20.0+ (LTS 版本)

### 包管理
- **包管理器**：统一使用 pnpm 9.0+
- **Monorepo**：使用 pnpm workspace 管理多包结构
- **依赖管理**：最小化外部依赖，优先使用 React 内置能力

### 代码规范

#### API 设计原则
1. **命名一致性**：与 VueUse 保持相同的命名规范（如 `useMouse`, `useLocalStorage`）
2. **返回值结构**：优先返回对象而非数组，便于解构和扩展
3. **TypeScript 优先**：所有 hooks 必须有完整的类型定义
4. **SSR 兼容**：所有 hooks 必须支持服务端渲染
5. **现代特性优先**：充分利用 React 19 的新特性（如 use、useOptimistic 等）

#### Hook 实现规范
1. **自动清理**：组件卸载时自动清理副作用（事件监听、定时器等）
2. **性能优化**：合理使用 useMemo、useCallback 避免不必要的重渲染
3. **错误处理**：提供完善的错误边界和异常处理
4. **可配置性**：提供灵活的配置选项，支持自定义行为
5. **并发安全**：支持 React 19 的并发特性

#### 文件组织

```sh
packages/
├── core/                    # 核心 hooks 包 (@reactuse/core)
│   ├── src/
│   │   ├── browser/        # 浏览器 API hooks
│   │   ├── state/          # 状态管理 hooks
│   │   ├── network/        # 网络请求 hooks
│   │   ├── dom/            # DOM 操作 hooks
│   │   ├── utilities/      # 工具类 hooks
│   │   └── index.ts        # 统一导出
│   ├── package.json
│   └── README.md
├── nextjs/                  # Next.js 专用 hooks (@reactuse/nextjs)
│   ├── src/
│   │   ├── router/         # 路由相关 hooks
│   │   ├── head/           # Head 管理 hooks
│   │   ├── image/          # 图片优化 hooks
│   │   ├── ssr/            # SSR 相关 hooks
│   │   └── index.ts
│   ├── package.json
│   └── README.md
├── components/              # 基于 hooks 的组件 (@reactuse/components)
│   ├── src/
│   │   ├── Mouse/          # 鼠标相关组件
│   │   ├── Scroll/         # 滚动相关组件
│   │   └── index.ts
│   ├── package.json
│   └── README.md
├── integrations/            # 第三方集成 hooks (@reactuse/integrations)
│   ├── src/
│   │   ├── firebase/       # Firebase 集成
│   │   ├── supabase/       # Supabase 集成
│   │   ├── prisma/         # Prisma 集成
│   │   └── index.ts
│   ├── package.json
│   └── README.md
├── shared/                  # 公共工具和类型 (@reactuse/shared)
│   ├── src/
│   │   ├── types/          # 通用类型定义
│   │   ├── utils/          # 工具函数
│   │   ├── constants/      # 常量定义
│   │   └── index.ts
│   ├── package.json
│   └── README.md
└── docs/                    # 文档和示例
├── src/
├── examples/
└── package.json
```


### 测试要求

#### 测试覆盖率
- **单元测试**：每个 hook 必须有 95%+ 的测试覆盖率
- **集成测试**：测试 hooks 组合使用场景
- **SSR 测试**：验证服务端渲染兼容性
- **Next.js 测试**：在 Next.js 15+ 环境中的完整测试
- **并发测试**：验证 React 19 并发特性兼容性

#### 测试工具
- **测试框架**：Vitest 2.0+ (最新版本)
- **React 测试**：@testing-library/react 16.0+
- **Hook 测试**：@testing-library/react-hooks
- **E2E 测试**：Playwright 1.40+ (针对复杂交互场景)
- **性能测试**：React DevTools Profiler

### 文档规范

#### 文档要求
1. **API 文档**：每个 hook 必须有详细的 API 文档
2. **使用示例**：提供基础和高级使用示例
3. **Next.js 示例**：专门的 Next.js 15+ 使用示例
4. **迁移指南**：从 VueUse 迁移到 ReactUse 的指南
5. **最佳实践**：React 19 + Next.js 15 的最佳实践

#### 文档结构
- 快速开始
- API 参考
- 使用指南
- Next.js 集成
- React 19 特性
- 最佳实践
- 常见问题
- 迁移指南

### 发布规范

#### 版本管理
- **语义化版本**：严格遵循 semver 规范
- **变更日志**：详细记录每个版本的变更
- **破坏性变更**：主版本号变更时明确标注破坏性变更
- **最新版本优先**：不考虑向后兼容，始终使用最新技术

#### 包发布
- **npm 发布**：发布到 npm 官方仓库
- **JSR 发布**：同时发布到 JSR (JavaScript Registry)
- **CDN 支持**：提供 ESM CDN 版本
- **类型定义**：包含完整的 TypeScript 类型定义

### 性能要求

#### 性能指标
- **包大小**：单个 hook 压缩后不超过 1.5KB
- **运行时性能**：充分利用 React 19 的性能优化
- **内存使用**：及时清理，避免内存泄漏
- **Tree Shaking**：完美支持按需引入
- **并发性能**：优化并发渲染性能

#### 优化策略
- 使用 React 19 的新特性（use、useOptimistic、useActionState 等）
- 合理使用 useMemo 和 useCallback
- 避免不必要的重新渲染
- 优化异步操作和事件处理
- 支持 Suspense 和并发特性

### 兼容性要求

#### 浏览器支持
- **现代浏览器**：Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **移动端**：iOS Safari 17+, Chrome Mobile 120+
- **不支持**：任何旧版本浏览器
- **ES 版本**：ES2023+

#### 框架兼容
- **React**：19.1.0+ (仅最新版本)
- **Next.js**：15.4+ (仅最新版本，App Router 优先)
- **Vite**：6.0+ (最新版本)
- **Webpack**：5.90+ (最新版本)
- **Turbopack**：完全支持

### 开发环境

#### 必需工具
- **Node.js**：20.0+ (LTS)
- **pnpm**：9.0+
- **TypeScript**：5.7+
- **ESLint**：9.0+
- **Prettier**：3.0+

#### 推荐 IDE 配置
- **VS Code**：最新版本
- **扩展**：TypeScript, ESLint, Prettier, React
- **设置**：启用严格模式，自动格式化

### 贡献规范

#### 代码贡献
1. **Fork & PR**：通过 Fork 和 Pull Request 贡献代码
2. **代码审查**：所有代码必须经过审查
3. **测试要求**：新功能必须包含测试
4. **文档更新**：API 变更必须更新文档
5. **现代化优先**：优先使用最新的 React 19 特性

#### 提交规范
- **Conventional Commits**：使用约定式提交格式
- **提交信息**：清晰描述变更内容和原因
- **关联 Issue**：提交关联相关 Issue
- **类型前缀**：feat, fix, docs, style, refactor, test, chore

### 质量保证

#### CI/CD 流程
- **自动测试**：每次提交自动运行测试
- **代码检查**：ESLint + Prettier 代码格式检查
- **类型检查**：TypeScript 严格模式检查
- **性能测试**：关键 hooks 的性能基准测试
- **兼容性测试**：React 19 + Next.js 15 兼容性测试

#### 发布流程
1. 版本号更新
2. 变更日志生成
3. 自动化测试通过
4. 文档更新
5. npm + JSR 包发布
6. GitHub Release 创建
7. 社区通知

## 项目里程碑

### Phase 1: 基础设施 (Week 1-2)
- [ ] 项目结构搭建（monorepo + pnpm workspace）
- [ ] 开发环境配置（TypeScript 5.7+, ESLint 9+）
- [ ] CI/CD 流程建立（GitHub Actions）
- [ ] 文档站点搭建（VitePress）
- [ ] 测试环境配置（Vitest 2.0+）

### Phase 2: 核心 Hooks (Week 3-6)
- [ ] 状态管理类 hooks（useLocalStorage, useSessionStorage, useToggle）
- [ ] 浏览器 API 类 hooks（useMouse, useWindowSize, useScroll）
- [ ] 网络请求类 hooks（useFetch, useAsync, useDebounce）
- [ ] DOM 操作类 hooks（useEventListener, useClickOutside）
- [ ] React 19 特性集成（use, useOptimistic, useActionState）

### Phase 3: Next.js 集成 (Week 7-8)
- [ ] Next.js 15+ 专用 hooks
- [ ] App Router 优化
- [ ] SSR/SSG 优化
- [ ] Turbopack 兼容性
- [ ] 性能优化

### Phase 4: 高级功能 (Week 9-10)
- [ ] 第三方集成 hooks
- [ ] 组件库开发
- [ ] 性能基准测试
- [ ] 文档完善
- [ ] 社区推广

## 成功标准

### 功能完整性
- [ ] 覆盖 VueUse 95%+ 的核心功能
- [ ] 所有 hooks 在 Next.js 15+ 中完美工作
- [ ] 完整的 TypeScript 5.7+ 支持
- [ ] 95%+ 的测试覆盖率
- [ ] 充分利用 React 19 新特性

### 性能指标
- [ ] 包大小控制在最优范围
- [ ] 运行时性能优于原生实现
- [ ] 完美支持 Tree Shaking
- [ ] 零内存泄漏
- [ ] 并发渲染优化

### 开发体验
- [ ] 完善的文档和示例
- [ ] 优秀的 TypeScript 智能提示
- [ ] 清晰的错误信息
- [ ] 活跃的社区支持
- [ ] 现代化的开发工具链

### 技术领先性
- [ ] 使用最新的 React 19 特性
- [ ] 支持最新的 Next.js 15 功能
- [ ] 现代化的构建工具
- [ ] 前沿的开发实践
- [ ] 社区认可度