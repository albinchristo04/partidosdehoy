import type { NormalizedMatch } from './types';
import { applyOffset, TZ_OFFSETS } from './timezones';
import { SITE_URL } from './config';

export interface FaqItem {
  question: string;
  answer: string;
}

export function matchFaq(m: NormalizedMatch): FaqItem[] {
  const timeEs = applyOffset(m.timeUtc, TZ_OFFSETS.es.offset);
  const timeMx = applyOffset(m.timeUtc, TZ_OFFSETS.mx.offset);
  const timeCo = applyOffset(m.timeUtc, TZ_OFFSETS.co.offset);
  const n = m.channels.length;
  const labelList = m.channels.map((c) => c.label).join(', ');
  const hasSpanish = m.channels.some((c) => c.langCode === 'es' || c.langCode === 'ar');
  const spanishChannels = m.channels.filter((c) => c.langCode === 'es' || c.langCode === 'ar').map((c) => c.label).join(', ');

  const faqs: FaqItem[] = [
    {
      question: `¿Dónde mirar ${m.team1} contra ${m.team2}?`,
      answer: `Puedes ver ${m.team1} vs ${m.team2} en vivo gratis en Pirlo TV (partidosdehoy.live). El partido comienza a las ${timeEs} hora España (${timeMx} CDMX). Disponible en ${n} canales.`,
    },
    {
      question: `¿A qué hora juega ${m.team1} hoy?`,
      answer: `${m.team1} juega a las ${timeEs} hora España (${timeMx} hora México, ${timeCo} hora Colombia) contra ${m.team2} por ${m.league}.`,
    },
    {
      question: `¿En qué canal se transmite ${m.team1} vs ${m.team2}?`,
      answer: `El partido está disponible en ${n} canales: ${labelList}. Ver gratis en Pirlo TV.`,
    },
  ];

  if (hasSpanish) {
    faqs.push({
      question: `¿Hay canales en español para ver ${m.team1} vs ${m.team2}?`,
      answer: `Sí, el partido está disponible en ${spanishChannels}. Ver en español gratis en Pirlo TV.`,
    });
  }

  return faqs;
}

export function hubFaq(sport: string, matches: NormalizedMatch[]): FaqItem[] {
  const matchList = matches.slice(0, 3).map((m) => `${m.team1} vs ${m.team2}`).join(', ');
  return [
    {
      question: `¿Dónde ver ${sport} en vivo?`,
      answer: `Ver ${sport} en vivo gratis en Pirlo TV (partidosdehoy.live). Hoy hay ${matches.length} partidos disponibles: ${matchList}...`,
    },
    {
      question: `¿Qué partidos hay hoy de ${sport}?`,
      answer: `Hoy hay ${matches.length} partidos de ${sport}: ${matchList}. Todos disponibles en directo gratis en Pirlo TV.`,
    },
  ];
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
