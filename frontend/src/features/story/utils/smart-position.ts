/**
 * Smart position calculation for new story nodes.
 * - Empty canvas: center of viewport
 * - Has selection: anchor on selected node, offset by siblings count
 * - No selection: rightmost + jitter
 */

export interface NodePosition {
  position: { x: number; y: number };
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 180;
const GAP = 40;

export function computeSmartPosition(
  nodes: NodePosition[],
  selectedNoteId: string | null,
  screenToFlowPosition: (clientPos: { x: number; y: number }) => { x: number; y: number }
): { x: number; y: number } {
  if (nodes.length === 0) {
    return screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
  }

  if (selectedNoteId) {
    const anchor = nodes.find((n) => n.position && (n as any).id === selectedNoteId) as NodePosition | undefined;
    if (anchor) {
      const siblings = nodes.filter(
        (n) =>
          n.position.x >= anchor.position.x + NODE_WIDTH &&
          n.position.x < anchor.position.x + NODE_WIDTH * 2 + GAP &&
          Math.abs(n.position.y - anchor.position.y) < NODE_HEIGHT * 3
      );
      const verticalOffset =
        siblings.length === 0
          ? 0
          : (siblings.length % 2 === 0 ? 1 : -1) *
            Math.ceil(siblings.length / 2) *
            (NODE_HEIGHT + GAP);
      return {
        x: anchor.position.x + NODE_WIDTH + GAP,
        y: anchor.position.y + verticalOffset,
      };
    }
  }

  const rightmost = nodes.reduce<NodePosition | null>(
    (acc, n) => (!acc || n.position.x > acc.position.x ? n : acc),
    null
  );
  return {
    x: rightmost!.position.x + NODE_WIDTH + GAP,
    y: rightmost!.position.y + (Math.random() * 60 - 30),
  };
}
