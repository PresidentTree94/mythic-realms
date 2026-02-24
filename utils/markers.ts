import { Star, Sparkle, Droplet, Eye, ChessBishop, BowArrow, Flame, Sun, Hourglass, Compass, Moon, Scale, Wheat, LucideIcon } from "lucide-react";

export const PANTHEON_MARKERS: Record<string, LucideIcon> = {
  "Concord": Scale,
  "Epoch": Hourglass,
  "Fervor": Flame,
  "Radiant": Sun,
  "Umbral": Moon,
  "Vigil": BowArrow,
  "Wayfinder": Compass,
}

export const INSPIRATION_MARKERS: Record<string, LucideIcon> = {
  "Deity": Star,
  "Demigod": Sparkle,
  "Nymph": Droplet,
  "Seer": Eye,
  "Prophet": ChessBishop
}