import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { usePDFEditor } from './PDFEditorProvider';
import { clsx } from 'clsx';
import { debounce } from '../../../utils/debounce';

interface EditableTextProps {
  content?: string;
  onContentChange: (newContent: string) => void;
  className?: string;
  tag?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export const EditableText = ({
  content,
  onContentChange,
  className = '',
  tag = 'p',
  style,
  placeholder
}: EditableTextProps) => {
  const { isEditMode, setSelectedElement, detectCurrentFormat } = usePDFEditor();
  const ref = useRef<HTMLElement>(null);

  // Ref to hold latest callback to avoid recreating debounce on every render
  const onContentChangeRef = useRef(onContentChange);
  
  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);

  const debouncedChange = useMemo(() => 
    debounce((val: string) => {
      onContentChangeRef.current(val);
    }, 500), 
  []);

  const handleInput = useCallback((e: React.FormEvent<HTMLElement>) => {
    const newContent = e.currentTarget.innerHTML;
    debouncedChange(newContent);
    detectCurrentFormat();
  }, [debouncedChange, detectCurrentFormat]);

  const handleFocus = useCallback(() => {
    if (ref.current) {
      setSelectedElement(ref.current);
      detectCurrentFormat();
    }
  }, [setSelectedElement, detectCurrentFormat]);

  const handleKeyUp = useCallback(() => {
    detectCurrentFormat();
  }, [detectCurrentFormat]);

  const handleMouseUp = useCallback(() => {
    detectCurrentFormat();
  }, [detectCurrentFormat]);

  const handleBlur = useCallback(() => {
    // Keep element selected briefly to allow toolbar interaction
    setTimeout(() => {
      setSelectedElement(null);
    }, 100);
  }, [setSelectedElement]);

  // Prevent default paste behavior to avoid unwanted formatting
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Update content when prop changes OR when entering edit mode
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      const currentHTML = ref.current.innerHTML;
      const newContent = content || placeholder || '';
      
      // Only update if content actually changed
      if (currentHTML !== newContent) {
        ref.current.innerHTML = newContent;
      }
    }
  }, [content, placeholder, isEditMode]);

  // Initialize content when component mounts in edit mode
  useEffect(() => {
    if (ref.current && isEditMode && !ref.current.innerHTML) {
      ref.current.innerHTML = content || placeholder || '';
    }
  }, []);

  return React.createElement(tag, {
    ref,
    contentEditable: isEditMode,
    suppressContentEditableWarning: true,
    // Don't use dangerouslySetInnerHTML when in edit mode, let useEffect handle it
    ...(isEditMode ? {} : { dangerouslySetInnerHTML: { __html: content || placeholder || '' } }),
    onInput: handleInput,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onPaste: handlePaste,
    onKeyUp: handleKeyUp,
    onMouseUp: handleMouseUp,
    className: clsx(
      className,
      isEditMode && 'editable-text',
      !content && placeholder && 'empty-editable'
    ),
    style,
    'data-placeholder': placeholder
  });
};
