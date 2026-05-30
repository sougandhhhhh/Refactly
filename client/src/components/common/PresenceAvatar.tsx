import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PresenceAvatarProps = {
  name: string;
  color: string;
  stacked?: boolean;
};

export function PresenceAvatar({ name, color, stacked = false }: PresenceAvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div layout className={stacked ? "-ml-2 first:ml-0" : ""}>
            <Avatar style={{ backgroundColor: color }}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
