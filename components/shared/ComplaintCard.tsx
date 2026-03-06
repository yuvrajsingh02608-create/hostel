"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, MapPin, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    category: string;
    status: any;
    createdAt: Date;
    roomNumber: string;
    agent?: {
      name: string;
      image?: string;
    };
  };
  onClick?: () => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onClick }) => {
  const t = useTranslations('complaint');

  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border rounded-card p-5 hover:border-primary transition-all group cursor-pointer shadow-sm hover:shadow-md"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-text-muted">#{complaint.id.slice(-6).toUpperCase()}</span>
          <ComplaintStatusBadge status={complaint.status} />
          <span className="px-2 py-0.5 rounded-badge bg-surface text-text-muted text-[10px] font-bold uppercase tracking-tight">
            {t(`categories.${complaint.category}`)}
          </span>
        </div>
        
        <h4 className="text-base font-bold text-text-primary mb-3 group-hover:text-primary transition-colors truncate">
          {complaint.title}
        </h4>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>Room {complaint.roomNumber}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}</span>
          </div>
          {complaint.agent && (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={complaint.agent.image || ''} />
                <AvatarFallback className="text-[10px] bg-primary text-white">
                  {complaint.agent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{complaint.agent.name}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="ml-4 self-center opacity-0 group-hover:opacity-100 transition-opacity text-primary">
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  );
};

export default ComplaintCard;
