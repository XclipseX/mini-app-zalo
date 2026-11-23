# Graph Report - app  (2026-11-23)

## Corpus Check
- 35 files · ~8,556 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .rules 1)

## Summary
- 225 nodes · 483 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `498c3b56`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- state/cart.tsx
- app.tsx
- api.ts
- compilerOptions
- package.json
- index.ts
- functions/package.json
- pages/cart.tsx
- compilerOptions
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 16 edges
2. `HttpError` - 14 edges
3. `zmp-ui` - 13 edges
4. `MyApp()` - 12 edges
5. `StaffPage()` - 11 edges
6. `compilerOptions` - 10 edges
7. `auth()` - 9 edges
8. `CartPage()` - 9 edges
9. `vnd()` - 9 edges
10. `compilerOptions` - 9 edges

## Surprising Connections (you probably didn't know these)
- `OrderInput` --references--> `CartItem`  [EXTRACTED]
  src/services/api.ts → src/data/types.ts
- `checkoutCallback` --calls--> `verifyCallback()`  [EXTRACTED]
  functions/src/index.ts → functions/src/checkout.ts
- `MyApp()` --calls--> `CartPage()`  [EXTRACTED]
  src/app.tsx → src/pages/cart.tsx
- `CartPage()` --calls--> `useCart()`  [EXTRACTED]
  src/pages/cart.tsx → src/state/cart.tsx
- `CartPage()` --calls--> `vnd()`  [EXTRACTED]
  src/pages/cart.tsx → src/state/cart.tsx

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.20
Nodes (19): ProductCard(), categories, ice, products, shot, stores, sugar, CartItem (+11 more)

### Community 1 - "app.tsx"
Cohesion: 0.15
Nodes (22): react, zmp-ui, MyApp(), BottomNav(), tabs, StampCard(), HomePage(), PrivacyPage() (+14 more)

### Community 2 - "api.ts"
Cohesion: 0.23
Nodes (17): Voucher, addStamp(), API, checkMockQr(), defaultMember, getMember(), lookupMember(), LookupResult (+9 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (35): dependencies, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5, zmp-sdk@^2.54.0, zmp-ui@1.11.15-2 (+27 more)

### Community 5 - "index.ts"
Cohesion: 0.11
Nodes (37): buildCheckout(), enc(), hmac(), orderMacData(), PayMethod, sameMac(), verifyCallback(), handle() (+29 more)

### Community 6 - "functions/package.json"
Cohesion: 0.08
Nodes (22): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+14 more)

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

- **Why does `react` connect `app.tsx` to `state/cart.tsx`, `package.json`, `pages/cart.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07357357357357357 - nodes in this community are weakly interconnected._
- **Why does `firebase-admin` connect `functions/package.json` to `index.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10606060606060606 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `app.tsx` to `state/cart.tsx`, `package.json`, `pages/cart.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `functions/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07635467980295567 - nodes in this community are weakly interconnected._