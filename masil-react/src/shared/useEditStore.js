import { create } from "zustand";

const useEditStore = create((set) => ({
  isEdit: false,
  setEdit: (value) => set({ isEdit: value }),
}));

export default useEditStore;
