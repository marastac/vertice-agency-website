// src/content/company.ts — Contenido compartido entre páginas (proceso, principios, capacidades, Lead AI).
//
// Solo contenido verificable. No añadir clientes, testimonios, certificaciones, premios ni métricas.
// Lead AI: solo capacidades confirmadas en el producto. No añadir funciones que
// no existan (p. ej. widget embebible o sincronización con otros CRM). Su disponibilidad se informa por consulta.
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import {
  AddressBook,
  ArrowsClockwise,
  Browsers,
  ChartLineUp,
  ChatCircleDots,
  ChatsCircle,
  Code,
  Compass,
  Database,
  FileText,
  ListChecks,
  MagnifyingGlass,
  PlugsConnected,
  Robot,
  ShieldCheck,
  Sparkle,
  Stack,
  Wrench,
} from 'phosphor-react';

type Icon = ComponentType<IconProps>;

export const PROCESS_STEPS: { title: string; text: string; Icon: Icon }[] = [
  {
    title: 'Entendemos el problema',
    text: 'Revisamos cómo trabajas hoy, qué herramientas usas y dónde se pierde tiempo o se escapan oportunidades.',
    Icon: MagnifyingGlass,
  },
  {
    title: 'Diseñamos la solución',
    text: 'Te proponemos qué construir, automatizar o integrar primero, con alcance, plazos y costo por escrito.',
    Icon: Compass,
  },
  {
    title: 'Implementamos e integramos',
    text: 'Desarrollamos la solución y la conectamos con tus herramientas, con entregas parciales que puedes revisar.',
    Icon: Wrench,
  },
  {
    title: 'Acompañamos y mejoramos',
    text: 'Verificamos que funcione como se acordó, capacitamos a tu equipo y, si lo necesitas, damos soporte y mejoras.',
    Icon: ArrowsClockwise,
  },
];

/** Compromisos de trabajo: características reales del servicio, no promesas de resultados. */
export const PRINCIPLES: { title: string; text: string; Icon: Icon }[] = [
  {
    title: 'Alcance claro desde el inicio',
    text: 'Antes de empezar recibes por escrito qué incluye el proyecto, qué no incluye, los plazos y el costo.',
    Icon: FileText,
  },
  {
    title: 'Comunicación directa',
    text: 'Hablas con quien diseña y construye tu solución, sin intermediarios ni equipos comerciales de por medio.',
    Icon: ChatsCircle,
  },
  {
    title: 'Entregas que puedes revisar',
    text: 'Avanzamos por etapas para que veas el progreso y ajustes a tiempo, en lugar de esperar al final.',
    Icon: ListChecks,
  },
  {
    title: 'Tecnología actual y documentada',
    text: 'Usamos herramientas modernas y mantenibles, y entregamos documentación para que tu equipo pueda operar.',
    Icon: Code,
  },
  {
    title: 'Privacidad y medición responsables',
    text: 'Aplicamos consentimiento de cookies y minimización de datos, como en esta misma web.',
    Icon: ShieldCheck,
  },
  {
    title: 'Sin promesas infladas',
    text: 'No garantizamos cifras que no podemos controlar. Te decimos qué es viable y qué no antes de invertir.',
    Icon: Compass,
  },
];

export const TECH_GROUPS: { title: string; items: string[]; Icon: Icon }[] = [
  { title: 'Desarrollo', items: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'], Icon: Code },
  { title: 'Datos e integraciones', items: ['PostgreSQL / Supabase', 'APIs REST', 'HubSpot API', 'OAuth'], Icon: Database },
  { title: 'IA y automatización', items: ['Modelos de IA vía API', 'Flujos automatizados', 'Formularios con puntuación'], Icon: Robot },
  { title: 'Medición y despliegue', items: ['Google Analytics 4', 'Meta Pixel', 'Vercel'], Icon: ChartLineUp },
];

export const PROJECTS: { title: string; tag: string; text: string; stack: string; href?: string; Icon: Icon }[] = [
  {
    title: 'Lead AI',
    tag: 'Producto propio',
    text: 'Plataforma de captación y calificación de prospectos con formularios con puntuación, asistente de chat con IA y panel para trabajar en equipo.',
    stack: 'React · Supabase · Node.js · IA vía API',
    href: '/lead-ai',
    Icon: Sparkle,
  },
  {
    title: 'Integración Lead AI + HubSpot',
    tag: 'Integración propia',
    text: 'Conexión segura por OAuth para enviar o actualizar cada lead como contacto en HubSpot, evitando duplicados cuando cambia el email.',
    stack: 'HubSpot API · OAuth · Node.js',
    Icon: PlugsConnected,
  },
  {
    title: 'Web de MAASTAC',
    tag: 'Proyecto propio',
    text: 'Esta web: páginas prerenderizadas para buscadores, formulario conectado y medición de conversiones con GA4 y Meta Pixel sujeta a consentimiento.',
    stack: 'React · TypeScript · Vite · Vercel',
    Icon: Browsers,
  },
];

export const FOUNDER = {
  name: 'Mario Astonitas',
  role: 'CEO · Ing. de Software',
  bio: 'Estratega técnico con foco en automatización, integraciones y desarrollo web. Diseña y construye las soluciones que implementa MAASTAC.',
  photo: '/team/mario-astonitas.jpg',
  tags: ['Automatización', 'Integraciones', 'Desarrollo web'],
};

export const LEAD_AI_CAPABILITIES: { title: string; text: string; Icon: Icon }[] = [
  {
    title: 'Formularios de calificación',
    text: 'Crea formularios con tus propias preguntas y puntos. Cada respuesta genera un lead con una puntuación de 0 a 100, y el formulario se comparte con un enlace público.',
    Icon: ListChecks,
  },
  {
    title: 'Asistente de chat con IA',
    text: 'Un chat público conversa con el interesado, le hace las preguntas de calificación y registra el lead cuando obtiene su email.',
    Icon: ChatCircleDots,
  },
  {
    title: 'Panel de leads',
    text: 'Todos tus leads en un solo lugar, con búsqueda, filtros y acceso a la conversación que originó cada uno.',
    Icon: AddressBook,
  },
  {
    title: 'Integración con HubSpot',
    text: 'Conecta tu cuenta de HubSpot y envía o actualiza cada lead como contacto en tu CRM.',
    Icon: PlugsConnected,
  },
  {
    title: 'Trabajo en equipo',
    text: 'Invita a tu equipo y asigna roles para trabajar los leads de forma ordenada.',
    Icon: Stack,
  },
];

export const LEAD_AI_STEPS = [
  { title: 'Capta', text: 'Mediante un formulario o un chat con IA.' },
  { title: 'Califica', text: 'Con preguntas clave y una puntuación de 0 a 100.' },
  { title: 'Gestiona', text: 'En el panel de leads y en HubSpot.' },
];

/** Aviso obligatorio (decisión interna): Lead AI es independiente de los servicios de la agencia. */
export const LEAD_AI_NOTICE =
  'Lead AI es independiente de los servicios de MAASTAC Agency: contratar un servicio no incluye su uso ni su licencia. Su disponibilidad y sus condiciones se informan por consulta.';
