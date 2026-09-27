import React, { useState, useEffect } from 'react';
import { mobileCctvService, MobileCameraNode } from '../../services/mobileCctvService';
import { Smartphone, QrCode, Wifi, WifiOff, Copy, Check, ExternalLink, RefreshCw, X, Eye, Activity, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateMobileCamera?: (camId: string) => void;
}

export function MobileCctvHubModal({ isOpen, onClose, onNavigateMobileCamera }: Props) {
  const [cameras, setCameras] = useState<MobileCameraNode[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = mobileCctvService.subscribe((list) => {
      setCameras([...list]);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (camId: string) => {
    const origin = window.location.origin + window.location.pathname;
    const url = `${origin}#/mobile-camera?camId=${camId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(camId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getQrUrl = (camId: string) => {
    const origin = window.location.origin + window.location.pathname;
    const targetUrl = encodeURIComponent(`${origin}#/mobile-camera?camId=${camId}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${targetUrl}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0F172A] border border-[#334155] rounded-3xl max-w-5xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1E293B] bg-[#1E293B]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#3B82F6]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white font-mono">
                  4x Mobile Phone CCTV Camera Hub
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded-md">
                  4 SLOTS READY
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Connect up to 4 mobile phones as live CCTV cameras with AI body person detection.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Camera Slots Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {cameras.map((cam, idx) => {
            const isOnline = cam.status === 'ONLINE';
            const qrCodeUrl = getQrUrl(cam.id);
            const directUrl = `${window.location.origin}${window.location.pathname}#/mobile-camera?camId=${cam.id}`;

            return (
              <div
                key={cam.id}
                className={`bg-[#1E293B] border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition ${
                  isOnline ? 'border-[#10B981]/60 shadow-lg shadow-emerald-500/10' : 'border-[#334155]'
                }`}
              >
                {/* Slot Title Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#334155] font-mono font-bold text-xs flex items-center justify-center text-[#3B82F6]">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">{cam.id}: {cam.name}</h3>
                      <p className="text-[11px] text-[#94A3B8] font-mono">{cam.location}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5">
                    {isOnline ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-extrabold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                        <Wifi className="w-3 h-3 animate-pulse" /> ONLINE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#334155]/60 text-[#94A3B8]">
                        <WifiOff className="w-3 h-3" /> OFFLINE
                      </span>
                    )}
                  </div>
                </div>

                {/* Video Feed / QR Pairing Box */}
                {isOnline && cam.frameData ? (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-[#334155]">
                    <img
                      src={cam.frameData}
                      alt={`Live Feed ${cam.id}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" /> LIVE TRANSMISSION
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1 rounded-md text-xs font-mono text-white font-bold">
                      {cam.peopleCount} Bodies Detected
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0F172A] border border-dashed border-[#334155] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={qrCodeUrl}
                      alt={`Scan QR Code for ${cam.id}`}
                      className="w-24 h-24 rounded-lg bg-white p-1"
                    />
                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <div className="text-xs font-bold text-white font-mono flex items-center justify-center sm:justify-start gap-1">
                        <QrCode className="w-3.5 h-3.5 text-[#3B82F6]" /> Scan with Phone Camera
                      </div>
                      <p className="text-[11px] text-[#94A3B8] font-mono leading-relaxed">
                        Open camera app on mobile phone & scan code to start live CCTV body counting.
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(cam.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-mono text-[#3B82F6] border border-[#334155] flex items-center gap-1 transition"
                        >
                          {copiedId === cam.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === cam.id ? 'Copied' : 'Copy URL'}
                        </button>

                        {onNavigateMobileCamera && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateMobileCamera(cam.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-mono text-white flex items-center gap-1 transition"
                          >
                            <ExternalLink className="w-3 h-3" /> Test in Browser
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Telemetry Metrics Bar */}
                <div className="bg-[#0F172A] rounded-xl p-3 border border-[#334155] flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block uppercase">Detected Bodies</span>
                    <span className="text-base font-extrabold text-[#00F0FF]">{cam.peopleCount} Bodies</span>
                  </div>


                  <div>
                    <span className="text-[#94A3B8] text-[10px] block uppercase">Density</span>
                    <span className="text-sm font-bold text-white">{cam.density}%</span>
                  </div>

                  <div>
                    <span className="text-[#94A3B8] text-[10px] block uppercase">FPS</span>
                    <span className="text-sm font-bold text-emerald-400">{cam.fps || 0}</span>
                  </div>

                  <div>
                    <span className="text-[#94A3B8] text-[10px] block uppercase">Device</span>
                    <span className="text-[11px] font-semibold text-[#CBD5E1] truncate max-w-[100px] block" title={cam.deviceInfo}>
                      {cam.deviceInfo}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#1E293B]/40 flex items-center justify-between text-xs font-mono">
          <div className="text-[#94A3B8] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            Real-time body tracking active across all 4 slots.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold cursor-pointer"
          >
            Done / Close Hub
          </button>
        </div>
      </div>
    </div>
  );
}
