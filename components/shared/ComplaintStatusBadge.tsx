"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'URGENT';

interface ComplaintStatusBadgeProps {
  status: Status;
}

const statusStyles = {
  OPEN: "bg-primary/10 text-primary border-primary/20",
  IN_PROGRESS: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  CLOSED: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  URGENT: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse-subtle",
};

const ComplaintStatusBadge: React.FC<ComplaintStatusBadgeProps> = ({ status }) => {
  const t = useTranslations('complaint.statuses');
  
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-badge text-xs font-semibold border inline-flex items-center gap-1.5",
      statusStyles[status]
    )}>
      {status === 'URGENT' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
      {t(status)}
    </span>
  );
};

export default ComplaintStatusBadge;
