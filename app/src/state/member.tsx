import React, { createContext, useContext, useEffect, useState } from "react";
import { getMember, Member, mockAddStamp } from "../services/api";
import { loadUser, ZaloUser } from "../services/zalo";

interface MemberCtx { user: ZaloUser | null; member: Member | null; addStampDemo: () => Promise<void> }
const Ctx = createContext<MemberCtx>(null!);

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ZaloUser | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  useEffect(() => {
    loadUser().then(setUser).catch(() => setUser({ id: "", name: "bạn", avatar: "" }));
    getMember().then(setMember);
  }, []);
  return (
    <Ctx.Provider value={{ user, member, addStampDemo: async () => setMember(await mockAddStamp()) }}>
      {children}
    </Ctx.Provider>
  );
}
export const useMember = () => useContext(Ctx);
