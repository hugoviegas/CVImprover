import React, { createContext, useContext, useState, useCallback } from 'react';

export interface TextFormat {
  fontFamily: string;
  fontSize: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right' | 'justify';
}

interface PDFEditorContextType {
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
  formatText: (command: string, value?: string) => void;
  currentFormat: TextFormat;
  updateCurrentFormat: (format: Partial<TextFormat>) => void;
  detectCurrentFormat: () => void;
}

const defaultFormat: TextFormat = {
  fontFamily: 'Arial',
  fontSize: '14px',
  color: '#000000',
  bold: false,
  italic: false,
  underline: false,
  align: 'left'
};

const PDFEditorContext = createContext<PDFEditorContextType | undefined>(undefined);

export const PDFEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [currentFormat, setCurrentFormat] = useState<TextFormat>(defaultFormat);

  const setEditMode = useCallback((enabled: boolean) => {
    setIsEditMode(enabled);
    if (!enabled) {
      setSelectedElement(null);
    }
  }, []);

  const detectCurrentFormat = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer as HTMLElement;
    
    // Handle text nodes
    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement as HTMLElement;
    }

    if (!element) return;

    // Get computed style
    const computedStyle = window.getComputedStyle(element);

    setCurrentFormat({
      fontFamily: computedStyle.fontFamily.replace(/['"]/g, '').split(',')[0].trim(),
      fontSize: computedStyle.fontSize,
      color: rgbToHex(computedStyle.color),
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      align: (computedStyle.textAlign as any) || 'left'
    });
  }, []);

  const formatText = useCallback((command: string, value?: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    try {
      // Execute format command
      document.execCommand(command, false, value);
      
      // Trigger input event to sync changes
      const target = selection.anchorNode?.parentElement;
      if (target) {
        const event = new Event('input', { bubbles: true });
        target.dispatchEvent(event);
      }

      // Update current format state
      detectCurrentFormat();
    } catch (error) {
      console.error('Format command failed:', error);
    }
  }, [detectCurrentFormat]);

  const updateCurrentFormat = useCallback((format: Partial<TextFormat>) => {
    setCurrentFormat(prev => ({ ...prev, ...format }));
  }, []);

  const value: PDFEditorContextType = {
    isEditMode,
    setEditMode,
    selectedElement,
    setSelectedElement,
    formatText,
    currentFormat,
    updateCurrentFormat,
    detectCurrentFormat
  };

  return (
    <PDFEditorContext.Provider value={value}>
      {children}
    </PDFEditorContext.Provider>
  );
};

export const usePDFEditor = (): PDFEditorContextType => {
  const context = useContext(PDFEditorContext);
  if (!context) {
    throw new Error('usePDFEditor must be used within PDFEditorProvider');
  }
  return context;
};

// Helper function to convert RGB to HEX
function rgbToHex(rgb: string): string {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return '#000000';
  
  const r = parseInt(result[0]);
  const g = parseInt(result[1]);
  const b = parseInt(result[2]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
