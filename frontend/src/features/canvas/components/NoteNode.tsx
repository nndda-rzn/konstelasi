"use client";

import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import type { NoteNodeData, NoteColor } from "@/features/canvas/types";
import { THEMES } from "./noteNode/nodeTheme";
import { MoodBadge, NodeImage, NoteBody, QuoteBody } from "./noteNode/NodeBodies";

/**
 * NoteNode - React Flow custom node renderer for a note.
 * Composition: theme from nodeTheme.ts, body atoms from NodeBodies.tsx.
 */
export default memo(function NoteNode({
  data,
  isConnectable,
  selected,
  viewMode = "canvas",
}: {
  data: NoteNodeData;
  isConnectable?: boolean;
  selected?: boolean;
  viewMode?: "canvas" | "thread" | "timeline";
  id?: string;
  width?: number;
  height?: number;
}) {
  const {
    isSearching,
    isMatch,
    color = "default",
    _threadAlign = "right",
    type = "default",
    mood = "",
  } = data;
  const theme = THEMES[color as NoteColor] || THEMES.default;

  const searchFade =
    isSearching && !isMatch
      ? "opacity-25 scale-95 pointer-events-none"
      : "opacity-100 scale-100";

  const searchHighlight =
    isSearching && isMatch
      ? "ring-2 ring-[#B84A5A]/70 shadow-[0_0_60px_-8px_rgba(184,74,90,0.45)] z-50 animate-[pulse_2.5s_ease-in-out_infinite]"
      : "";

  const isSelectedStyle = selected && (!isSearching || isMatch);

  let bubbleRadiusClass = "rounded-3xl rounded-br-md";
  if (viewMode === "thread") {
    bubbleRadiusClass =
      _threadAlign === "left"
        ? "rounded-3xl rounded-tl-sm"
        : "rounded-3xl rounded-tr-sm";
  }

  return (
    <>
      {viewMode === "canvas" && (
        <NodeResizer
          color={theme.topLine.split("-")[1] ? `#${theme.topLine.split("-")[1]}` : "#B84A5A"}
          isVisible={selected}
          minWidth={200}
          minHeight={120}
          maxWidth={1200}
          handleClassName="h-3 w-3 bg-white border-2 border-[#F7F1EA] rounded-full"
          lineClassName="border-[#C99A45]/30"
        />
      )}
      <div
        className={`
          relative w-full h-full min-w-[200px] min-h-[120px] ${bubbleRadiusClass} backdrop-blur-3xl transition-all duration-500 group
          bg-[#FFFCF8]/90
          ${searchFade} ${searchHighlight}
          ${
            isSelectedStyle
              ? `border ${theme.selectedBorder} ${theme.selectedShadow} ${theme.selectedBg}`
              : `border ${theme.borderBase} ${theme.bgHover}`
          }
          ${theme.borderHover} ${theme.shadowHover}
        `}
        style={{ maxWidth: "1200px" }}
      >
        <div
          className={`absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent ${theme.topLine}/${
            isSelectedStyle ? "80" : "30"
          } to-transparent opacity-80 group-hover:opacity-100 group-hover:w-5/6 transition-all duration-500`}
        />

        <MoodBadge mood={mood} />

        <div
          className={`absolute inset-0 ${bubbleRadiusClass} transition-opacity duration-500 pointer-events-none ${
            isSelectedStyle
              ? `bg-gradient-to-br ${theme.innerGlow} to-transparent opacity-100`
              : `bg-gradient-to-br ${theme.innerGlowUnselected} to-transparent opacity-0 group-hover:opacity-100`
          }`}
        />

        {viewMode === "canvas" && (
          <Handle
            type="source"
            position={Position.Top}
            id="top"
            isConnectable={isConnectable}
            isConnectableEnd={true}
          />
        )}
        {viewMode === "canvas" && (
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            isConnectable={isConnectable}
            isConnectableEnd={true}
          />
        )}

        <div
          className="p-6 cursor-pointer relative z-10 w-full h-full flex flex-col min-h-0"
          onClick={() => data.onDoubleClick?.()}
          onDoubleClick={() => data.onDoubleClick?.()}
        >
          <NodeImage images={data.images} />

          {type === "quote" ? (
            <QuoteBody content={data.content} title={data.title} />
          ) : (
            <NoteBody data={data} selected={selected} />
          )}
        </div>

        {viewMode === "canvas" && (
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            isConnectable={isConnectable}
            isConnectableEnd={true}
          />
        )}
        {viewMode === "canvas" && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            isConnectable={isConnectable}
            isConnectableEnd={true}
          />
        )}
      </div>
    </>
  );
},
(prevProps, nextProps) => {
  if (prevProps.selected !== nextProps.selected) return false;
  if (prevProps.viewMode !== nextProps.viewMode) return false;
  if (prevProps.width !== nextProps.width) return false;
  if (prevProps.height !== nextProps.height) return false;

  const prevData = prevProps.data || {};
  const nextData = nextProps.data || {};

  if (prevData.title !== nextData.title) return false;
  if (prevData.content !== nextData.content) return false;
  if (prevData.color !== nextData.color) return false;
  if (prevData.mood !== nextData.mood) return false;
  if (prevData.isSearching !== nextData.isSearching) return false;
  if (prevData.isMatch !== nextData.isMatch) return false;
  if (prevData.images?.length !== nextData.images?.length) return false;
  if (prevData.images?.[0]?.id !== nextData.images?.[0]?.id) return false;

  return true;
});
