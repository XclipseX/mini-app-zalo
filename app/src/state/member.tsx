import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMember, Member, mockAddStamp } from "../services/api";
import { getToken, loadUser, ZaloUser } from "../services/zalo";

interface MemberCtx {
  user: ZaloUser | null;
  member: Member | null;
  /** Gọi lại getMember: cập nhật tem/voucher và cấp QR mới (QR server hạn 5 phút). */
  refresh: () => Promise<void>;
  addStampDemo: () => Promise<void>;
}
const Ctx = createContext<MemberCtx>(null!);

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ZaloUser | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const refresh = useCallback(async () => {
    try { setMember(await getMember(await getToken())); } catch { /* giữ dữ liệu cũ */ }
  }, []);
  useEffect(() => {
    loadUser().then(setUser).catch(() => setUser({ id: "", name: "bạn", avatar: "" }));
    refresh();
  }, [refresh]);
  return (
    <Ctx.Provider value={{ user, member, refresh, addStampDemo: async () => { await mockAddStamp(); await refresh(); } }}>
      {children}
    </Ctx.Provider>
  );
}
export const useMember = () => useContext(Ctx);
