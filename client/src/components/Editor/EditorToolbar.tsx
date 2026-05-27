import { PencilLine } from "lucide-react";
import { useState } from "react";
import { PresenceAvatar } from "@/components/common/PresenceAvatar";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const collaborators = [
  { name: "Eleanor Voss", color: "#2C5038" },
  { name: "Miles Stone", color: "#A67C2E" },
  { name: "A. Grant", color: "#1C2E4A" },
];

export function EditorToolbar() {
  const [title, setTitle] = useState("Payments Reconciliation Service");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 bg-white px-4 py-4 sm:px-5 lg:h-12 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-0">
      <div className="flex min-w-0 items-center gap-3">
        <PencilLine size={16} className="text-gold" />
        {isEditingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => {
              setIsEditingTitle(false);
              showOldMoneyToast("Session title updated.");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setIsEditingTitle(false);
                showOldMoneyToast("Session title updated.");
              }
            }}
            className="w-full min-w-0 border-b border-gold bg-transparent font-display text-xl text-charcoal-dark outline-none sm:text-2xl lg:min-w-[320px]"
          />
        ) : (
          <button
            className="truncate text-left font-display text-xl text-charcoal-dark sm:text-2xl"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </button>
        )}
      </div>
      <Select
        defaultValue="typescript"
        onValueChange={(value) => showOldMoneyToast(`Language context switched to ${value}.`)}
      >
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="typescript">TypeScript</SelectItem>
          <SelectItem value="go">Go</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="rust">Rust</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex">
          {collaborators.map((person) => (
            <PresenceAvatar key={person.name} stacked {...person} />
          ))}
        </div>
        <Button className="w-full py-2 sm:w-auto" onClick={() => showOldMoneyToast("Review completed and archived.")}>
          Review Code
        </Button>
      </div>
    </div>
  );
}
