import type { ComponentType } from "react";
import {
  Blocks,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Github,
  GraduationCap,
  HeartPulse,
  Linkedin,
  Mail,
  Medal,
  Newspaper,
  RadioTower,
  Rocket,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const iconMap: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Blocks,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Github,
  GraduationCap,
  HeartPulse,
  Linkedin,
  Mail,
  Medal,
  Newspaper,
  RadioTower,
  Rocket,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
};

/**
 * Resolve an icon name string (from the database) to a Lucide React component.
 * Falls back to Trophy if the name is not found.
 */
export function resolveIcon(
  name: string | null | undefined,
): ComponentType<{ size?: number; strokeWidth?: number }> {
  if (name && name in iconMap) return iconMap[name];
  return Trophy;
}

/**
 * A pre-resolved Trophy icon for use as a default (matches the old `trophyIcon` export).
 */
export const trophyIcon = Trophy;
