# Graph Report - app  (2026-11-23)

## Corpus Check
- 23 files · ~3,686 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 124 nodes · 276 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f89215c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- state/cart.tsx
- app.tsx
- api.ts
- compilerOptions
- dependencies
- package.json
- devDependencies
- vite
- pages/cart.tsx
- scripts
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 15 edges
2. `zmp-ui` - 12 edges
3. `MyApp()` - 11 edges
4. `compilerOptions` - 10 edges
5. `CartPage()` - 9 edges
6. `vnd()` - 9 edges
7. `useCart()` - 7 edges
8. `ProductCard()` - 6 edges
9. `HomePage()` - 6 edges
10. `MenuPage()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `OrderInput` --references--> `CartItem`  [EXTRACTED]
  src/services/api.ts → src/data/types.ts
- `MyApp()` --calls--> `CartPage()`  [EXTRACTED]
  src/app.tsx → src/pages/cart.tsx
- `MyApp()` --calls--> `MenuPage()`  [EXTRACTED]
  src/app.tsx → src/pages/menu.tsx
- `MyApp()` --calls--> `ProductPage()`  [EXTRACTED]
  src/app.tsx → src/pages/product.tsx
- `MyApp()` --calls--> `MemberProvider()`  [EXTRACTED]
  src/app.tsx → src/state/member.tsx

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.20
Nodes (19): ProductCard(), categories, ice, products, shot, stores, sugar, CartItem (+11 more)

### Community 1 - "app.tsx"
Cohesion: 0.25
Nodes (11): react, zmp-ui, MyApp(), BottomNav(), tabs, StampCard(), HomePage(), PrivacyPage() (+3 more)

### Community 2 - "api.ts"
Cohesion: 0.20
Nodes (16): Voucher, API, defaultMember, getMember(), Member, mockAddStamp(), OrderInput, post() (+8 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5, zmp-sdk@^2.54.0, zmp-ui@1.11.15-2, react-dom (+3 more)

### Community 5 - "package.json"
Cohesion: 0.29
Nodes (6): qrcode@^1.5.4, name, private, type, version, qrcode

### Community 6 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/react@^18.3.3, @types/react-dom@^18.3.0, typescript@^5.5.4, @types/react, @types/react-dom, typescript

### Community 7 - "vite"
Cohesion: 0.29
Nodes (6): vite@^5.4.2, @vitejs/plugin-react@^4.3.1, zmp-vite-plugin@^1.1.6, vite, @vitejs/plugin-react, zmp-vite-plugin

### Community 8 - "pages/cart.tsx"
Cohesion: 0.67
Nodes (5): CartPage(), checkout(), createOrder(), requestPhoneToken(), itemPrice()

### Community 9 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, deploy, dev, start

### Community 10 - "Niên – Zalo Mini App (demo)"
Cohesion: 0.40
Nodes (4): Chạy thử trên máy (không cần Zalo, không cần Firebase), Cấu trúc, Niên – Zalo Mini App (demo), Việc còn lại

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `app.tsx` to `state/cart.tsx`, `api.ts`, `dependencies`, `package.json`, `pages/cart.tsx`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Why does `zmp-ui` connect `app.tsx` to `state/cart.tsx`, `pages/cart.tsx`, `dependencies`, `package.json`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._