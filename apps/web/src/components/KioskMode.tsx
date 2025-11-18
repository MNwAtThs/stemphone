'use client';

import { useEffect } from 'react';

export function KioskMode() {
  useEffect(() => {
    // Prevent context menu (right-click)
    const handleContextMenu = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent double-click selection
    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent long-press on touch devices
    const handleTouchStart = (e: TouchEvent) => {
      // Prevent context menu on long press
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent text selection via keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+A (select all), Ctrl+C (copy), Ctrl+V (paste), Ctrl+X (cut)
      if (e.ctrlKey || e.metaKey) {
        if (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }
      // Prevent F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchStart, { passive: false });
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchStart);
      document.removeEventListener('touchend', handleTouchStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', (e) => e.preventDefault());
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}

