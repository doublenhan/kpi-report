export interface Task {
  id: number;
  month: string;
  category: string;
  taskName: string;
  progressTime: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = ["THÊU", "HOÀN THIỆN", "NGOÀI GIỜ"] as const;
export const STATUSES = ["Chưa Hoàn Thành", "Hoàn Thành"] as const;

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
  ];
  return `${monthNames[parseInt(m, 10) - 1]} ${year}`;
}
