"use client";

import { useState, useEffect } from "react";
import { Task, CATEGORIES, STATUSES } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "month">) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [category, setCategory] = useState("");
  const [taskName, setTaskName] = useState("");
  const [progressTime, setProgressTime] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (task) {
      setCategory(task.category);
      setTaskName(task.taskName);
      setProgressTime(task.progressTime);
      setStatus(task.status);
      setNotes(task.notes);
    } else {
      setCategory("");
      setTaskName("");
      setProgressTime("");
      setStatus("Chưa Hoàn Thành");
      setNotes("");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !taskName || !progressTime || !status) return;
    onSave({ category, taskName, progressTime, status, notes });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto mx-3 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {task ? "Sửa Công Việc" : "Thêm Công Việc Mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs sm:text-sm text-gray-600">Phân Loại</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className="h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Chọn phân loại..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taskName" className="text-xs sm:text-sm text-gray-600">Tên Công Việc</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Nhập tên công việc..."
              className="h-9 sm:h-10 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="progressTime" className="text-xs sm:text-sm text-gray-600">Thời Gian Tiến Độ</Label>
            <Input
              id="progressTime"
              value={progressTime}
              onChange={(e) => setProgressTime(e.target.value)}
              placeholder="VD: 5b3h"
              className="h-9 sm:h-10 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs sm:text-sm text-gray-600">Trạng Thái</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger className="h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Chọn trạng thái..." />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs sm:text-sm text-gray-600">Ghi Chú</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú..."
              className="text-sm"
              rows={2}
            />
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 sm:h-10 text-sm w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button type="submit" className="h-9 sm:h-10 text-sm bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              {task ? "Cập Nhật" : "Tạo Mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
