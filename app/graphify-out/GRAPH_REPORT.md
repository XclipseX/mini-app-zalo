# Graph Report - app  (2026-11-23)

## Corpus Check
- 34 files · ~7,641 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .rules 1)

## Summary
- 209 nodes · 444 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `295b4ec5`
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
- compilerOptions
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 16 edges
2. `HttpError` - 14 edges
3. `zmp-ui` - 13 edges
4. `MyApp()` - 12 edges
5. `StaffPage()` - 11 edges
6. `compilerOptions` - 10 edges
7. `vnd()` - 9 edges
8. `compilerOptions` - 9 edges
9. `auth()` - 8 edges
10. `CartPage()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `MyApp()` --calls--> `BottomNav()`  [EXTRACTED]
  src/app.tsx → src/components/bottom-nav.tsx
- `MyApp()` --calls--> `PrivacyPage()`  [EXTRACTED]
  src/app.tsx → src/pages/privacy.tsx
- `MyApp()` --calls--> `StaffPage()`  [EXTRACTED]
  src/app.tsx → src/pages/staff.tsx
- `MyApp()` --calls--> `MemberProvider()`  [EXTRACTED]
  src/app.tsx → src/state/member.tsx
- `StaffPage()` --calls--> `useMember()`  [EXTRACTED]
  src/pages/staff.tsx → src/state/member.tsx

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.24
Nodes (13): ice, shot, stores, sugar, CartItem, Category, Option, OptionGroup (+5 more)

### Community 1 - "app.tsx"
Cohesion: 0.15
Nodes (24): react, react-router-dom, zmp-ui, MyApp(), BottomNav(), tabs, ProductCard(), StampCard() (+16 more)

### Community 2 - "api.ts"
Cohesion: 0.19
Nodes (24): Voucher, StaffPage(), addStamp(), API, checkMockQr(), defaultMember, getMember(), lookupMember() (+16 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (34): dependencies, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5, zmp-sdk@^2.54.0, zmp-ui@1.11.15-2 (+26 more)

### Community 5 - "index.ts"
Cohesion: 0.14
Nodes (27): handle(), HttpError, str(), addStamp, auth(), createOrder, db, ddmm() (+19 more)

### Community 6 - "functions/package.json"
Cohesion: 0.08
Nodes (21): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+13 more)

### Community 8 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, outDir, rootDir, skipLibCheck, sourceMap, strict (+2 more)

### Community 10 - "Niên – Zalo Mini App (demo)"
Cohesion: 0.40
Nodes (4): Chạy thử trên máy (không cần Zalo, không cần Firebase), Cấu trúc, Niên – Zalo Mini App (demo), Việc còn lại

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `app.tsx` to `state/cart.tsx`, `api.ts`, `package.json`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `app.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14714714714714713 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `app.tsx` to `api.ts`, `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0746031746031746 - nodes in this community are weakly interconnected._
- **Why does `firebase-admin` connect `functions/package.json` to `index.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1411764705882353 - nodes in this community are weakly interconnected._
- **Should `functions/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07671957671957672 - nodes in this community are weakly interconnected._