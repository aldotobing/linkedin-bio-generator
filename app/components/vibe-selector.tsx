'use client'

import { Button } from "@/components/ui/button"
import { Briefcase, Coffee, Sparkles, Rocket, Brain, Trophy } from 'lucide-react'

const vibes = [
  {
    id: "professional",
    label: "Professional",
    icon: Briefcase,
    description: "Polished and corporate"
  },
  {
    id: "casual",
    label: "Casual",
    icon: Coffee,
    description: "Friendly and approachable"
  },
  {
    id: "creative",
    label: "Creative",
    icon: Sparkles,
    description: "Imaginative and artistic"
  },
  {
    id: "ambitious",
    label: "Ambitious",
    icon: Rocket,
    description: "Bold and driven"
  },
  {
    id: "intellectual",
    label: "Intellectual",
    icon: Brain,
    description: "Thoughtful and analytical"
  },
  {
    id: "accomplished",
    label: "Accomplished",
    icon: Trophy,
    description: "Achievement-focused"
  }
]

interface VibeSelectorProps {
  selected: string
  onSelect: (vibe: string) => void
}

export function VibeSelector({ selected, onSelect }: VibeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {vibes.map((vibe) => {
        const Icon = vibe.icon
        return (
          <Button
            key={vibe.id}
            variant={selected === vibe.id ? "default" : "outline"}
            className="h-auto flex-col py-4 px-6"
            onClick={() => onSelect(vibe.id)}
          >
            <Icon className="w-6 h-6 mb-2" />
            <div className="font-medium mb-1">{vibe.label}</div>
            <div className="text-xs text-muted-foreground">{vibe.description}</div>
          </Button>
        )
      })}
    </div>
  )
}

