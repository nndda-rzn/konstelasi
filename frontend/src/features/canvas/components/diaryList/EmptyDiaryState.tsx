"use client";

interface EmptyDiaryStateProps {
  searchQuery: string;
}

/**
 * EmptyDiaryState - Shown when the diary has no matching notes.
 */
export function EmptyDiaryState({ searchQuery }: EmptyDiaryStateProps) {
  return (
    <div className="text-center p-10 mt-10 max-w-2xl mx-auto bg-white/50 rounded-2xl border border-dashed border-[#FFB4A2]/20 text-[#5A3E4C]/50">
      <p className="text-lg mb-2">✨</p>
      {searchQuery ? (
        <p>No notes found matching &quot;{searchQuery}&quot;.</p>
      ) : (
        <>
          <p>You don&apos;t have any notes yet.</p>
          <p className="text-sm text-[#5A3E4C]/30 mt-1">
            Create one to get started!
          </p>
        </>
      )}
    </div>
  );
}
