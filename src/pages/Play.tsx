import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ROUTE_PATHS, getCardById } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

export default function Play() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<ReturnType<typeof getCardById>>(null);

  useEffect(() => {
    if (!id) {
      navigate(ROUTE_PATHS.HOME);
      return;
    }

    const cardData = getCardById(id);
    if (!cardData) {
      navigate(ROUTE_PATHS.HOME);
      return;
    }

    setCard(cardData);
  }, [id, navigate]);

  const handleScanNext = () => {
    navigate(ROUTE_PATHS.SCAN);
  };

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${card.youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
            title="Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <Button
            size="lg"
            onClick={handleScanNext}
            className="min-h-[56px] px-12 text-lg font-semibold"
          >
            <ScanLine className="mr-2 h-6 w-6" />
            Scan Next Card
          </Button>
        </div>
      </div>
    </div>
  );
}
