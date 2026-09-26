import React, { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Sliders, 
  Bell, 
  Lock, 
  CheckCircle2, 
  Save, 
  Cpu 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AdminSettingsPage: React.FC = () => {
  const { logAction } = usePlatform();

  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    criticalDensityThreshold: 85,
    warningDensityThreshold: 65,
    maxInflowSurgePerMin: 180,
    opticalFlowVelocityCutoff: 0.35,
    autoDispatchThresholdScore: 80,
    soundAlertsEnabled: true,
    yoloInferenceModel: 'yolov8x-crowd-dense-v2.pt',
    sessionTimeoutMinutes: 60,
    publicBroadcastGateAlerts: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logAction('PLATFORM_SETTINGS_UPDATED', 'GLOBAL_CONFIG', 'Admin updated platform safety thresholds and inference parameters');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              Master Configuration
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              Root Admin Access
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Platform &amp; Stampede Risk Engine Parameters
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure mathematical density triggers, YOLOv8 model inference hyperparameters, and automated dispatch thresholds.
          </p>
        </div>

        {saved && (
          <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved &amp; synchronized across edge nodes!</span>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Risk Thresholds Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <Sliders className="w-4 h-4 text-[#2563EB]" />
            <h2 className="font-bold text-sm text-[#0F172A]">Stampede Risk Index (SRI) Calibration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Critical Density Threshold (% of Capacity)
              </label>
              <input
                type="number"
                value={settings.criticalDensityThreshold}
                onChange={(e) => setSettings({ ...settings, criticalDensityThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Default 85%. Triggers red alert when breached.</span>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Warning Density Threshold (% of Capacity)
              </label>
              <input
                type="number"
                value={settings.warningDensityThreshold}
                onChange={(e) => setSettings({ ...settings, warningDensityThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Default 65%. Triggers yellow advisory.</span>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Maximum Inflow Surge (Persons / Min / Gate)
              </label>
              <input
                type="number"
                value={settings.maxInflowSurgePerMin}
                onChange={(e) => setSettings({ ...settings, maxInflowSurgePerMin: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Turnstile choke limit. Breaches trigger diversion alerts.</span>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Minimum Egress Optical Velocity (m/s)
              </label>
              <input
                type="number"
                step="0.05"
                value={settings.opticalFlowVelocityCutoff}
                onChange={(e) => setSettings({ ...settings, opticalFlowVelocityCutoff: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Deceleration below 0.35 m/s indicates standing crush risk.</span>
            </div>
          </div>
        </div>

        {/* AI & Edge Vision Inference Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <Cpu className="w-4 h-4 text-[#7C3AED]" />
            <h2 className="font-bold text-sm text-[#0F172A]">AI Vision Engine &amp; DeepSORT Weights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Computer Vision Model Checkpoint
              </label>
              <select
                value={settings.yoloInferenceModel}
                onChange={(e) => setSettings({ ...settings, yoloInferenceModel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-mono"
              >
                <option value="yolov8x-crowd-dense-v2.pt">yolov8x-crowd-dense-v2.pt (High Accuracy, 30 FPS)</option>
                <option value="yolov8m-crowd-fast.pt">yolov8m-crowd-fast.pt (Edge Optimized, 60 FPS)</option>
                <option value="yolov9-crowd-experimental.pt">yolov9-crowd-experimental.pt (Research Stage)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Auto-Dispatch SRI Threshold Score
              </label>
              <input
                type="number"
                value={settings.autoDispatchThresholdScore}
                onChange={(e) => setSettings({ ...settings, autoDispatchThresholdScore: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Scores above 80/100 notify field squad Delta automatically.</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundAlertsEnabled}
                onChange={(e) => setSettings({ ...settings, soundAlertsEnabled: e.target.checked })}
                className="rounded text-[#2563EB]"
              />
              <span className="font-semibold text-[#0F172A]">Enable Real-Time Web Audio Klaxon Chimes for Critical Alerts</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.publicBroadcastGateAlerts}
                onChange={(e) => setSettings({ ...settings, publicBroadcastGateAlerts: e.target.checked })}
                className="rounded text-[#2563EB]"
              />
              <span className="font-semibold text-[#0F172A]">Broadcast Gate Redirection Advisories directly to Attendee Digital Passes</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save &amp; Deploy Global Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
