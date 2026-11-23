# Graph Report - app  (2026-11-23)

## Corpus Check
- 49 files · ~16,066 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 306 nodes · 688 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edf551f1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- state/cart.tsx
- api.ts
- createHost
- compilerOptions
- package.json
- index.ts
- functions/package.json
- staff-orders.tsx
- compilerOptions
- pages/cart.tsx
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 28 edges
2. `HttpError` - 16 edges
3. `StaffOrdersPage()` - 14 edges
4. `zmp-ui` - 14 edges
5. `MyApp()` - 13 edges
6. `vnd()` - 13 edges
7. `CartPage()` - 13 edges
8. `StaffPage()` - 12 edges
9. `useToast()` - 11 edges
10. `getToken()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `OrderInput` --references--> `CartItem`  [EXTRACTED]
  src/services/api.ts → src/data/types.ts
- `ProductPage()` --calls--> `useToast()`  [EXTRACTED]
  src/pages/product.tsx → src/lucian/toast.tsx
- `MyApp()` --calls--> `CartPage()`  [EXTRACTED]
  src/app.tsx → src/pages/cart.tsx
- `MyApp()` --calls--> `RewardsPage()`  [EXTRACTED]
  src/app.tsx → src/pages/rewards.tsx
- `MyApp()` --calls--> `StaffOrdersPage()`  [EXTRACTED]
  src/app.tsx → src/pages/staff-orders.tsx

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.08
Nodes (43): react, react-router-dom, zmp-ui, MyApp(), BottomNav(), TABS, asset(), ProductArt() (+35 more)

### Community 1 - "api.ts"
Cohesion: 0.14
Nodes (30): Voucher, StaffPage(), addStamp(), API, checkMockQr(), defaultMember, getMember(), lookupMember() (+22 more)

### Community 2 - "createHost"
Cohesion: 0.61
Nodes (8): createHost(), bar(), dismiss(), layout(), setOpen(), show(), swipe(), timer()

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (38): dependencies, @fontsource/baloo-2@^5.2.5, @fontsource/be-vietnam-pro@^5.2.5, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5 (+30 more)

### Community 5 - "index.ts"
Cohesion: 0.09
Nodes (45): buildCheckout(), enc(), hmac(), orderMacData(), PayMethod, sameMac(), verifyCallback(), handle() (+37 more)

### Community 6 - "functions/package.json"
Cohesion: 0.07
Nodes (25): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+17 more)

### Community 7 - "staff-orders.tsx"
Cohesion: 0.12
Nodes (24): LucianMemberCard(), Props, LucianSkeleton(), LucianStampCard(), Props, Ctx, Show, ToastType (+16 more)

### Community 8 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, outDir, rootDir, skipLibCheck, sourceMap, strict (+2 more)

### Community 9 - "pages/cart.tsx"
Cohesion: 0.24
Nodes (11): LucianOrderSteps(), ICONS, LucianPaymentOptions(), PayOption, CartPage(), checkout(), createOrder(), PayMethod (+3 more)

### Community 10 - "Niên – Zalo Mini App (demo)"
Cohesion: 0.40
Nodes (4): Chạy thử trên máy (không cần Zalo, không cần Firebase), Cấu trúc, Niên – Zalo Mini App (demo), Việc còn lại

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `state/cart.tsx` to `pages/cart.tsx`, `package.json`, `api.ts`, `staff-orders.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `state/cart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08283730158730158 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `state/cart.tsx` to `pages/cart.tsx`, `package.json`, `api.ts`, `staff-orders.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `createHost()` connect `createHost` to `state/cart.tsx`, `staff-orders.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06794871794871794 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08708272859216255 - nodes in this community are weakly interconnected._