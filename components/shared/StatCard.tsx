"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  variant?: 'primary' | 'amber' | 'success' | 'danger' | 'purple';
}

const variantStyles = {
  primary: "border-primary text-primary",
  amber: "border-accent text-accent",
  success: "border-success text-success",
  danger: "border-danger text-danger",
  purple: "border-purple-500 text-purple-500",
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  delta, 
  icon: Icon, 
  variant = 'primary' 
}) => {
  return (
    <div className={cn(
      "bg-card p-6 rounded-card shadow-card border-l-4 transition-all hover:translate-y-[-2px] hover:shadow-lg",
      variantStyles[variant]
    )}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-text-muted text-sm font-medium uppercase tracking-wider">{title}</p>
        <div className={cn(
          "p-2 rounded-lg bg-opacity-10",
          variant === 'primary' ? "bg-primary" : 
          variant === 'amber' ? "bg-accent" : 
          variant === 'success' ? "bg-success" : 
          variant === 'danger' ? "bg-danger" : "bg-purple-500"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-display font-bold text-text-primary">{value}</h3>
        {delta && (
          <div className={cn(
            "flex items-center text-xs font-semibold mb-1 px-1.5 py-0.5 rounded-full bg-opacity-10",
            delta.isPositive ? "text-success bg-success" : "text-danger bg-danger"
          )}>
            {delta.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {delta.value}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
