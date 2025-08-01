import { Callout } from 'nextra/components'

# ReactUse

**Essential React Hooks for React 19+**

ReactUse is a collection of essential React hooks that solve common problems in modern React applications. Built specifically for React 19+ and Next.js 15+.

<Callout type="info" emoji="⚡">
  ReactUse is optimized for React 19+ and leverages the latest React features including concurrent rendering, Suspense, and new hooks.
</Callout>

## Quick Start

```bash
pnpm add @reactuse/core
```

```tsx
import { useLocalStorage, useMouse } from '@reactuse/core'

function App() {
  const [name, setName] = useLocalStorage('name', 'Anonymous')
  const { x, y } = useMouse()

  return (
    <div>
      <p>Hello {name}!</p>
      <p>Mouse position: {x}, {y}</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
    </div>
  )
}
```

## Features

- **⚡ React 19+ Ready** - Built for the latest React features including concurrent rendering, Suspense, and new hooks.
- **🔧 TypeScript First** - Written in TypeScript with full type safety and excellent IntelliSense support.
- **🌐 SSR Compatible** - Works seamlessly with Next.js 15+, supporting both SSR and SSG out of the box.
- **📦 Tree Shakable** - Import only what you need. Each hook is optimized for minimal bundle size.
- **🎯 VueUse Inspired** - Familiar API design inspired by VueUse, making migration easy for Vue developers.
- **🧪 Well Tested** - Comprehensive test suite with 95%+ coverage ensuring reliability.

## Why ReactUse?

ReactUse provides a comprehensive collection of React hooks that solve common problems in modern React applications:

- **Modern React Support**: Leverages the latest React features for optimal performance
- **Next.js Optimization**: Perfect integration with Next.js App Router and server components
- **Developer Experience**: Excellent TypeScript support with intelligent auto-completion
- **Production Ready**: Battle-tested hooks used in production applications

## Packages

| Package | Description | Version |
|---------|-------------|----------|
| [@reactuse/core](/core/) | Essential React hooks | ![npm](https://img.shields.io/npm/v/@reactuse/core) |
| [@reactuse/shared](/shared/) | Shared utilities and types | ![npm](https://img.shields.io/npm/v/@reactuse/shared) |

## Community

ReactUse is an open-source project. We welcome contributions from the community!

- 🐛 [Report Issues](https://github.com/reactuse/reactuse/issues)
- 💡 [Request Features](https://github.com/reactuse/reactuse/discussions)
- 🤝 [Contributing Guide](https://github.com/reactuse/reactuse/blob/main/CONTRIBUTING.md)