"use client";

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
}

export function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
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

  const downloadQR = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'leonardo-prediction-qr.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowQR(!showQR)}
        className="w-full px-6 py-3 bg-baby-blue text-neutral-dark font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        {showQR ? '🔼 Hide QR Code' : '📱 Show QR Code'}
      </button>

      {showQR && (
        <div className="bg-white rounded-2xl p-6 border-2 border-baby-blue/20 text-center space-y-4">
          <h3 className="text-lg font-bold text-neutral-dark">
            Scan to Make a Prediction
          </h3>
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="border-4 border-baby-cream rounded-lg" />
          </div>
          <p className="text-sm text-neutral-medium">
            {url}
          </p>
          <button
            onClick={downloadQR}
            className="px-4 py-2 bg-baby-mint text-neutral-dark font-semibold rounded-lg hover:shadow-md transition-all duration-200"
          >
            💾 Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}
