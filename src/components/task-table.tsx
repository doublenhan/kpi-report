"use client";

import { Task } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  hideActions?: boolean;
  exporting?: boolean;
}

const categoryStyle: Record<string, string> = {
  "THÊU": "bg-blue-50 text-blue-700 border-blue-200",
  "HOÀN THIỆN": "bg-violet-50 text-violet-700 border-violet-200",
  "NGOÀI GIỜ": "bg-amber-50 text-amber-700 border-amber-200",
};

const statusStyle: Record<string, string> = {
  "Hoàn Thành": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Chưa Hoàn Thành": "bg-red-50 text-red-600 border-red-200",
};

export function TaskTable({ tasks, onEdit, onDelete, hideActions, exporting }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div id="kpi-report-table" className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 sm:p-16 text-center">
        <div className="text-3xl sm:text-4xl mb-3 opacity-30">📋</div>
        <p className="text-gray-400 text-sm">Chưa có công việc nào.</p>
        <p className="text-gray-300 text-xs mt-1">Nhấn &quot;+ Thêm Công Việc&quot; để bắt đầu.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div id="kpi-report-table" className={`${exporting ? 'block' : 'hidden sm:block'} bg-white rounded-xl border border-gray-200 shadow-sm ${exporting ? 'overflow-visible' : 'overflow-hidden'}`} style={exporting ? { minWidth: '800px', width: 'max-content' } : undefined}>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-200">
              <TableHead className="w-12 text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phân Loại</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Công Việc</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiến Độ</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng Thái</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ghi Chú</TableHead>
              {!hideActions && (
                <TableHead className="w-12 text-xs font-semibold text-gray-500 uppercase tracking-wider"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={task.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                <TableCell className="text-sm text-gray-400 font-medium">{index + 1}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs font-medium ${categoryStyle[task.category] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {task.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-800">{task.taskName}</TableCell>
                <TableCell className="text-sm text-gray-500">{task.progressTime}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs font-medium ${statusStyle[task.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-400 max-w-[200px] truncate">{task.notes}</TableCell>
                {!hideActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm h-8 w-8 hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        ⋯
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>✏️ Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-600">🗑️ Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className={`${exporting ? 'hidden' : 'sm:hidden'} space-y-2.5`}>
        {tasks.map((task, index) => (
          <div key={task.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5">
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-300 font-medium shrink-0">#{index + 1}</span>
                <Badge variant="outline" className={`text-[10px] font-medium shrink-0 ${categoryStyle[task.category] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {task.category}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="outline" className={`text-[10px] font-medium ${statusStyle[task.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {task.status === "Hoàn Thành" ? "✅ Xong" : "⏳ Chưa xong"}
                </Badge>
                {!hideActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-7 w-7 hover:bg-gray-100 text-gray-400 cursor-pointer text-sm">
                      ⋯
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(task)}>✏️ Sửa</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-600">🗑️ Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1.5">{task.taskName}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>⏱ {task.progressTime}</span>
              {task.notes && <span className="truncate">📝 {task.notes}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
