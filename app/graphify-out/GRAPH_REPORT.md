# Graph Report - app  (2026-11-23)

## Corpus Check
- 36 files · ~10,091 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .rules 1)

## Summary
- 246 nodes · 540 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c40084b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- state/cart.tsx
- api.ts
- compilerOptions
- package.json
- index.ts
- functions/package.json
- pages/cart.tsx
- compilerOptions
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 17 edges
2. `HttpError` - 16 edges
3. `zmp-ui` - 14 edges
4. `MyApp()` - 13 edges
5. `StaffPage()` - 11 edges
6. `vnd()` - 11 edges
7. `getToken()` - 11 edges
8. `StaffOrdersPage()` - 10 edges
9. `compilerOptions` - 10 edges
10. `auth()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `checkoutCallback` --calls--> `verifyCallback()`  [EXTRACTED]
  functions/src/index.ts → functions/src/checkout.ts
- `MyApp()` --calls--> `BottomNav()`  [EXTRACTED]
  src/app.tsx → src/components/bottom-nav.tsx
- `MyApp()` --calls--> `CartPage()`  [EXTRACTED]
  src/app.tsx → src/pages/cart.tsx
- `MyApp()` --calls--> `PrivacyPage()`  [EXTRACTED]
  src/app.tsx → src/pages/privacy.tsx
- `MyApp()` --calls--> `RewardsPage()`  [EXTRACTED]
  src/app.tsx → src/pages/rewards.tsx

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.12
Nodes (30): react, react-router-dom, zmp-ui, MyApp(), BottomNav(), tabs, ProductCard(), StampCard() (+22 more)

### Community 1 - "api.ts"
Cohesion: 0.10
Nodes (44): Voucher, RewardsPage(), ACTION, FILTERS, LABEL, StaffOrdersPage(), change(), load() (+36 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (34): dependencies, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5, zmp-sdk@^2.54.0, zmp-ui@1.11.15-2 (+26 more)

### Community 5 - "index.ts"
Cohesion: 0.09
Nodes (43): buildCheckout(), enc(), hmac(), orderMacData(), PayMethod, sameMac(), verifyCallback(), handle() (+35 more)

### Community 6 - "functions/package.json"
Cohesion: 0.08
Nodes (21): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+13 more)

### Community 7 - "pages/cart.tsx"
Cohesion: 0.50
Nodes (7): CartPage(), checkout(), createOrder(), PayMethod, payCheckout(), requestPhoneToken(), itemPrice()

### Community 8 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, outDir, rootDir, skipLibCheck, sourceMap, strict (+2 more)

### Community 10 - "Niên – Zalo Mini App (demo)"
Cohesion: 0.40
Nodes (4): Chạy thử trên máy (không cần Zalo, không cần Firebase), Cấu trúc, Niên – Zalo Mini App (demo), Việc còn lại

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `state/cart.tsx` to `api.ts`, `package.json`, `pages/cart.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `state/cart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11945031712473574 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `state/cart.tsx` to `api.ts`, `package.json`, `pages/cart.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10352941176470588 - nodes in this community are weakly interconnected._
- **Why does `firebase-admin` connect `functions/package.json` to `index.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0746031746031746 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._