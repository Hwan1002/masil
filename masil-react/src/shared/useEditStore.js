import { create } from "zustand";

const useEditStore = create((set) => ({
  isEdit: false,
  setEdit: (value) => set({ isEdit: value }),
  userId: String,
  setUserId: (id) => set({ userId: id }),
}));

export default useEditStore;
