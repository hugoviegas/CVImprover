import { useState, useEffect } from 'react';

interface SelectionPosition {
  top: number;
  left: number;
}

export function useTextSelection() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [position, setPosition] = useState<SelectionPosition>({ top: 0, left: 0 });
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      
      if (sel && sel.toString().length > 0 && sel.rangeCount > 0) {
        setSelection(sel);
        setHasSelection(true);

        try {
          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Calculate toolbar position above selection
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

          setPosition({
            top: rect.top + scrollTop - 65, // 65px above selection for toolbar
            left: rect.left + scrollLeft + (rect.width / 2) - 200 // Center toolbar (assuming 400px width)
          });
        } catch (error) {
          console.error('Error getting selection rect:', error);
        }
      } else {
        setSelection(null);
        setHasSelection(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    // Also listen to mouse up for immediate feedback
    document.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  return { selection, position, hasSelection };
}
