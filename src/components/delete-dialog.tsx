"use client";

import { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  task,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] mx-3 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Xác Nhận Xóa</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 pt-1">
            Bạn có chắc chắn muốn xóa công việc{" "}
            <strong className="text-gray-700">&quot;{task?.taskName}&quot;</strong>? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 sm:h-10 text-sm w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="h-9 sm:h-10 text-sm w-full sm:w-auto"
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
