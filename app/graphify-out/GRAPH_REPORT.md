# Graph Report - app  (2026-11-23)

## Corpus Check
- 37 files · ~10,694 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .rules 1)

## Summary
- 259 nodes · 571 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2d58725`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- state/cart.tsx
- api.ts
- app.tsx
- compilerOptions
- package.json
- index.ts
- functions/package.json
- checkout.ts
- compilerOptions
- pages/cart.tsx
- Niên – Zalo Mini App (demo)

## God Nodes (most connected - your core abstractions)
1. `react` - 17 edges
2. `HttpError` - 16 edges
3. `zmp-ui` - 14 edges
4. `MyApp()` - 13 edges
5. `StaffOrdersPage()` - 11 edges
6. `StaffPage()` - 11 edges
7. `getToken()` - 11 edges
8. `vnd()` - 11 edges
9. `CartPage()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `createOrder` --calls--> `buildCheckout()`  [EXTRACTED]
  functions/src/index.ts → functions/src/checkout.ts
- `checkoutCallback` --calls--> `verifyCallback()`  [EXTRACTED]
  functions/src/index.ts → functions/src/checkout.ts
- `MyApp()` --calls--> `CartPage()`  [EXTRACTED]
  src/app.tsx → src/pages/cart.tsx
- `MyApp()` --calls--> `MenuPage()`  [EXTRACTED]
  src/app.tsx → src/pages/menu.tsx
- `MyApp()` --calls--> `ProductPage()`  [EXTRACTED]
  src/app.tsx → src/pages/product.tsx

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "state/cart.tsx"
Cohesion: 0.19
Nodes (20): ProductCard(), categories, ice, products, shot, stores, sugar, CartItem (+12 more)

### Community 1 - "api.ts"
Cohesion: 0.11
Nodes (42): Voucher, ACTION, FILTERS, LABEL, maskPhone(), StaffOrdersPage(), change(), load() (+34 more)

### Community 2 - "app.tsx"
Cohesion: 0.24
Nodes (12): react, zmp-ui, MyApp(), BottomNav(), tabs, StampCard(), HomePage(), PrivacyPage() (+4 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, lib, module, moduleResolution, noEmit, skipLibCheck, strict (+3 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (39): dependencies, @fontsource/baloo-2@^5.2.5, @fontsource/be-vietnam-pro@^5.2.5, qrcode@^1.5.4, react@^18.3.1, react-dom@^18.3.1, react-router-dom@^7.18.6, @types/qrcode@^1.5.5 (+31 more)

### Community 5 - "index.ts"
Cohesion: 0.09
Nodes (41): handle(), HttpError, str(), addStamp, auth(), CHECKOUT_PRIVATE_KEY, createOrder, db (+33 more)

### Community 6 - "functions/package.json"
Cohesion: 0.08
Nodes (21): dependencies, firebase-admin@^12.7.0, firebase-functions@^6.1.0, devDependencies, typescript@^5.6.3, engines, node, typescript (+13 more)

### Community 7 - "checkout.ts"
Cohesion: 0.39
Nodes (8): buildCheckout(), enc(), hmac(), orderMacData(), PayMethod, sameMac(), verifyCallback(), checkoutCallback

### Community 8 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, outDir, rootDir, skipLibCheck, sourceMap, strict (+2 more)

### Community 9 - "pages/cart.tsx"
Cohesion: 0.50
Nodes (7): CartPage(), checkout(), createOrder(), PayMethod, payCheckout(), requestPhoneToken(), itemPrice()

### Community 10 - "Niên – Zalo Mini App (demo)"
Cohesion: 0.40
Nodes (4): Chạy thử trên máy (không cần Zalo, không cần Firebase), Cấu trúc, Niên – Zalo Mini App (demo), Việc còn lại

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `app.tsx` to `state/cart.tsx`, `pages/cart.tsx`, `package.json`, `api.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10549645390070922 - nodes in this community are weakly interconnected._
- **Why does `zmp-ui` connect `app.tsx` to `state/cart.tsx`, `pages/cart.tsx`, `package.json`, `api.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06707317073170732 - nodes in this community are weakly interconnected._
- **Why does `firebase-admin` connect `functions/package.json` to `index.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09061224489795919 - nodes in this community are weakly interconnected._
- **Should `functions/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07671957671957672 - nodes in this community are weakly interconnected._