"use client";

import { useFlightDialog } from "@/contexts/FlightDialogContext";
import { AddFlightDialog } from "@/components/AddFlightDialog";
import { useRouter } from "next/navigation";

export function FlightDialogWrapper() {
  const { open, editingFlight, closeDialog, triggerFlightSuccess } = useFlightDialog();
  const router = useRouter();

  const handleSuccess = () => {
    closeDialog();
    triggerFlightSuccess();
    router.refresh();
  };

  return (
    <AddFlightDialog
      open={open}
      onOpenChange={closeDialog}
      onSuccess={handleSuccess}
      flight={editingFlight}
    />
  );
}

