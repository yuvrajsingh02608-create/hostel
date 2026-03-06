"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MapPin, Calendar, User, FileText, ImageIcon } from "lucide-react";
import ComplaintStatusBadge from "./ComplaintStatusBadge";
import Timeline from "./Timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ComplaintDetailViewProps {
  complaint: any;
}

const ComplaintDetailView: React.FC<ComplaintDetailViewProps> = ({ complaint }) => {
  const t = useTranslations('complaint');

  if (!complaint) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-wrap items-center gap-3">
        <ComplaintStatusBadge status={complaint.status} />
        <Badge variant="outline" className="uppercase tracking-wider">
          {t(`categories.${complaint.category}`)}
        </Badge>
        {complaint.priority === 'URGENT' && (
          <Badge variant="danger" className="animate-pulse">URGENT</Badge>
        )}
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t('description')}
        </h3>
        <p className="text-text-primary leading-relaxed bg-surface p-4 rounded-card border border-border">
          {complaint.description}
        </p>
      </div>

      {/* Resolution Note (Visible when resolved) */}
      {complaint.status === 'RESOLVED' && complaint.resolutionNote && (
        <div className="bg-success/5 border border-success/20 rounded-card p-6 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-sm font-bold text-success uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Resolution Summary
          </h3>
          <p className="text-text-primary italic leading-relaxed">
            &quot;{complaint.resolutionNote}&quot;
          </p>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">{t('submitted')}</h3>
          <div className="flex items-center gap-2 text-sm text-text-primary">
            <Calendar className="h-4 w-4 text-primary" />
            {new Date(complaint.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Room Number</h3>
          <div className="flex items-center gap-2 text-sm text-text-primary">
            <MapPin className="h-4 w-4 text-primary" />
            {complaint.roomNumber}
          </div>
        </div>
      </div>

      {/* Agent Info */}
      {complaint.agent && (
        <div className="bg-primary/5 rounded-card p-4 border border-primary/10">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('agent_assigned')}
          </h3>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={complaint.agent.image || ''} />
              <AvatarFallback className="bg-primary text-white">
                {complaint.agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold text-text-primary">{complaint.agent.name}</p>
              <p className="text-xs text-text-muted">{complaint.agent.department || 'Maintenance'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Attachments */}
      {complaint.attachments && complaint.attachments.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {t('attachments')}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {complaint.attachments.map((url: string, i: number) => (
              <div key={i} className="aspect-square bg-surface rounded-md border border-border overflow-hidden group relative cursor-pointer">
                <img src={url} alt="Attachment" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-border pb-2">
          {t('timeline')}
        </h3>
        <Timeline events={complaint.timeline || []} />
      </div>
    </div>
  );
};

export default ComplaintDetailView;
