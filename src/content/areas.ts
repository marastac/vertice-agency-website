// src/content/areas.ts — Contenido de las tres páginas de servicio (landing pages para SEO y campañas).
//
// Reglas (igual que src/config/services.ts):
//   - Sin precios, clientes, testimonios, métricas ni promesas de resultados.
//   - Coherente con el catálogo interno de servicios (qué incluye y qué no).
//   - El alcance concreto de cada proyecto se define en la propuesta.
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import { Code, Robot, PlugsConnected } from 'phosphor-react';
import type { ServiceAreaId } from '../config/services';
import type { Interest } from '../utils/contactIntent';

export interface TextItem {
  title: string;
  text: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface AreaContent {
  id: ServiceAreaId;
  path: string;
  /** Nombre corto para navegación, migas de pan y tarjetas. */
  name: string;
  /** Resumen de una línea para tarjetas y menú. */
  summary: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  lead: string;
  ctaLabel: string;
  /** Interés preseleccionado en el formulario de esta página (valores estables de contactIntent). */
  defaultInterest: Interest;
  audience: string[];
  problems: TextItem[];
  deliverables: string[];
  useCases: string[];
  faqs: Faq[];
  Icon: ComponentType<IconProps>;
}

export const AREAS: AreaContent[] = [
  {
    id: 'software',
    path: '/software/a-medida',
    name: 'Software a medida',
    summary: 'Aplicaciones web, plataformas internas y webs empresariales hechas para tu forma de trabajar.',
    seoTitle: 'Desarrollo de software a medida para empresas en Perú | MAASTAC',
    seoDescription:
      'Desarrollamos aplicaciones web, plataformas internas, portales y webs empresariales a medida. Alcance claro antes de empezar y evaluación inicial gratuita.',
    eyebrow: 'Software a medida',
    title: 'Software a medida que se adapta',
    titleHighlight: 'a cómo trabaja tu empresa',
    lead:
      'Desarrollamos aplicaciones web, plataformas internas y portales para clientes o proveedores cuando las hojas de cálculo o las herramientas genéricas ya no alcanzan.',
    ctaLabel: 'Consultar mi proyecto',
    defaultInterest: 'custom_software',
    audience: [
      'Empresas con un proceso propio que ningún software comercial cubre bien.',
      'Equipos que gestionan operaciones, reservas o inventarios en hojas de cálculo.',
      'Negocios que necesitan un portal para sus clientes o proveedores.',
      'Empresas sin web, o con una web que no genera contactos.',
    ],
    problems: [
      {
        title: 'Información repartida en Excel y correos',
        text: 'Varias versiones del mismo archivo, datos que no coinciden y nadie sabe cuál es la última.',
      },
      {
        title: 'Herramientas que no encajan',
        text: 'Pagas un software genérico, pero tu equipo sigue haciendo parte del trabajo por fuera.',
      },
      {
        title: 'Poco control del proceso',
        text: 'Saber en qué estado está cada pedido, reserva o solicitud exige preguntarle a alguien.',
      },
    ],
    deliverables: [
      'Levantamiento de requisitos y diseño funcional antes de programar.',
      'Aplicación web con usuarios, roles y permisos.',
      'Base de datos y paneles para consultar la información.',
      'Pruebas y despliegue en la infraestructura acordada.',
      'Documentación de uso y capacitación para tu equipo.',
    ],
    useCases: [
      'Gestión de operaciones y pedidos',
      'Reservas y agendas',
      'Inventarios con reglas propias',
      'Portales de clientes o proveedores',
      'Webs empresariales con formulario, WhatsApp y medición',
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta un software a medida?',
        a: 'Depende del alcance: pantallas, usuarios, integraciones y reglas de negocio. Tras la evaluación inicial te enviamos una propuesta con alcance, plazos y costo antes de empezar.',
      },
      {
        q: '¿Cuánto tarda el desarrollo?',
        a: 'El plazo se define en la propuesta según el alcance. Trabajamos con entregas parciales que puedes revisar, en lugar de un único lanzamiento al final.',
      },
      {
        q: '¿Hacen aplicaciones móviles nativas?',
        a: 'Nuestro foco son aplicaciones web que funcionan bien en el móvil. Las apps nativas se evalúan y se cotizan aparte.',
      },
      {
        q: '¿Quién es dueño del código?',
        a: 'Las condiciones de propiedad intelectual y de entrega del código fuente se acuerdan por escrito antes de empezar el proyecto.',
      },
      {
        q: '¿Qué pasa después de la entrega?',
        a: 'Podemos acordar un servicio de soporte y mantenimiento para correcciones, actualizaciones y mejoras.',
      },
    ],
    Icon: Code,
  },
  {
    id: 'automatizacion',
    path: '/automatizacion-ia',
    name: 'Automatización e IA',
    summary: 'Flujos que eliminan tareas repetitivas e inteligencia artificial aplicada a tareas concretas.',
    seoTitle: 'Automatización de procesos e inteligencia artificial para empresas | MAASTAC',
    seoDescription:
      'Automatizamos tareas repetitivas y aplicamos IA a casos concretos: clasificar, resumir, extraer datos y atender consultas con chatbots. Evaluación inicial gratuita.',
    eyebrow: 'Automatización e IA',
    title: 'Menos trabajo manual,',
    titleHighlight: 'IA donde realmente aporta',
    lead:
      'Diseñamos flujos que eliminan tareas repetitivas —copiar datos, enviar recordatorios, preparar reportes— y aplicamos inteligencia artificial y chatbots a tareas concretas, con supervisión humana donde hace falta.',
    ctaLabel: 'Hablar sobre automatización',
    defaultInterest: 'process_automation',
    audience: [
      'Pymes con tareas repetitivas entre varias herramientas.',
      'Equipos que reciben muchas consultas por la web o por WhatsApp.',
      'Empresas con muchos correos, documentos o formularios por revisar.',
      'Áreas comerciales que pierden seguimientos.',
    ],
    problems: [
      {
        title: 'Horas en tareas repetitivas',
        text: 'Copiar datos de un sistema a otro, preparar reportes o enviar recordatorios uno por uno.',
      },
      {
        title: 'Errores al transcribir',
        text: 'Cada paso manual es una oportunidad de equivocarse, y los errores se descubren tarde.',
      },
      {
        title: 'Consultas sin respuesta a tiempo',
        text: 'Mensajes que llegan fuera de horario y un equipo saturado con preguntas frecuentes.',
      },
    ],
    deliverables: [
      'Mapeo del proceso actual y diseño del flujo automatizado.',
      'Implementación con herramientas no-code/low-code o con código propio, según convenga.',
      'Manejo de errores y pruebas con casos reales.',
      'Prototipo de IA para validar la viabilidad antes de invertir en producción.',
      'Chatbot de reglas o asistente con IA, con derivación a una persona.',
      'Guía de operación y capacitación.',
    ],
    useCases: [
      'Seguimiento automático de prospectos y recordatorios',
      'Reportes periódicos sin trabajo manual',
      'Clasificar y resumir correos o solicitudes',
      'Extraer datos de documentos y formularios',
      'Atención inicial en la web o en WhatsApp',
    ],
    faqs: [
      {
        q: '¿Qué procesos conviene automatizar primero?',
        a: 'Los repetitivos, frecuentes y con reglas claras. En la evaluación inicial identificamos cuáles ahorran más tiempo con menos riesgo.',
      },
      {
        q: '¿La IA reemplaza a mi equipo?',
        a: 'No es el objetivo. La usamos para tareas concretas, como clasificar, resumir o responder preguntas frecuentes, y mantenemos la supervisión humana en las decisiones sensibles.',
      },
      {
        q: '¿Qué diferencia hay entre un prototipo de IA y una implementación?',
        a: 'El prototipo comprueba en un entorno de pruebas si la IA resuelve tu caso e incluye un informe con los aciertos y errores observados. La implementación en producción es un servicio distinto, que se decide después.',
      },
      {
        q: '¿Qué herramientas o proveedores de IA usan?',
        a: 'Elegimos la herramienta o el proveedor de IA después de evaluar tu caso, tus datos y los costos. Las licencias y el consumo de servicios de terceros se detallan por separado.',
      },
      {
        q: '¿Pueden conectar un chatbot a WhatsApp?',
        a: 'Sí, evaluamos la opción adecuada para tu caso. La API de WhatsApp Business tiene costos y requisitos de Meta que se detallan por separado.',
      },
    ],
    Icon: Robot,
  },
  {
    id: 'integraciones',
    path: '/sistemas-integraciones',
    name: 'Sistemas e integraciones',
    summary: 'Herramientas conectadas mediante APIs, y CRM o sistemas internos con la información ordenada.',
    seoTitle: 'Integraciones, APIs y sistemas internos (CRM) para empresas | MAASTAC',
    seoDescription:
      'Conectamos tu web, CRM, hojas de cálculo y otras herramientas mediante APIs, y configuramos o desarrollamos sistemas internos para ordenar tu información comercial.',
    eyebrow: 'Sistemas e integraciones',
    title: 'Conecta tus herramientas y',
    titleHighlight: 'ordena la información de tu negocio',
    lead:
      'Integramos las aplicaciones que ya usas para que compartan datos sin copiar y pegar, y configuramos o desarrollamos sistemas internos y CRM para que tu equipo trabaje sobre una sola fuente de información.',
    ctaLabel: 'Solicitar una propuesta',
    defaultInterest: 'integrations_api',
    audience: [
      'Empresas que usan varias herramientas que no se comunican entre sí.',
      'Equipos comerciales que gestionan clientes en Excel, WhatsApp o cuadernos.',
      'Negocios donde solo una persona sabe en qué estado están las ventas.',
      'Empresas que quieren conectar su web con su CRM.',
    ],
    problems: [
      {
        title: 'Doble digitación',
        text: 'El mismo dato se escribe en la web, en el CRM y en una hoja de cálculo.',
      },
      {
        title: 'Datos que no coinciden',
        text: 'Cada herramienta tiene una versión distinta del cliente o del pedido.',
      },
      {
        title: 'Sin visibilidad comercial',
        text: 'No hay un lugar único para ver oportunidades, seguimientos y responsables.',
      },
    ],
    deliverables: [
      'Análisis de las APIs y accesos disponibles.',
      'Diseño del flujo de datos: dirección, frecuencia y correspondencia de campos.',
      'Desarrollo de la integración con registro de errores.',
      'Configuración de un CRM existente o desarrollo de un sistema interno a medida.',
      'Importación inicial de datos acordada.',
      'Documentación y capacitación.',
    ],
    useCases: [
      'Formulario web conectado al CRM',
      'CRM sincronizado con hojas de cálculo o ERP',
      'Paneles y reportes comerciales',
      'Sincronización de contactos y pedidos',
      'Etapas, campos y usuarios configurados en tu CRM',
    ],
    faqs: [
      {
        q: '¿Pueden integrar cualquier sistema?',
        a: 'Solo si el sistema tiene una API o un acceso documentado. Si no lo tiene, lo evaluamos aparte antes de comprometer un alcance.',
      },
      {
        q: '¿Configuran un CRM existente o desarrollan uno propio?',
        a: 'Las dos cosas: configuramos un CRM comercial (etapas, campos, usuarios e importación inicial) o desarrollamos un sistema interno a medida cuando ninguno encaja.',
      },
      {
        q: '¿Con qué herramientas han trabajado?',
        a: 'Desarrollamos la integración de nuestro producto Lead AI con HubSpot mediante OAuth. Para otras herramientas revisamos su API durante la evaluación inicial.',
      },
      {
        q: '¿Quién paga las licencias de las herramientas?',
        a: 'Las licencias o planes de pago de las herramientas y de sus APIs corresponden al cliente y se detallan por separado en la propuesta.',
      },
    ],
    Icon: PlugsConnected,
  },
];

export const findArea = (id: ServiceAreaId): AreaContent => {
  const area = AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Área desconocida: ${id}`);
  return area;
};
