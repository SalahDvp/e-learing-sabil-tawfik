import React from 'react';
import { X } from 'lucide-react';

interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function SideSheet({ isOpen, onClose, title, children }: SideSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}