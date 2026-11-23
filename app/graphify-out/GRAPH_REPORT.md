# Graph Report - app  (2026-11-23)

## Corpus Check
- 49 files · ~16,208 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 308 nodes · 689 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `385ad599`
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
- react
- compilerOptions
- pages/cart.tsx
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 28 edges
2. `HttpError` - 16 edges
3. `MyApp()` - 14 edges
4. `zmp-ui` - 14 edges
5. `vnd()` - 13 edges
6. `StaffOrdersPage()` - 13 edges
7. `CartPage()` - 12 edges
8. `StaffPage()` - 11 edges
9. `useToast()` - 11 edges
10. `getToken()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `MyApp()` --calls--> `CartPage()`  [EXTRACTED]
  src/app.tsx → src/pages/cart.tsx
- `MyApp()` --calls--> `HomePage()`  [EXTRACTED]
  src/app.tsx → src/pages/home.tsx
- `MyApp()` --calls--> `RewardsPage()`  [EXTRACTED]
  src/app.tsx → src/pages/rewards.tsx
- `MyApp()` --calls--> `StaffOrdersPage()`  [EXTRACTED]
  src/app.tsx → src/pages/staff-orders.tsx
- `MyApp()` --calls--> `StaffPage()`  [EXTRACTED]
  src/app.tsx → src/pages/staff.tsx

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.08
Nodes (44): zmp-ui, MyApp(), BottomNav(), TABS, asset(), preloaded, preloadProductImages(), ProductArt() (+36 more)

### Community 1 - "api.ts"
Cohesion: 0.11
Nodes (42): Voucher, ACTION, FILTERS, LABEL, maskPhone(), StaffOrdersPage(), change(), load() (+34 more)

### Community 2 - "createHost"
Cohesion: 0.61
Nodes (8): createHost(), bar(), dismiss(), layout(), setOpen(), show(), swipe(), timer()

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.06
Nodes (39): dependencies, @fontsource/baloo-2@^5.2.5, @fontsource/be-vietnam-pro@^5.2.5, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5 (+31 more)

### Community 5 - "index.ts"
Cohesion: 0.09
Nodes (45): buildCheckout(), enc(), hmac(), orderMacData(), PayMethod, sameMac(), verifyCallback(), handle() (+37 more)

### Community 6 - "functions/package.json"
Cohesion: 0.07
Nodes (25): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+17 more)

### Community 7 - "react"
Cohesion: 0.20
Nodes (12): react, StampCard(), LucianAnnouncement(), LucianMemberCard(), Props, LucianSkeleton(), LucianStampCard(), Props (+4 more)

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

- **Why does `react` connect `react` to `state/cart.tsx`, `pages/cart.tsx`, `package.json`, `api.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Should `state/cart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0807909604519774 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `state/cart.tsx` to `pages/cart.tsx`, `package.json`, `api.ts`, `react`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10549645390070922 - nodes in this community are weakly interconnected._
- **Why does `createHost()` connect `createHost` to `state/cart.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08708272859216255 - nodes in this community are weakly interconnected._