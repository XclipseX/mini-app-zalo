# Graph Report - app  (2026-11-23)

## Corpus Check
- 37 files · ~10,508 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .rules 1)

## Summary
- 254 nodes · 553 edges · 8 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b11ce494`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- state/cart.tsx
- api.ts
- compilerOptions
- package.json
- index.ts
- functions/package.json
- compilerOptions
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 17 edges
2. `HttpError` - 16 edges
3. `zmp-ui` - 14 edges
4. `MyApp()` - 13 edges
5. `vnd()` - 11 edges
6. `StaffPage()` - 11 edges
7. `getToken()` - 11 edges
8. `StaffOrdersPage()` - 10 edges
9. `compilerOptions` - 10 edges
10. `auth()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `checkoutCallback` --calls--> `verifyCallback()`  [EXTRACTED]
  functions/src/index.ts → functions/src/checkout.ts
- `updateOrderStatus` --calls--> `sendZbsTemplate()`  [EXTRACTED]
  functions/src/index.ts → functions/src/zbs.ts
- `MyApp()` --calls--> `StaffOrdersPage()`  [EXTRACTED]
  src/app.tsx → src/pages/staff-orders.tsx
- `StaffOrdersPage()` --calls--> `vnd()`  [EXTRACTED]
  src/pages/staff-orders.tsx → src/state/cart.tsx
- `MemberProvider()` --calls--> `getMember()`  [EXTRACTED]
  src/state/member.tsx → src/services/api.ts

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.10
Nodes (37): react, zmp-ui, MyApp(), BottomNav(), tabs, ProductCard(), StampCard(), categories (+29 more)

### Community 1 - "api.ts"
Cohesion: 0.10
Nodes (43): Voucher, RewardsPage(), ACTION, FILTERS, LABEL, StaffOrdersPage(), change(), load() (+35 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (35): dependencies, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5, zmp-sdk@^2.54.0, zmp-ui@1.11.15-2 (+27 more)

### Community 5 - "index.ts"
Cohesion: 0.09
Nodes (45): buildCheckout(), enc(), hmac(), orderMacData(), PayMethod, sameMac(), verifyCallback(), handle() (+37 more)

### Community 6 - "functions/package.json"
Cohesion: 0.07
Nodes (25): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+17 more)

### Community 8 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, outDir, rootDir, skipLibCheck, sourceMap, strict (+2 more)

### Community 10 - "Niên – Zalo Mini App (demo)"
Cohesion: 0.40
Nodes (4): Chạy thử trên máy (không cần Zalo, không cần Firebase), Cấu trúc, Niên – Zalo Mini App (demo), Việc còn lại

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `state/cart.tsx` to `api.ts`, `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `state/cart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10407239819004525 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `state/cart.tsx` to `api.ts`, `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1036734693877551 - nodes in this community are weakly interconnected._
- **Why does `firebase-admin` connect `functions/package.json` to `index.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07357357357357357 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08708272859216255 - nodes in this community are weakly interconnected._