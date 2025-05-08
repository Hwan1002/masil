import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoginStore = create(
  persist(
    (set) => ({
      userId: "",
      setUserId: (id) => set({ userId: id }),
      idx: Number,
      setIdx: (idx) => set({ idx: idx }),
    }),
    {
      name: "login-storage",
      getStorage: () => localStorage, // 필요 시 sessionStorage로 변경 가능
    }
  )
);
export default useLoginStore;
