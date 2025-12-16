"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Ban, UserX, X } from 'lucide-react';

interface AdminActionPopupProps {
  decoration: {
    id: string;
    name?: string;
    type?: string;
    ip?: string;
    session?: string;
  };
  position: { x: number; y: number };
  onRemove: (id: string) => void;
  onBlockIP: (ip: string) => void;
  onBlockSession: (session: string) => void;
  onClose: () => void;
}

export const AdminActionPopup = ({
  decoration,
  position,
  onRemove,
  onBlockIP,
  onBlockSession,
  onClose,
}: AdminActionPopupProps) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div 
        className="fixed z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
        style={{
          left: Math.min(position.x, window.innerWidth - 280),
          top: Math.min(position.y, window.innerHeight - 250),
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white text-sm">Admin Actions</h3>
            <p className="text-[10px] text-white/50 truncate max-w-[180px]">
              {decoration.name || decoration.type || 'Decoration'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-3 space-y-2">
          <Button
            onClick={() => {
              onRemove(decoration.id);
              onClose();
            }}
            className="w-full h-10 bg-red-600 hover:bg-red-700 text-white justify-start gap-3"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Decoration</span>
          </Button>

          {decoration.ip && (
            <Button
              onClick={() => {
                onBlockIP(decoration.ip!);
                onClose();
              }}
              className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white justify-start gap-3"
            >
              <Ban className="w-4 h-4" />
              <span>Block IP: {decoration.ip.slice(0, 12)}...</span>
            </Button>
          )}

          {decoration.session && (
            <Button
              onClick={() => {
                onBlockSession(decoration.session!);
                onClose();
              }}
              className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white justify-start gap-3"
            >
              <UserX className="w-4 h-4" />
              <span>Block Session</span>
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10">
          <p className="text-[9px] text-white/40">
            {decoration.ip && `IP: ${decoration.ip}`}
            {decoration.ip && decoration.session && ' • '}
            {decoration.session && `Session: ${decoration.session.slice(0, 12)}...`}
          </p>
        </div>
      </div>
    </>
  );
};
