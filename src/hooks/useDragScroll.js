import { useRef } from "react";

const DRAG_THRESHOLD = 5;

export function useDragScroll() {
  const ref = useRef(null);
  const state = useRef({ dragging: false, captured: false, startX: 0, startScroll: 0, pointerId: null });

  function onPointerDown(e) {
    const el = ref.current;
    if (!el) return;
    state.current = { dragging: true, captured: false, startX: e.clientX, startScroll: el.scrollLeft, pointerId: e.pointerId };
  }

  function onPointerMove(e) {
    const el = ref.current;
    if (!el || !state.current.dragging) return;
    const delta = e.clientX - state.current.startX;
    if (!state.current.captured && Math.abs(delta) > DRAG_THRESHOLD) {
      state.current.captured = true;
      el.setPointerCapture(state.current.pointerId);
    }
    if (state.current.captured) {
      el.scrollLeft = state.current.startScroll - delta;
    }
  }

  function onPointerUp(e) {
    const el = ref.current;
    if (el && state.current.captured) el.releasePointerCapture(e.pointerId);
    state.current.dragging = false;
    state.current.captured = false;
  }

  return { ref, onPointerDown, onPointerMove, onPointerUp, onPointerLeave: onPointerUp };
}
