"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/lib/types";
import { TaskTable } from "@/components/task-table";
import { TaskDialog } from "@/components/task-dialog";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const CATEGORY_ORDER: Record<string, number> = {
  "THÊU": 0,
  "HOÀN THIỆN": 1,
  "NGOÀI GIỜ": 2,
};

function sortTasksByCategory(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => (CATEGORY_ORDER[a.category] ?? 99) - (CATEGORY_ORDER[b.category] ?? 99)
  );
}

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    years.push(y);
  }
  return years;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonthNum, setSelectedMonthNum] = useState(now.getMonth() + 1);
  const selectedMonth = `${selectedYear}-${String(selectedMonthNum).padStart(2, "0")}`;
  const [totalShifts, setTotalShifts] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [exporting, setExporting] = useState(false);

  const yearOptions = getYearOptions();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, metaRes] = await Promise.all([
        fetch(`/api/tasks?month=${selectedMonth}`),
        fetch(`/api/month-meta?month=${selectedMonth}`),
      ]);
      const data = await tasksRes.json();
      const meta = await metaRes.json();
      setTasks(Array.isArray(data) ? sortTasksByCategory(data) : []);
      setTotalShifts(meta.totalShifts ?? "");
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
      setTotalShifts("");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleTotalShiftsChange = async (value: string) => {
    setTotalShifts(value);
    try {
      await fetch("/api/month-meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: selectedMonth, totalShifts: value }),
      });
    } catch (error) {
      console.error("Failed to save total shifts:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (task: Task) => {
    setDeletingTask(task);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (
    data: Omit<Task, "id" | "createdAt" | "updatedAt" | "month">
  ) => {
    if (editingTask) {
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, month: selectedMonth }),
      });
    }
    setDialogOpen(false);
    fetchTasks();
  };

  const handleConfirmDelete = async () => {
    if (deletingTask) {
      await fetch(`/api/tasks/${deletingTask.id}`, { method: "DELETE" });
      setDeleteDialogOpen(false);
      setDeletingTask(null);
      fetchTasks();
    }
  };

  const handleExportImage = async () => {
    const element = document.getElementById("kpi-report-table");
    if (!element) return;

    try {
      setExporting(true);
      // Wait for DOM to re-render with full-width table and hidden actions
      await new Promise((r) => setTimeout(r, 300));
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });
      const link = document.createElement("a");
      link.download = `kpi-report-${selectedMonth}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setExporting(false);
    }
  };

  const completedCount = tasks.filter(
    (t) => t.status === "Hoàn Thành"
  ).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
              <span className="text-white text-base sm:text-lg font-bold">K</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Báo Cáo KPI</h1>
              <p className="text-[11px] sm:text-xs text-gray-400">Quản lý & theo dõi công việc hàng tháng</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportImage}
              className="flex-1 sm:flex-none h-9 text-xs sm:text-sm border-gray-200 hover:bg-gray-50"
            >
              📷 Xuất Ảnh
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1 sm:flex-none h-9 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              + Thêm Công Việc
            </Button>
          </div>
        </div>

        {/* Month Picker + Stats */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm hidden sm:inline">📅</span>
              <div className="grid grid-cols-2 gap-2 flex-1 sm:flex sm:gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Năm</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full sm:w-24 px-2.5 py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-gray-50/80 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition cursor-pointer"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Tháng</label>
                  <select
                    value={selectedMonthNum}
                    onChange={(e) => setSelectedMonthNum(Number(e.target.value))}
                    className="w-full sm:w-32 px-2.5 py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-gray-50/80 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition cursor-pointer"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i + 1} value={i + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Tổng số ca</label>
                  <input
                    type="text"
                    value={totalShifts}
                    onChange={(e) => handleTotalShiftsChange(e.target.value)}
                    placeholder="Nhập số ca..."
                    className="w-full sm:w-32 px-2.5 py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-gray-50/80 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Inline Stats */}
            <div className="flex items-center gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Tổng:</span>
                <span className="text-sm font-bold text-gray-800">{totalCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Xong:</span>
                <span className="text-sm font-bold text-green-600">{completedCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Tiến độ:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 sm:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="animate-spin w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Đang tải...</p>
          </div>
        ) : (
          <TaskTable
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            hideActions={exporting}
            exporting={exporting}
          />
        )}

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={editingTask}
          onSave={handleSave}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          task={deletingTask}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
