# Graph Report - app  (2026-11-23)

## Corpus Check
- 48 files · ~15,777 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 2, .example 1)

## Summary
- 302 nodes · 672 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d14a6810`
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
- compilerOptions
- pages/cart.tsx
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 27 edges
2. `HttpError` - 16 edges
3. `StaffOrdersPage()` - 14 edges
4. `zmp-ui` - 14 edges
5. `vnd()` - 13 edges
6. `MyApp()` - 13 edges
7. `CartPage()` - 13 edges
8. `StaffPage()` - 12 edges
9. `getToken()` - 11 edges
10. `useToast()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `MyApp()` --calls--> `RewardsPage()`  [EXTRACTED]
  src/app.tsx → src/pages/rewards.tsx
- `RewardsPage()` --calls--> `LucianStampCard()`  [EXTRACTED]
  src/pages/rewards.tsx → src/lucian/stamp-card.tsx
- `RewardsPage()` --indirect_call--> `isStaff()`  [INFERRED]
  src/pages/rewards.tsx → src/services/api.ts
- `MyApp()` --calls--> `StaffOrdersPage()`  [EXTRACTED]
  src/app.tsx → src/pages/staff-orders.tsx
- `StaffOrdersPage()` --calls--> `LucianPillTabs()`  [EXTRACTED]
  src/pages/staff-orders.tsx → src/lucian/pill-tabs.tsx

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.09
Nodes (39): react, zmp-ui, MyApp(), BottomNav(), TABS, ProductCard(), StampCard(), categories (+31 more)

### Community 1 - "api.ts"
Cohesion: 0.09
Nodes (51): Voucher, LucianMemberCard(), Props, LucianSkeleton(), LucianStampCard(), Props, useToast(), RewardsPage() (+43 more)

### Community 2 - "createHost"
Cohesion: 0.32
Nodes (11): createHost(), bar(), dismiss(), layout(), setOpen(), show(), swipe(), timer() (+3 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (39): dependencies, @fontsource/baloo-2@^5.2.5, @fontsource/be-vietnam-pro@^5.2.5, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5 (+31 more)

### Community 5 - "index.ts"
Cohesion: 0.09
Nodes (45): buildCheckout(), enc(), hmac(), orderMacData(), PayMethod, sameMac(), verifyCallback(), handle() (+37 more)

### Community 6 - "functions/package.json"
Cohesion: 0.07
Nodes (25): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+17 more)

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

- **Why does `react` connect `state/cart.tsx` to `api.ts`, `createHost`, `package.json`, `pages/cart.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `state/cart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08649912331969609 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `state/cart.tsx` to `pages/cart.tsx`, `package.json`, `api.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08524590163934426 - nodes in this community are weakly interconnected._
- **Why does `firebase-admin` connect `functions/package.json` to `index.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06707317073170732 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08708272859216255 - nodes in this community are weakly interconnected._