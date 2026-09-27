import {
  Rocket, ChartLineUp, Target, ChatCircleText, Robot, TrendUp,
  MegaphoneSimple, EnvelopeSimple, Phone, DeviceMobile, Lock,
  CheckCircle, Globe, Heart, Gift, Star, Prohibit, Monitor, Camera,
  Briefcase, Lightning
} from "phosphor-react";

export type IconName =
  | "rocket" | "chart-up" | "target" | "chat" | "robot" | "trend-up"
  | "ads" | "mail" | "phone" | "smartphone" | "lock"
  | "check" | "globe" | "heart" | "gift" | "star" | "prohibit"
  | "monitor" | "camera" | "briefcase" | "bolt";

const MAP: Record<IconName, any> = {
  rocket: Rocket,
  "chart-up": ChartLineUp,
  target: Target,
  chat: ChatCircleText,
  robot: Robot,
  "trend-up": TrendUp,
  ads: MegaphoneSimple,
  mail: EnvelopeSimple,
  phone: Phone,
  smartphone: DeviceMobile,
  lock: Lock,
  check: CheckCircle,
  globe: Globe,
  heart: Heart,
  gift: Gift,
  star: Star,
  prohibit: Prohibit,
  monitor: Monitor,
  camera: Camera,
  briefcase: Briefcase,
  bolt: Lightning,
};

type Props = {
  name: IconName;
  size?: number;        // px
  weight?: "regular" | "bold" | "duotone";
  mode?: "white" | "brand"; // blanco sólido (video) o color marca (secciones)
  className?: string;
  title?: string;
};

export default function Icon({
  name,
  size = 40,
  weight = "duotone",
  mode = "white",
  className,
  title
}: Props) {
  const Cmp = MAP[name];
  const color = mode === "white" ? "#FFFFFF" : "#2563EB"; // azul-600
  return (
    <Cmp
      size={size}
      weight={weight}
      color={color}
      aria-label={title}
      className={className}
    />
  );
}
