"use client";

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useTranslations } from 'next-intl';

interface QRCodeGeneratorProps {
  url: string;
}

export function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  const t = useTranslations('admin');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (showQR && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2D3748', // neutral-dark
          light: '#FFFFFF',
        },
      });
    }
  }, [showQR, url]);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowQR(!showQR)}
        className="w-full px-6 py-3 bg-baby-blue text-neutral-dark font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        {showQR ? t('hideQRCode') : t('showQRCode')}
      </button>

      {showQR && (
        <div className="bg-white rounded-2xl p-6 border-2 border-baby-blue/20 text-center space-y-4">
          <h3 className="text-lg font-bold text-neutral-dark">
            {t('scanToMakePrediction')}
          </h3>
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="border-4 border-baby-cream rounded-lg" />
          </div>
          <p className="text-sm text-neutral-medium">
            {url}
          </p>
        </div>
      )}
    </div>
  );
}
