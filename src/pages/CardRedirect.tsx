import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ROUTE_PATHS, CARD_DATA } from '@/lib/index';

export default function CardRedirect() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id && CARD_DATA[id]) {
      console.log(`Card ${id} detected, redirecting to play page`);
    }
  }, [id]);

  if (!id) {
    return <Navigate to={ROUTE_PATHS.HOME} replace />;
  }

  const card = CARD_DATA[id];
  if (!card) {
    return <Navigate to={ROUTE_PATHS.HOME} replace />;
  }

  const playPath = ROUTE_PATHS.PLAY.replace(':id', id);
  return <Navigate to={playPath} replace />;
}
