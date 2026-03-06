"use client";

import React from "react";
import { Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnnouncementBannerProps {
  id: string;
  title: string;
  body: string;
  date: string;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ id, title, body, date }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const dismissed = localStorage.getItem(`announcement_dismissed_${id}`);
    if (dismissed) {
      setIsVisible(false);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`announcement_dismissed_${id}`, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-white border-l-4 border-accent rounded-card shadow-card p-4 flex items-start gap-4 mb-6 animate-in slide-in-from-top duration-500">
      <div className="p-2 bg-amber-100 rounded-lg text-accent shrink-0">
        <Megaphone className="h-5 w-5" />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h5 className="font-bold text-text-primary text-sm">{title}</h5>
          <span className="text-[10px] text-text-muted font-mono">{date}</span>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          {body}
        </p>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDismiss}
        className="text-text-muted hover:text-text-primary h-8 w-8 -mt-1 -mr-1"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AnnouncementBanner;
