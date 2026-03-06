"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  action: string;
  note?: string | null;
  actorName: string;
  actorRole: string;
  createdAt: Date;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const isFirst = index === 0;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {!isLast && (
              <div className="absolute left-2.5 top-6 bottom-[-24px] w-0.5 bg-border" />
            )}

            {/* Event Dot */}
            <div className={cn(
              "z-10 w-5 h-5 rounded-full border-2 border-card flex items-center justify-center shrink-0 mt-1",
              event.action.toUpperCase().includes('SUBMITTED') ? "bg-primary" :
              event.action.toUpperCase().includes('ASSIGNED') ? "bg-amber-500" :
              event.action.toUpperCase().includes('RESOLVED') ? "bg-success" : "bg-text-muted"
            )} />

            {/* Event Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h5 className="text-sm font-bold text-text-primary capitalize">
                  {event.action.replace('_', ' ')}
                </h5>
                <span className="text-[10px] font-mono text-text-muted">
                  {format(new Date(event.createdAt), 'MMM dd, HH:mm')}
                </span>
              </div>
              
              <div className="text-xs text-text-muted mb-1">
                <span className="font-semibold text-text-primary">{event.actorName}</span>
                <span className="mx-1">•</span>
                <span className="uppercase tracking-widest text-[9px] opacity-70">{event.actorRole}</span>
              </div>
              {event.note && (
                <p className="text-xs p-2 bg-surface rounded-md border border-border italic text-text-muted">
                  &quot;{event.note}&quot;
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
