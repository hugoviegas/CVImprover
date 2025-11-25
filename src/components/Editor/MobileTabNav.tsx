import React from 'react';
import { Edit3, Eye } from 'lucide-react';
import { clsx } from 'clsx';

export type MobileTab = 'edit' | 'preview';

interface MobileTabNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export const MobileTabNav: React.FC<MobileTabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20 lg:hidden">
      {/* Edit Tab */}
      <button
        onClick={() => onTabChange('edit')}
        className={clsx(
          'flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative',
          activeTab === 'edit'
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        )}
      >
        <Edit3 className="w-5 h-5" />
        <span>Edit</span>
        {activeTab === 'edit' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
        )}
      </button>

      {/* Preview Tab */}
      <button
        onClick={() => onTabChange('preview')}
        className={clsx(
          'flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative',
          activeTab === 'preview'
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        )}
      >
        <Eye className="w-5 h-5" />
        <span>Preview</span>
        {activeTab === 'preview' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
        )}
      </button>
    </div>
  );
};
