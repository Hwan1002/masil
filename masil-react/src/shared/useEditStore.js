import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEditStore = create(
  persist(
    (set) => ({
      isEdit: false,
      setEdit: (value) => set({ isEdit: value }),
    }),
    {
      name: "edit-storage",
    }
  )
);

export default useEditStore;
