
import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { CloseIcon } from './Icons';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!isOpen) {
        // cleanup if closed
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        return;
    }

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setError(null);
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready to play to avoid "The play() request was interrupted" error
          videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
          videoRef.current.play();
          requestRef.current = requestAnimationFrame(tick);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please ensure you have granted permission.");
      }
    };

    startCamera();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (canvas) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Attempt to find QR code
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    onScan(code.data);
                    return; // Stop scanning on success
                }
            }
        }
    }
    requestRef.current = requestAnimationFrame(tick);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10 hover:bg-white/20"
      >
        <CloseIcon className="h-8 w-8" />
      </button>

      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
        {error ? (
          <div className="text-white text-center p-4">
            <p className="text-xl mb-2">Camera Error</p>
            <p className="text-gray-300">{error}</p>
          </div>
        ) : (
          <>
            <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                muted // Mute just in case
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanner Overlay */}
            <div className="relative z-10 w-64 h-64 border-2 border-primary/50 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]">
               {/* Corners */}
               <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-sm"></div>
               <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-sm"></div>
               <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-sm"></div>
               <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-sm"></div>
               
               {/* Scanning Line Animation */}
               <div className="absolute w-full h-8 bg-gradient-to-b from-primary/50 to-transparent animate-scan top-0 left-0">
                  <div className="w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.8)]"></div>
               </div>
            </div>
            
            <p className="relative z-10 text-white mt-8 font-sans text-lg bg-black/60 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                Point camera at a QR code
            </p>
          </>
        )}
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default QRScannerModal;
