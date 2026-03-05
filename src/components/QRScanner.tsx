import { useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { motion } from 'framer-motion';
import { Camera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScan: (url: string) => void;
  onError: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const { videoRef, isScanning, error, startScanning, stopScanning, hasPermission } = useCamera(onScan);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, [startScanning, stopScanning]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background">
      {error && !hasPermission ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto px-4"
        >
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="ml-2">
              {error.includes('denied') || error.includes('permission')
                ? 'Camera access denied. Please enable camera permissions in your browser settings.'
                : error}
            </AlertDescription>
          </Alert>
          <Button
            onClick={startScanning}
            className="w-full"
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Try Again
          </Button>
        </motion.div>
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-64 h-64"
            >
              <div className="absolute inset-0 border-4 border-accent rounded-2xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
              </div>

              <motion.div
                className="absolute inset-x-0 top-0 h-1 bg-primary"
                animate={{
                  y: [0, 256, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 to-transparent p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
                <p className="text-foreground font-medium">Scanning for QR code...</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Position the QR code within the frame
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}