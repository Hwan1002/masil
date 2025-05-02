import { create } from "zustand";

const useLoginStore = create((set) => ({
  userId: "",
  setUserId: (id) => set({ userId: id }),
}));

export default useLoginStore;
