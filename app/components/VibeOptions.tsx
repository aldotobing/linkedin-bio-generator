import {
  Briefcase,
  Paintbrush,
  Smile,
  Flame,
  Code,
  Users,
  BarChart,
  Heart,
  Lightbulb,
  Star,
  Globe,
  Crown,
} from "lucide-react";

export const vibeOptions = [
  {
    name: "Professional",
    description:
      "Perfect for corporate roles, focuses on achievements and expertise",
    icon: <Briefcase className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Creative",
    description: "Ideal for designers, artists, and innovative roles",
    icon: <Paintbrush className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Casual",
    description:
      "Friendly and approachable, great for startups and social media",
    icon: <Smile className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Enthusiastic",
    description:
      "Energetic and passionate, perfect for community-focused roles",
    icon: <Flame className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Technical",
    description:
      "Detailed and precise, ideal for technical and specialized roles",
    icon: <Code className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Leadership",
    description: "Emphasizes vision and team management experience",
    icon: <Crown className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Analytical",
    description: "Focused on data-driven insights and logical reasoning",
    icon: <BarChart className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Empathetic",
    description: "Highlights emotional intelligence and interpersonal skills",
    icon: <Heart className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Innovative",
    description: "Showcases creativity and forward-thinking approaches",
    icon: <Lightbulb className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Motivational",
    description: "Inspires and encourages others, great for coaching roles",
    icon: <Star className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Adventurous",
    description: "Bold and daring, perfect for roles that involve risk-taking",
    icon: <Globe className="w-6 h-6 text-indigo-700" />,
  },
  {
    name: "Collaborative",
    description: "Emphasizes teamwork and collective success",
    icon: <Users className="w-6 h-6 text-indigo-700" />, // Using Users2 for team
  },
];
