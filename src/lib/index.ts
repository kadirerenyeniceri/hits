export const ROUTE_PATHS = {
  HOME: '/',
  SCAN: '/scan',
  CARD_REDIRECT: '/c/:id',
  PLAY: '/play/:id',
} as const;

export interface Card {
  id: string;
  youtubeId: string;
  title?: string;
}

export const CARD_DATA: Record<string, Card> = {
  '1': { id: '1', youtubeId: 'dQw4w9WgXcQ', title: 'Card 1' },
  '2': { id: '2', youtubeId: 'kJQP7kiw5Fk', title: 'Card 2' },
  '3': { id: '3', youtubeId: '60ItHLz5WEA', title: 'Card 3' },
  '142': { id: '142', youtubeId: 'dQw4w9WgXcQ', title: 'Card 142' },
};

export const extractCardId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/c\/(\d+)/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
};

export const getCardById = (id: string): Card | null => {
  return CARD_DATA[id] || null;
};

export const isValidCardUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/c/');
  } catch {
    return false;
  }
};
