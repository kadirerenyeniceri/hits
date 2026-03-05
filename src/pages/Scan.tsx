import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScanner } from '@/components/QRScanner';
import { extractCardId, isValidCardUrl } from '@/lib/index';
import { motion } from 'framer-motion';
import { Camera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Scan() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setIsScanning(true);
  }, []);

  const handleScan = (url: string) => {
    if (isValidCardUrl(url)) {
      const cardId = extractCardId(url);
      if (cardId) {
        navigate(`/c/${cardId}`);
      } else {
        setError('Invalid card QR code format');
      }
    } else {
      setError('QR code does not point to a valid card URL');
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >
        <div className="p-6 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <Camera className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Scan Card</h1>
          </motion.div>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-muted-foreground"
          >
            Point your camera at the QR code on your card
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 mb-4"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex-1 px-6 pb-6"
        >
          {isScanning && (
            <QRScanner onScan={handleScan} onError={handleError} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
