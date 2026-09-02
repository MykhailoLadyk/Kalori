import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

// Global priority-sorted handler stack — highest priority wins
const handlers = [];
let listenerRegistered = false;

function registerGlobalListener() {
  if (listenerRegistered) return;
  listenerRegistered = true;

  if (Capacitor.isNativePlatform()) {
    App.addListener("backButton", () => {
      if (handlers.length === 0) return;
      // Call the highest-priority handler (last in sorted array)
      const top = handlers[handlers.length - 1];
      top.handler();
    });
  }
}

/**
 * Register a back-button handler with a given priority.
 * Higher priority handlers override lower ones.
 *
 * Priority guide:
 *   10 = root/tab-level navigation (default fallback)
 *   30 = modal dismiss
 *
 * @param {Function} handler - callback invoked when back is pressed
 * @param {number} priority - higher = takes precedence
 * @param {boolean} enabled - whether the handler is active
 */
export function useBackButton(handler, priority = 10, enabled = true) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    registerGlobalListener();

    if (!enabled) return;

    const entry = {
      priority,
      handler: () => handlerRef.current(),
    };

    handlers.push(entry);
    handlers.sort((a, b) => a.priority - b.priority);

    return () => {
      const idx = handlers.indexOf(entry);
      if (idx !== -1) handlers.splice(idx, 1);
    };
  }, [priority, enabled]);
}
