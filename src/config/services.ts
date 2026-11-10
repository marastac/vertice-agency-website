// src/config/services.ts — Los 7 servicios de MAASTAC Agency (fuente única para la web).
//
// Fuente de verdad: el catálogo interno de servicios (no publicado).
// Reglas:
//   - Sin precios ni rangos (son referencias internas, no se publican).
//   - Sin clientes, testimonios, métricas ni promesas de resultados.
//   - Los productos propios (p. ej. Lead AI) NO son servicios: se presentan aparte.
//   - El alcance concreto de cada proyecto se define en la propuesta.
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import { Code, Robot, Brain, AddressBook, PlugsConnected, ChatCircleDots, Browsers } from 'phosphor-react';

export type ServiceId =
  | 'custom_software'
  | 'process_automation'
  | 'ai_solutions'
  | 'internal_systems_crm'
  | 'integrations_api'
  | 'business_chatbots'
  | 'business_web';

/** Página de servicio a la que pertenece cada servicio (ver src/content/areas.ts). */
export type ServiceAreaId = 'software' | 'automatizacion' | 'integraciones';

export interface Service {
  /** Valor estable: se usa en el formulario ("¿Qué necesitas?"), en Formspree y en la analítica. NO cambiar. */
  id: ServiceId;
  area: ServiceAreaId;
  name: string;
  tagline: string;
  problem: string;
  includes: string[];
  /** Aclaración visible cuando el servicio tiene modalidades distintas (p. ej. IA). */
  note?: string;
  Icon: ComponentType<IconProps>;
  gradient: string;
}

export const SERVICES: Service[] = [
  {
    id: 'custom_software',
    area: 'software',
    name: 'Desarrollo de software a medida',
    tagline: 'Aplicaciones hechas para tu forma de trabajar',
    problem: 'Procesos en hojas de cálculo, papel o herramientas que no encajan, con errores y poco control.',
    includes: ['Levantamiento de requisitos', 'Aplicación web con usuarios y roles', 'Pruebas, despliegue y documentación'],
    Icon: Code,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'process_automation',
    area: 'automatizacion',
    name: 'Automatización de procesos',
    tagline: 'Menos trabajo manual y repetitivo',
    problem: 'Horas perdidas en tareas manuales, errores al transcribir y seguimientos olvidados.',
    includes: ['Mapeo del proceso actual', 'Flujos automatizados (no-code o código)', 'Pruebas con casos reales'],
    Icon: Robot,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ai_solutions',
    area: 'automatizacion',
    name: 'Soluciones con inteligencia artificial',
    tagline: 'IA aplicada a tareas concretas',
    problem: 'Revisión manual de información que no escala y tiempos de respuesta largos.',
    includes: ['Evaluación del caso y de los datos', 'Prototipo o implementación en producción', 'Proveedor de IA elegido tras evaluar'],
    note: 'Un prototipo valida la viabilidad; la implementación en producción es un servicio distinto.',
    Icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'internal_systems_crm',
    area: 'integraciones',
    name: 'Sistemas internos y CRM',
    tagline: 'Información comercial y operativa ordenada',
    problem: 'Pipeline comercial sin visibilidad, información dispersa y dependencia de una sola persona.',
    includes: ['Configuración de un CRM existente', 'Sistemas internos con paneles y reportes', 'Importación inicial de datos'],
    Icon: AddressBook,
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'integrations_api',
    area: 'integraciones',
    name: 'Integraciones y API',
    tagline: 'Tus herramientas compartiendo datos',
    problem: 'Doble digitación, datos inconsistentes y procesos que dependen de copiar y pegar.',
    includes: ['Análisis de las APIs disponibles', 'Desarrollo de la integración', 'Registro de errores y documentación'],
    Icon: PlugsConnected,
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    id: 'business_chatbots',
    area: 'automatizacion',
    name: 'Chatbots empresariales',
    tagline: 'Atención inicial ordenada en tus canales',
    problem: 'Respuestas lentas, consultas perdidas fuera de horario y personal saturado con preguntas frecuentes.',
    includes: ['Diseño de la conversación', 'Bot de reglas o asistente con IA', 'Derivación a una persona'],
    Icon: ChatCircleDots,
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'business_web',
    area: 'software',
    name: 'Desarrollo web empresarial',
    tagline: 'Presencia profesional y un canal medible',
    problem: 'Falta de presencia profesional y de un canal de captación que se pueda medir.',
    includes: ['Diseño adaptado a tu marca', 'Desarrollo responsive y SEO técnico básico', 'Formulario, WhatsApp y analítica con consentimiento'],
    Icon: Browsers,
    gradient: 'from-green-500 to-emerald-500',
  },
];
