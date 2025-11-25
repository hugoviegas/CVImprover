import React from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface ItemActionsProps {
  onDelete: () => void;
  onOptimize?: () => void;
  showOptimize?: boolean;
  className?: string;
}

export const ItemActions: React.FC<ItemActionsProps> = ({
  onDelete,
  onOptimize,
  showOptimize = true,
  className = ''
}) => {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {showOptimize && onOptimize && (
        <button
          onClick={onOptimize}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
          title="Optimize with AI"
        >
          <Sparkles className="w-3 h-3" />
          <span className="hidden sm:inline">Optimize</span>
        </button>
      )}
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
        title="Delete"
      >
        <Trash2 className="w-3 h-3" />
        <span className="hidden sm:inline">Delete</span>
      </button>
    </div>
  );
};
