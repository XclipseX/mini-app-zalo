# Graph Report - app  (2026-11-23)

## Corpus Check
- 33 files · ~6,561 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .rules 1)

## Summary
- 197 nodes · 397 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a0c4f7e`
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
- seed.mjs
- compilerOptions
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 15 edges
2. `HttpError` - 13 edges
3. `zmp-ui` - 12 edges
4. `MyApp()` - 11 edges
5. `compilerOptions` - 10 edges
6. `compilerOptions` - 9 edges
7. `CartPage()` - 9 edges
8. `vnd()` - 9 edges
9. `auth()` - 8 edges
10. `useCart()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `OrderInput` --references--> `CartItem`  [EXTRACTED]
  src/services/api.ts → src/data/types.ts
- `MyApp()` --calls--> `MemberProvider()`  [EXTRACTED]
  src/app.tsx → src/state/member.tsx
- `addStamp` --calls--> `HttpError`  [EXTRACTED]
  functions/src/index.ts → functions/src/http.ts
- `createOrder` --calls--> `HttpError`  [EXTRACTED]
  functions/src/index.ts → functions/src/http.ts
- `redeemVoucher` --calls--> `HttpError`  [EXTRACTED]
  functions/src/index.ts → functions/src/http.ts

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.22
Nodes (14): categories, ice, products, shot, stores, sugar, CartItem, Category (+6 more)

### Community 1 - "app.tsx"
Cohesion: 0.17
Nodes (22): react, react-router-dom, zmp-ui, MyApp(), BottomNav(), tabs, ProductCard(), StampCard() (+14 more)

### Community 2 - "api.ts"
Cohesion: 0.19
Nodes (17): Voucher, addStamp(), API, defaultMember, getMember(), Member, mockAddStamp(), OrderInput (+9 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (34): dependencies, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5, zmp-sdk@^2.54.0, zmp-ui@1.11.15-2 (+26 more)

### Community 5 - "index.ts"
Cohesion: 0.15
Nodes (25): handle(), HttpError, str(), addStamp, auth(), createOrder, db, ddmm() (+17 more)

### Community 6 - "functions/package.json"
Cohesion: 0.14
Nodes (15): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+7 more)

### Community 7 - "seed.mjs"
Cohesion: 0.17
Nodes (6): admin, data, db, here, rc, require

### Community 8 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, outDir, rootDir, skipLibCheck, sourceMap, strict (+2 more)

### Community 10 - "Niên – Zalo Mini App (demo)"
Cohesion: 0.40
Nodes (4): Chạy thử trên máy (không cần Zalo, không cần Firebase), Cấu trúc, Niên – Zalo Mini App (demo), Việc còn lại

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `app.tsx` to `state/cart.tsx`, `api.ts`, `package.json`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0746031746031746 - nodes in this community are weakly interconnected._
- **Why does `firebase-admin` connect `functions/package.json` to `index.ts`, `seed.mjs`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14583333333333334 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `app.tsx` to `package.json`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `functions/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._