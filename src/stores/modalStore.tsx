"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const initialState: ModalStoreState = {
  isOpen: false,
  type: "default",
};

export const useModalStore = create<ModalStore>()(
  immer((set) => ({
    modal: initialState,
    onConfirm: (modal: ModalStoreState) => {
      set((state) => {
        state.modal = modal; // Update modal directly
      });
    },
    onCancel: () => {
      set((state) => {
        state.modal = initialState; // Reset modal to the initial state
      });
    },
  }))
);

interface ModalStore {
  modal: ModalStoreState;
  onConfirm: (modal: ModalStoreState) => void;
  onCancel: () => void;
}

export interface ModalStoreState {
  isOpen: boolean;
  type: ModalType;
}
export type ModalType =
  | "create"
  | "read"
  | "update"
  | "delete" | "default"

