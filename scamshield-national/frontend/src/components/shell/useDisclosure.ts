import { KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Shared behaviour for the header's dropdowns ("More", account menu):
// a disclosure button + panel that closes on Escape (returning focus to the
// button), on a click/tap outside, and on navigation. Arrow keys move between
// the panel's links so it is fully usable without a mouse.
export function useDisclosure<P extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<P>(null);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const focusables = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter(
      (el) => el.offsetParent !== null
    );

  const onButtonKeyDown = useCallback((e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusables()[0]?.focus());
    }
  }, []);

  const onPanelKeyDown = useCallback((e: ReactKeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
    const items = focusables();
    if (items.length === 0) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    let next = 0;
    if (e.key === 'ArrowDown') next = i < 0 ? 0 : (i + 1) % items.length;
    if (e.key === 'ArrowUp') next = i <= 0 ? items.length - 1 : i - 1;
    if (e.key === 'End') next = items.length - 1;
    items[next]?.focus();
  }, []);

  // Tabbing out of the panel closes it, so it never lingers open behind focus.
  const onPanelBlur = useCallback((e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && (panelRef.current?.contains(next) || buttonRef.current?.contains(next))) return;
    if (next) setOpen(false);
  }, []);

  return {
    open,
    setOpen,
    toggle: () => setOpen((o) => !o),
    buttonRef,
    panelRef,
    onButtonKeyDown,
    onPanelKeyDown,
    onPanelBlur,
  };
}
