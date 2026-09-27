// Mejora visual: Wrapper de íconos Phosphor con tamaños y estilo de marca unificados
import {
  BookOpen, Camera, Briefcase, TwitterLogo, Television, Lightning, CheckCircle,
  Robot, TrendUp, Target, ChatCircleDots, ChartBar, Rocket, Handshake,
  GlobeHemisphereWest, Heart, Sparkle, Gift, Star, Lock, Confetti, Prohibit,
  Phone, DeviceMobile, EnvelopeSimple
} from 'phosphor-react';

import type { IconProps } from 'phosphor-react';

type PIconName =
  | 'book' | 'camera' | 'briefcase' | 'twitter' | 'tv' | 'lightning' | 'check'
  | 'robot' | 'trendUp' | 'target' | 'chat' | 'chartBar' | 'rocket'
  | 'handshake' | 'globe' | 'heart' | 'sparkle' | 'gift' | 'star' | 'lock'
  | 'confetti' | 'prohibit' | 'phone' | 'mobile' | 'mail';

const ICONS: Record<PIconName, React.ComponentType<IconProps>> = {
  book: BookOpen,
  camera: Camera,
  briefcase: Briefcase,
  twitter: TwitterLogo,
  tv: Television,
  lightning: Lightning,
  check: CheckCircle,
  robot: Robot,
  trendUp: TrendUp,
  target: Target,
  chat: ChatCircleDots,
  chartBar: ChartBar,
  rocket: Rocket,
  handshake: Handshake,
  globe: GlobeHemisphereWest,
  heart: Heart,
  sparkle: Sparkle,
  gift: Gift,
  star: Star,
  lock: Lock,
  confetti: Confetti,
  prohibit: Prohibit,
  phone: Phone,
  mobile: DeviceMobile,
  mail: EnvelopeSimple,
};

interface Props {
  name: PIconName;
  title?: string; // accesibilidad opcional
  className?: string;
  size?: number; // px
  weight?: IconProps['weight']; // 'duotone' recomendado
}

// Uso por defecto con el gradiente de marca (azul→morado)
export default function PIcon({
  name,
  title,
  className = 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600',
  size = 28,
  weight = 'duotone',
}: Props) {
  const Cmp = ICONS[name];
  return (
    <Cmp
      size={size}
      weight={weight}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    />
  );
}
