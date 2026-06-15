import type { CapturePhase } from "../store/types";

export interface CaptureState {
  phase: CapturePhase;
  total: number;
  count: number;
  timer: number;
  countdown: number | null;
  errorMessage: string | null;
}

export type CaptureEvent =
  | { type: "START"; total: number; timer: number }
  | { type: "TICK"; remaining: number }
  | { type: "COUNTDOWN_DONE" }
  | { type: "CAPTURE_DONE" }
  | { type: "CAPTURE_ERROR"; message: string }
  | { type: "COMPOSE_START" }
  | { type: "COMPOSE_DONE" }
  | { type: "COMPOSE_ERROR"; message: string }
  | { type: "CANCEL" }
  | { type: "RETRY" };

export const initialCaptureState: CaptureState = {
  phase: "idle",
  total: 0,
  count: 0,
  timer: 3,
  countdown: null,
  errorMessage: null,
};

export function captureReducer(state: CaptureState, event: CaptureEvent): CaptureState {
  switch (event.type) {
    case "START":
      return {
        ...initialCaptureState,
        total: event.total,
        timer: event.timer,
        phase: "countdown",
        countdown: event.timer,
      };
    case "TICK":
      if (state.phase !== "countdown") return state;
      if (event.remaining <= 0) return state;
      return { ...state, countdown: event.remaining };
    case "COUNTDOWN_DONE":
      if (state.phase !== "countdown") return state;
      return { ...state, phase: "capturing", countdown: 0 };
    case "CAPTURE_DONE": {
      if (state.phase !== "capturing") return state;
      const nextCount = state.count + 1;
      if (nextCount >= state.total) {
        return { ...state, count: nextCount, phase: "processing" };
      }
      return {
        ...state,
        count: nextCount,
        phase: "countdown",
        countdown: state.timer,
      };
    }
    case "CAPTURE_ERROR":
      return { ...state, phase: "error", errorMessage: event.message };
    case "COMPOSE_START":
      if (state.phase !== "processing") return state;
      return state;
    case "COMPOSE_DONE":
      if (state.phase !== "processing") return state;
      return { ...state, phase: "result" };
    case "COMPOSE_ERROR":
      return { ...state, phase: "error", errorMessage: event.message };
    case "CANCEL":
      return { ...initialCaptureState, timer: state.timer };
    case "RETRY":
      return {
        ...initialCaptureState,
        total: state.total,
        timer: state.timer,
        phase: "countdown",
        countdown: state.timer,
      };
  }
}

export function isActiveCapture(phase: CapturePhase): boolean {
  return phase === "countdown" || phase === "capturing" || phase === "processing";
}
