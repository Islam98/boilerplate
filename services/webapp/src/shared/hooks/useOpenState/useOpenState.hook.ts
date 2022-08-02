import { useEffect, useRef, useState } from 'react';
import { not } from 'ramda';

/*
 * Hook to handle popups, dropdowns. etc open state.
 * Works best if not deconstructed, because exposes semantically
 * correct methods under namespace.
 */
export const useOpenState = (initialValue: boolean | (() => boolean)) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialValue);
  const isTogglingRef = useRef(false);

  const close = () => setIsOpen(false);

  const open = () => setIsOpen(true);

  const toggle = () => {
    isTogglingRef.current = true;
    setIsOpen(not);
  };

  const clickAway = () => {
    if (!isOpen || isTogglingRef.current) return;
    close();
  };

  useEffect(() => {
    isTogglingRef.current = false;
  });

  return { isOpen, setIsOpen, close, open, toggle, clickAway };
};