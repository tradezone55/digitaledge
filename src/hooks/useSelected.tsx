"use client";
import { ModalType, useModalStore } from "@/stores/modalStore";
import { ITableBody } from "@/types/newTable.types";
import { useCallback, useState } from "react";

export const useSelected = () => {
  const [selected, setSelected] = useState<ITableBody | null>(null);
  const onConfirm = useModalStore((state) => state.onConfirm);
  const onCancel = useModalStore((state) => state.onCancel);
  const modal = useModalStore((state) => state.modal);
  const handleView = useCallback(
    (row: ITableBody, modalType: ModalType) => {
      setSelected(row);
      onConfirm({
        type: modalType as ModalType,
        isOpen: true,
      });
    },
    [setSelected, onConfirm]
  );
  return {
    selected,
    modal,
    handleView,
    onCancel,
    onConfirm,
  };
};
