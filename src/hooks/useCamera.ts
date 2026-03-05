import { useState, useEffect, useRef, useCallback } from 'react';
import { isValidCardUrl } from '@/lib/index';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isScanning: boolean;
  error: string | null;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  hasPermission: boolean;
}

interface BarcodeDetectorPolyfill {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
}

declare global {
  interface Window {
    BarcodeDetector?: {
      new (): BarcodeDetectorPolyfill;
    };
  }
}

let jsQR: any = null;

const loadJsQR = async () => {
  if (jsQR) return jsQR;
  try {
    // Dynamic import with proper typing
    const jsQRModule = await import('jsqr');
    jsQR = jsQRModule.default;
    return jsQR;
  } catch (err) {
    console.error('Failed to load jsQR:', err);
    return null;
  }
};

export const useCamera = (onScan: (url: string) => void): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const barcodeDetectorRef = useRef<BarcodeDetectorPolyfill | null>(null);

  const stopScanning = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  }, []);

  const scanWithBarcodeDetector = useCallback(async () => {
    if (!videoRef.current || !barcodeDetectorRef.current) return;

    try {
      const barcodes = await barcodeDetectorRef.current.detect(videoRef.current);
      if (barcodes.length > 0) {
        const url = barcodes[0].rawValue;
        if (isValidCardUrl(url)) {
          stopScanning();
          onScan(url);
          return;
        }
      }
    } catch (err) {
      console.error('BarcodeDetector error:', err);
    }

    animationFrameRef.current = requestAnimationFrame(scanWithBarcodeDetector);
  }, [onScan, stopScanning]);

  const scanWithJsQR = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanWithJsQR);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrLib = await loadJsQR();

    if (qrLib) {
      const code = qrLib(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        const url = code.data;
        if (isValidCardUrl(url)) {
          stopScanning();
          onScan(url);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanWithJsQR);
  }, [onScan, stopScanning]);

  const startScanning = useCallback(async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsScanning(true);

      if (window.BarcodeDetector) {
        try {
          barcodeDetectorRef.current = new window.BarcodeDetector();
          scanWithBarcodeDetector();
        } catch (err) {
          console.error('BarcodeDetector initialization failed:', err);
          if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
          }
          scanWithJsQR();
        }
      } else {
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        scanWithJsQR();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera access denied';
      setError(errorMessage);
      setHasPermission(false);
      setIsScanning(false);
    }
  }, [scanWithBarcodeDetector, scanWithJsQR]);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    videoRef,
    isScanning,
    error,
    startScanning,
    stopScanning,
    hasPermission,
  };
};
