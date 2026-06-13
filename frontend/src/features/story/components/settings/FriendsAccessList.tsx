"use client";

import { Trash2 } from "lucide-react";

interface FriendsAccessListProps {
  accessList: any[];
  onRevoke: (accessId: string) => void;
}

/**
 * FriendsAccessList - List of invited friends with revoke buttons.
 */
export function FriendsAccessList({
  accessList,
  onRevoke,
}: FriendsAccessListProps) {
  if (accessList.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {accessList.map((access) => (
        <div
          key={access.id}
          className="flex items-center justify-between p-2 rounded-lg bg-[#FFB8C0]/5 dark:bg-[#E63946]/5"
        >
          <span className="text-xs text-[#4A2F3C] dark:text-[#e2d9f3]">
            {access.grantedTo.email}
          </span>
          <button
            onClick={() => onRevoke(access.id)}
            className="p-1 rounded hover:bg-red-50 text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
