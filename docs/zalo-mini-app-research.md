# Nghiên cứu Zalo Mini App: công cụ, API, cách viết code

> Nguồn: đọc trực tiếp gói npm chính thức `zmp-sdk@2.54.0`, `zmp-ui@1.11.15-2`, `zmp-cli@4.0.7`, `zmp-vite-plugin@1.1.6` (định nghĩa hàm + chú thích tiếng Việt của Zalo).
> Trang mini.zalo.me/documents không truy cập được từ máy nghiên cứu, nên phần quy trình kiểm duyệt chỉ lấy từ chú thích trong SDK. Khi code, luôn mở docs gốc để đối chiếu.

## 1. Bộ công cụ

| Công cụ | Dùng để |
|---|---|
| **Zalo Mini App Extension** (VS Code / Antigravity) | Đăng nhập, tạo dự án, chạy, deploy bằng giao diện. Dễ nhất cho người mới |
| **zmp-cli** (`npm i -g zmp-cli`) | Như extension nhưng dòng lệnh |
| **zmp-sdk** | Gọi tính năng của Zalo: user, SĐT, vị trí, OA, thanh toán, storage… |
| **zmp-ui** | Bộ component giao diện giống Zalo |
| **zmp-vite-plugin** | Build bằng Vite |

Lệnh chính:
```sh
zmp login     # quét QR bằng Zalo
zmp init      # tạo dự án: chọn template "Mới" hoặc "Dựng sẵn" (có mẫu quán ăn / cà phê / bán lẻ)
zmp start     # chạy trên trình duyệt để xem giao diện
zmp deploy    # đẩy bản lên Zalo (Development / Testing), rồi gửi duyệt trên mini.zalo.me
```
Cần có trước: **Mini App ID** tạo ở mini.zalo.me/developers.

👉 Mẹo: `zmp init` → chọn template **cà phê / F&B dựng sẵn** → có ngay menu, giỏ hàng. Đỡ phải vibe code từ con số 0.

## 2. Component giao diện (zmp-ui)

`App, ZMPRouter, Page, Header, BottomNavigation, Box, Grid, Stack, Text, Button, Icon, Avatar, Input, Select, Picker, DatePicker, Calendar, Checkbox, Radio, Switch, Slider, List, Modal, Sheet, Swiper, Tabs, ImageViewer, Spinner, Progress, SnackbarProvider` + hooks `useNavigate, useSnackbar, useTheme`.

## 3. API của zmp-sdk (theo nhóm)

**Người dùng & quyền**
- `getUserInfo` (tên, avatar), `getUserID`, `getSetting` (đang có quyền gì), `authorize({ scopes })` (xin quyền), `openPermissionSetting`
- `getPhoneNumber`, `getLocation` → **chỉ trả về `token`, không trả số/toạ độ** (xem mục 4)
- `getAccessToken`, `login`, `getAuthCode`, `getIDToken`

**Zalo OA (Official Account)**
- `followOA`, `unfollowOA`, `showOAWidget`, `interactOA`, `checkIsAllowedInteractWithOA`, `openChat`, `viewOAQr`, `requestSendNotification`

**Thanh toán (Checkout SDK)**
- `Payment.createOrder({ desc, item, amount, extradata, method, mac })`, `Payment.purchase`, `checkTransaction`, `selectPaymentMethod`, `openCheckoutPopup`
- `mac` = chữ ký **tạo ở server** bằng private key → không bao giờ để key trong code app

**Chia sẻ & lan truyền**
- `openShareSheet`, `getShareableLink`, `openPostFeed`, `createShortcut`, `favoriteApp`, `addVoucher`, `addRating`

**Thiết bị & tiện ích**
- `scanQRCode`, `chooseImage`, `openMediaPicker`, `saveImageToGallery`, `openPhone`, `openSMS`, `vibrate`, `showToast`, `getSystemInfo`, `getNetworkType`, NFC, Beacon

**Lưu trữ**
- `setStorage`, `getStorage`, `removeStorage`, `clearStorage` (giỏ hàng, cài đặt nhỏ trên máy)

**Điều hướng & giao diện**
- `setNavigationBarTitle`, `setNavigationBarColor`, `configAppView`, `getRouteParams`, `openMiniApp`, `openWebview`, `closeApp`, `onConfirmToExit`

## 4. Quy tắc quan trọng (lỗi hay gặp khi vibe code)

1. **SĐT/vị trí phải qua server.** Luồng:
   ```
   App: const { token } = await getPhoneNumber()
   App → gửi token + accessToken lên server của bạn
   Server: gọi Open API Zalo kèm App Secret → nhận SĐT thật
   ```
   AI hay viết sai là "lấy luôn số điện thoại" — không có chuyện đó.
2. **Phải xin cấp quyền API** cho Mini App ID trong trang Quản lý ứng dụng. Không xin thì: **admin/dev test vẫn chạy, người dùng thật bị lỗi** — rất dễ bị lừa lúc test.
3. **Kiểm duyệt từ chối** nếu xin quyền không rõ mục đích. Chỉ xin SĐT khi bấm "Đặt hàng"; nếu bắt buộc thì phải có màn hình giải thích lý do.
4. Nên gọi `getSetting` trước, thiếu quyền mới `authorize`. Bắt lỗi `-201` = người dùng từ chối.
5. Nhiều API `@zaloOnly`: chỉ chạy trong app Zalo trên điện thoại, chạy `zmp start` trên trình duyệt sẽ lỗi/giả lập → phải test trên máy thật.

## 5. Khung code mẫu

```tsx
// src/app.tsx
import { App, ZMPRouter, AnimationRoutes, Route, SnackbarProvider } from "zmp-ui";
import Menu from "./pages/menu";
import Cart from "./pages/cart";

export default function MyApp() {
  return (
    <App>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
}
```

```tsx
// Xin SĐT đúng lúc đặt hàng
import { getSetting, authorize, getPhoneNumber, getAccessToken } from "zmp-sdk/apis";

async function checkout(cart) {
  const { authSetting } = await getSetting();
  if (!authSetting["scope.userPhonenumber"]) {
    try {
      await authorize({ scopes: ["scope.userPhonenumber"] });
    } catch (e: any) {
      if (e.code === -201) return alert("Cần SĐT để quán gọi xác nhận đơn");
      throw e;
    }
  }
  const { token } = await getPhoneNumber();
  const accessToken = await getAccessToken();
  await fetch("https://your-server/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, phoneToken: token, accessToken }),
  }); // server tự đổi token → SĐT bằng App Secret
}
```

## 6. Áp vào dự án quán cà phê (giai đoạn 1)

| Tính năng | Dùng |
|---|---|
| Menu, giỏ hàng | zmp-ui + `setStorage` |
| Chi nhánh gần nhất | `getLocation` (token → server) hoặc cho chọn tay cho đơn giản |
| Đặt món | `getPhoneNumber` → server (Firebase Functions / Supabase Edge) |
| Báo đơn cho quán / khách | `followOA` + `requestSendNotification`, tin nhắn OA/ZNS gửi từ server |
| Tích tem | lưu ở database server, không lưu ở `setStorage` (khách sửa được) |
| Chia sẻ | `openShareSheet` |
| Thanh toán | giai đoạn sau: Checkout SDK, `mac` ký ở server |
