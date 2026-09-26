import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Zone, 
  SecurityTeam, 
  CameraFeed, 
  AlertItem, 
  EventSettings, 
  SimulationStage, 
  RiskFactorBreakdown,
  RiskLevel 
} from '../types';
import { 
  initialZones, 
  initialSecurityTeams, 
  initialCameraFeeds, 
  initialAlerts, 
  initialSettings, 
  computeRiskBreakdown 
} from '../data/initialData';

export interface ToastNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
}

interface SimulationContextType {
  zones: Zone[];
  selectedZone: Zone | null;
  selectedZoneId: string;
  securityTeams: SecurityTeam[];
  cameraFeeds: CameraFeed[];
  alerts: AlertItem[];
  settings: EventSettings;
  stage: SimulationStage;
  emergencyMode: boolean;
  isSimulating: boolean;
  soundEnabled: boolean;
  currentTime: string;
  toasts: ToastNotification[];
  riskBreakdown: RiskFactorBreakdown;
  recommendationApproved: boolean;
  recommendationDismissed: boolean;
  totalPeople: number;
  activeAlertsCount: number;
  highRiskZonesCount: number;
  averageDensity: number;
  responseTime: string;
  selectZone: (id: string) => void;
  startSurgeSimulation: () => void;
  dispatchSecurityTeam: (teamId: string, targetZoneId?: string) => void;
  redirectCrowd: (fromZoneId?: string, toZoneId?: string) => void;
  approveRecommendation: () => void;
  dismissRecommendation: () => void;
  acknowledgeAlert: (alertId: string) => void;
  toggleEmergencyMode: () => void;
  toggleSound: () => void;
  updateSettings: (newSettings: Partial<EventSettings>) => void;
  resetSimulation: () => void;
  dismissToast: (id: string) => void;
  playAlertSound: (severity: 'warning' | 'critical' | 'success') => void;
  // Admin & Data Ingestion Operations
  isAdminAuthenticated: boolean;
  loginAdmin: (email?: string, password?: string) => boolean;
  logoutAdmin: () => void;
  addAlert: (alert: Omit<AlertItem, 'id' | 'timestamp' | 'timeFormatted' | 'status'> & { status?: AlertItem['status'] }) => void;
  resolveAlert: (alertId: string) => void;
  deleteAlert: (alertId: string) => void;
  addSecurityTeam: (team: Omit<SecurityTeam, 'id'>) => void;
  updateSecurityTeam: (id: string, updates: Partial<SecurityTeam>) => void;
  deleteSecurityTeam: (id: string) => void;
  addCameraFeed: (camera: Omit<CameraFeed, 'id'>) => void;
  updateCameraFeed: (id: string, updates: Partial<CameraFeed>) => void;
  deleteCameraFeed: (id: string) => void;
  updateZone: (id: string, updates: Partial<Zone>) => void;
  addZone: (zone: Zone) => void;
  deleteZone: (id: string) => void;
  addToast: (type: ToastNotification['type'], title: string, message: string) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Web Audio API Sound Synthesizer for Zero-Dependency Audio
const playTone = (type: 'warning' | 'critical' | 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'critical') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'warning') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Ignore audio permission or context restrictions
  }
};

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('gate-b');
  const [securityTeams, setSecurityTeams] = useState<SecurityTeam[]>(initialSecurityTeams);
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>(initialCameraFeeds);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [settings, setSettings] = useState<EventSettings>(initialSettings);
  const [stage, setStage] = useState<SimulationStage>('NORMAL');
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [recommendationApproved, setRecommendationApproved] = useState<boolean>(false);
  const [recommendationDismissed, setRecommendationDismissed] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('09:45:00');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('crowdiq_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const simulationTimerRef = useRef<number | null>(null);
  const teamTimerRef = useRef<number | null>(null);

  const addToast = useCallback((type: ToastNotification['type'], title: string, message: string) => {
    const newToast: ToastNotification = {
      id: 'toast-' + Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
      timestamp: Date.now(),
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
  }, []);

  const loginAdmin = useCallback((_email?: string, _password?: string) => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('crowdiq_admin_logged_in', 'true');
    } catch {
      // Ignore
    }
    playTone('success');
    addToast('success', 'Admin Authenticated', 'Operational Control & Data Management Terminal Active.');
    return true;
  }, [addToast]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('crowdiq_admin_logged_in');
    } catch {
      // Ignore
    }
    addToast('info', 'Logged Out', 'Admin session terminated.');
  }, [addToast]);

  // Alerts Management CRUD
  const addAlert = useCallback((alertData: Omit<AlertItem, 'id' | 'timestamp' | 'timeFormatted' | 'status'> & { status?: AlertItem['status'] }) => {
    const newAlert: AlertItem = {
      ...alertData,
      id: 'alt-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: alertData.status || 'ACTIVE'
    };
    setAlerts(prev => [newAlert, ...prev]);
    if (newAlert.severity === 'CRITICAL') {
      playTone('critical');
    } else if (newAlert.severity === 'HIGH' || newAlert.severity === 'WARNING') {
      playTone('warning');
    }
    addToast(newAlert.severity === 'CRITICAL' ? 'error' : 'warning', `Incident Logged: ${newAlert.title}`, `${newAlert.zoneName} • ${newAlert.severity}`);
  }, [addToast]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED', actionTaken: a.actionTaken || 'Resolved by Incident Commander' } : a));
    addToast('success', 'Alert Resolved', 'Incident marked as resolved.');
  }, [addToast]);

  const deleteAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    addToast('info', 'Alert Deleted', 'Record removed from incident log.');
  }, [addToast]);

  // Security Teams Management CRUD
  const addSecurityTeam = useCallback((teamData: Omit<SecurityTeam, 'id'>) => {
    const newTeam: SecurityTeam = {
      ...teamData,
      id: 'team-' + Date.now()
    };
    setSecurityTeams(prev => [...prev, newTeam]);
    addToast('success', 'Squad Commissioned', `${newTeam.name} added under lead ${newTeam.leader}`);
  }, [addToast]);

  const updateSecurityTeam = useCallback((id: string, updates: Partial<SecurityTeam>) => {
    setSecurityTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    addToast('info', 'Squad Updated', 'Security team status and details synchronized.');
  }, [addToast]);

  const deleteSecurityTeam = useCallback((id: string) => {
    setSecurityTeams(prev => prev.filter(t => t.id !== id));
    addToast('info', 'Squad Decommissioned', 'Security squad removed.');
  }, [addToast]);

  // Camera Feeds Management CRUD
  const addCameraFeed = useCallback((camData: Omit<CameraFeed, 'id'>) => {
    const newCam: CameraFeed = {
      ...camData,
      id: 'cam-' + Date.now()
    };
    setCameraFeeds(prev => [...prev, newCam]);
    addToast('success', 'Camera Feed Added', `${newCam.camNumber} (${newCam.name}) registered into vision matrix.`);
  }, [addToast]);

  const updateCameraFeed = useCallback((id: string, updates: Partial<CameraFeed>) => {
    setCameraFeeds(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addToast('info', 'Camera Updated', 'Camera configuration synchronized.');
  }, [addToast]);

  const deleteCameraFeed = useCallback((id: string) => {
    setCameraFeeds(prev => prev.filter(c => c.id !== id));
    addToast('info', 'Camera Feed Removed', 'Camera removed from surveillance matrix.');
  }, [addToast]);

  // Zone Management CRUD
  const updateZone = useCallback((id: string, updates: Partial<Zone>) => {
    setZones(prev => prev.map(z => {
      if (z.id === id) {
        const updated = { ...z, ...updates };
        if (updates.currentPeople !== undefined && !updates.density) {
          updated.density = Math.round((updates.currentPeople / updated.maxCapacity) * 100);
        } else if (updates.density !== undefined && !updates.currentPeople) {
          updated.currentPeople = Math.round((updated.maxCapacity * updates.density) / 100);
        }
        return updated;
      }
      return z;
    }));
    setCameraFeeds(prev => prev.map(c => {
      if (c.zoneId === id && updates.density !== undefined) {
        return {
          ...c,
          density: updates.density,
          riskLevel: updates.riskLevel || (updates.density >= 85 ? 'CRITICAL' : updates.density >= 70 ? 'HIGH' : updates.density >= 50 ? 'WATCH' : 'SAFE')
        };
      }
      return c;
    }));
    addToast('success', 'Sector Data Updated', `Zone parameters updated in spatial telemetry.`);
  }, [addToast]);

  const addZone = useCallback((newZone: Zone) => {
    setZones(prev => [...prev, newZone]);
    addToast('success', 'Sector Registered', `${newZone.name} added to spatial map.`);
  }, [addToast]);

  const deleteZone = useCallback((id: string) => {
    setZones(prev => prev.filter(z => z.id !== id));
    addToast('info', 'Sector Removed', 'Zone removed from venue blueprint.');
  }, [addToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const playAlertSound = useCallback((severity: 'warning' | 'critical' | 'success') => {
    if (soundEnabled) {
      playTone(severity);
    }
  }, [soundEnabled]);

  // Real-time clock tick
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Sync selected zone
  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[1] || zones[0];
  const riskBreakdown = computeRiskBreakdown(selectedZone);

  const selectZone = useCallback((id: string) => {
    setSelectedZoneId(id);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<EventSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('info', 'Settings Updated', 'Event configuration parameters have been applied.');
  }, [addToast]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleEmergencyMode = useCallback(() => {
    setEmergencyMode(prev => {
      const next = !prev;
      if (next) {
        playAlertSound('critical');
        addToast('error', 'EMERGENCY MODE ACTIVATED', 'All security squads mobilized. Priority evacuation routes active.');
      } else {
        addToast('info', 'Emergency Mode Standby', 'Facility returned to standard command monitoring.');
      }
      return next;
    });
  }, [addToast, playAlertSound]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a));
    addToast('info', 'Alert Acknowledged', 'Security log updated.');
  }, [addToast]);

  // SURGE SIMULATION ENGINE
  const startSurgeSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    setStage('BUILDING');
    setRecommendationApproved(false);
    setRecommendationDismissed(false);
    setSelectedZoneId('gate-b');

    addToast('warning', 'Simulation Started', 'Simulating rapid crowd inflow surge at Gate B...');

    // Step 1: 42% -> 55%
    setTimeout(() => {
      setZones(prev => prev.map(z => {
        if (z.id === 'gate-b') {
          return {
            ...z,
            density: 55,
            currentPeople: 1100,
            inflow: 120,
            outflow: 85,
            densityTrend: 12,
            riskLevel: 'WATCH',
            flowDirection: '→ Inward (Surging)',
            predictionText: 'Inflow accelerating toward concourse.',
            predictedDensityIn4Min: 80,
          };
        }
        return z;
      }));
      setCameraFeeds(prev => prev.map(c => c.zoneId === 'gate-b' ? { ...c, density: 55, flowRate: 120, simulatedDetections: 1100, riskLevel: 'WATCH' } : c));
    }, 1500);

    // Step 2: 55% -> 68% -> 78% (WARNING STAGE)
    setTimeout(() => {
      setStage('WARNING');
      playAlertSound('warning');
      setZones(prev => prev.map(z => {
        if (z.id === 'gate-b') {
          return {
            ...z,
            density: 78,
            currentPeople: 1560,
            inflow: 158,
            outflow: 80,
            densityTrend: 24,
            riskLevel: 'HIGH',
            flowDirection: '→ Inward (High Congestion)',
            predictionText: 'Rapid inflow accumulation detected. Bottleneck formation imminent.',
            predictedDensityIn4Min: 95,
          };
        }
        return z;
      }));
      setCameraFeeds(prev => prev.map(c => c.zoneId === 'gate-b' ? { ...c, density: 78, flowRate: 158, simulatedDetections: 1560, riskLevel: 'HIGH' } : c));

      // Add Alert
      setAlerts(prev => [
        {
          id: 'alt-surge-' + Date.now(),
          timestamp: new Date().toISOString(),
          timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          zoneId: 'gate-b',
          zoneName: 'Gate B',
          severity: 'HIGH',
          title: 'Rapid Inflow Surge Detected',
          description: 'Gate B inflow jumped to 158/min (imbalance ratio 1.97). Early prediction warning initiated.',
          actionTaken: 'AI recommendation queue populated.',
          status: 'ACTIVE',
        },
        ...prev,
      ]);
      addToast('warning', 'High Surge Alert', 'Gate B approaching capacity limits (78%).');
    }, 3500);

    // Step 3: 78% -> 88% -> 94% (CRITICAL STAGE & CONGESTION PREDICTION)
    setTimeout(() => {
      setStage('CRITICAL');
      playAlertSound('critical');
      setZones(prev => prev.map(z => {
        if (z.id === 'gate-b') {
          return {
            ...z,
            density: 94,
            currentPeople: 1880,
            inflow: 186,
            outflow: 72,
            densityTrend: 31,
            riskLevel: 'CRITICAL',
            flowDirection: '→ Toward Gate B (Bottleneck)',
            predictionText: 'Potential congestion within approximately 4 minutes.',
            predictedDensityIn4Min: 101,
          };
        }
        return z;
      }));
      setCameraFeeds(prev => prev.map(c => c.zoneId === 'gate-b' ? { ...c, density: 94, flowRate: 186, simulatedDetections: 1880, riskLevel: 'CRITICAL' } : c));

      // Append Critical Prediction Alert
      setAlerts(prev => [
        {
          id: 'alt-crit-' + Date.now(),
          timestamp: new Date().toISOString(),
          timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          zoneId: 'gate-b',
          zoneName: 'Gate B',
          severity: 'CRITICAL',
          title: 'Bottleneck Detected & Congestion Predicted',
          description: 'Gate B density reached 94%. Model forecasts severe bottleneck (+4 min: 101% overload). Immediate intervention advised.',
          actionTaken: 'Recommended: Redirect crowd to Gate C & Dispatch Team 04.',
          status: 'ACTIVE',
        },
        ...prev,
      ]);

      addToast('error', 'CRITICAL EARLY WARNING', 'Potential congestion in ~4 minutes at Gate B! Decision support ready.');
      setIsSimulating(false);
    }, 6000);
  }, [isSimulating, addToast, playAlertSound]);

  // DISPATCH TEAM ACTION
  const dispatchSecurityTeam = useCallback((teamId: string = 'team-04', targetZoneId: string = 'gate-b') => {
    const target = zones.find(z => z.id === targetZoneId)?.name || 'Gate B';
    
    setSecurityTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          status: 'MOVING',
          targetZone: target,
          distanceMeters: 180,
          etaSeconds: 84,
        };
      }
      return team;
    }));

    setAlerts(prev => [
      {
        id: 'alt-dispatch-' + Date.now(),
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        zoneId: targetZoneId,
        zoneName: target,
        severity: 'ACTION',
        title: 'Security Team 04 Dispatched',
        description: `Rapid Response squad deployed to ${target}. ETA: 01:24 (180m).`,
        actionTaken: 'Team en route with perimeter barrier kits.',
        status: 'ACTIVE',
      },
      ...prev,
    ]);

    addToast('info', 'Team 04 Dispatched', `Squad moving to ${target}. ETA: 01:24.`);

    // Countdown ETA & Transition to Arrived
    if (teamTimerRef.current) clearInterval(teamTimerRef.current);
    teamTimerRef.current = window.setInterval(() => {
      setSecurityTeams(prev => prev.map(team => {
        if (team.id === teamId && team.status === 'MOVING') {
          if (team.etaSeconds <= 1) {
            if (teamTimerRef.current) clearInterval(teamTimerRef.current);
            addToast('success', 'Team Arrived', `Security Team 04 has arrived on site at ${target}.`);
            return {
              ...team,
              status: 'ARRIVED',
              distanceMeters: 0,
              etaSeconds: 0,
              assignedZone: target,
            };
          }
          return {
            ...team,
            etaSeconds: team.etaSeconds - 5,
            distanceMeters: Math.max(0, team.distanceMeters - 12),
          };
        }
        return team;
      }));
    }, 500);
  }, [zones, addToast]);

  // REDIRECT CROWD & RECOVERY INTERVENTION
  const redirectCrowd = useCallback((fromZoneId: string = 'gate-b', toZoneId: string = 'gate-c') => {
    setStage('INTERVENTION');
    setRecommendationApproved(true);

    addToast('info', 'Intervention Initialized', 'Dynamic turnstiles gating Gate B. Public signage redirecting to Gate C.');

    // Step 1: 94% -> 87% (Gate B) and 28% -> 34% (Gate C)
    setTimeout(() => {
      setStage('RECOVERY');
      setZones(prev => prev.map(z => {
        if (z.id === fromZoneId) {
          return {
            ...z,
            density: 87,
            currentPeople: 1740,
            inflow: 110,
            outflow: 98,
            densityTrend: -7,
            riskLevel: 'HIGH',
            flowDirection: '← Diverting Outward',
            predictionText: 'Inflow throttled. Dispersion underway.',
            predictedDensityIn4Min: 72,
          };
        }
        if (z.id === toZoneId) {
          return {
            ...z,
            density: 34,
            currentPeople: 680,
            inflow: 90,
            outflow: 42,
            densityTrend: 6,
            riskLevel: 'SAFE',
            flowDirection: 'Inward (Absorbing)',
            predictionText: 'Absorbing redirected inflow efficiently.',
          };
        }
        return z;
      }));
    }, 1500);

    // Step 2: 87% -> 79% (Gate B) and 34% -> 42% (Gate C)
    setTimeout(() => {
      setZones(prev => prev.map(z => {
        if (z.id === fromZoneId) {
          return {
            ...z,
            density: 79,
            currentPeople: 1580,
            inflow: 85,
            outflow: 105,
            densityTrend: -15,
            riskLevel: 'WATCH',
            flowDirection: 'Balanced Dispersion',
            predictionText: 'Density decreasing rapidly toward safe threshold.',
            predictedDensityIn4Min: 64,
          };
        }
        if (z.id === toZoneId) {
          return {
            ...z,
            density: 42,
            currentPeople: 840,
            inflow: 95,
            outflow: 50,
            densityTrend: 8,
            riskLevel: 'SAFE',
            flowDirection: 'Smooth Flow',
          };
        }
        return z;
      }));

      setAlerts(prev => [
        {
          id: 'alt-recov-' + Date.now(),
          timestamp: new Date().toISOString(),
          timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          zoneId: fromZoneId,
          zoneName: 'Gate B',
          severity: 'RECOVERY',
          title: 'Density Decreasing at Gate B',
          description: 'Crowd redistribution active. Turnstile flow balanced. Density dropped from 94% to 79%.',
          actionTaken: 'Gate C successfully absorbing excess inflow.',
          status: 'ACTIVE',
        },
        ...prev,
      ]);
    }, 3500);

    // Step 3: 79% -> 68% -> SAFE STAGE (Gate B) and Gate C: 51% (Safe)
    setTimeout(() => {
      setStage('SAFE');
      playAlertSound('success');
      setZones(prev => prev.map(z => {
        if (z.id === fromZoneId) {
          return {
            ...z,
            density: 68,
            currentPeople: 1360,
            inflow: 75,
            outflow: 90,
            densityTrend: -26,
            riskLevel: 'SAFE',
            flowDirection: 'Balanced Normal',
            predictionText: 'Congestion hazard averted. Optimal queue pacing.',
            predictedDensityIn4Min: 60,
          };
        }
        if (z.id === toZoneId) {
          return {
            ...z,
            density: 51,
            currentPeople: 1020,
            inflow: 70,
            outflow: 65,
            densityTrend: 2,
            riskLevel: 'SAFE',
            flowDirection: 'Balanced Inflow',
          };
        }
        return z;
      }));

      setCameraFeeds(prev => prev.map(c => {
        if (c.zoneId === fromZoneId) {
          return { ...c, density: 68, flowRate: 75, simulatedDetections: 1360, riskLevel: 'SAFE' };
        }
        return c;
      }));

      // Append Resolved Alert
      setAlerts(prev => [
        {
          id: 'alt-resolv-' + Date.now(),
          timestamp: new Date().toISOString(),
          timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          zoneId: fromZoneId,
          zoneName: 'Gate B',
          severity: 'RESOLVED',
          title: 'Situation Stabilized - Hazard Cleared',
          description: 'Crowd successfully redistributed from Gate B to Gate C. Risk index stabilized to normal.',
          actionTaken: 'All checkpoints reporting nominal flow.',
          status: 'RESOLVED',
        },
        ...prev,
      ]);

      addToast('success', 'Incident Resolved', 'Gate B stabilized. Crowd successfully redistributed to Gate C.');
    }, 6000);
  }, [addToast, playAlertSound]);

  const approveRecommendation = useCallback(() => {
    setRecommendationApproved(true);
    dispatchSecurityTeam('team-04', 'gate-b');
    redirectCrowd('gate-b', 'gate-c');
  }, [dispatchSecurityTeam, redirectCrowd]);

  const dismissRecommendation = useCallback(() => {
    setRecommendationDismissed(true);
    addToast('info', 'Recommendation Dismissed', 'Manual security override confirmed.');
  }, [addToast]);

  const resetSimulation = useCallback(() => {
    if (teamTimerRef.current) clearInterval(teamTimerRef.current);
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    setZones(initialZones);
    setSelectedZoneId('gate-b');
    setSecurityTeams(initialSecurityTeams);
    setCameraFeeds(initialCameraFeeds);
    setAlerts(initialAlerts);
    setStage('NORMAL');
    setEmergencyMode(false);
    setIsSimulating(false);
    setRecommendationApproved(false);
    setRecommendationDismissed(false);
    addToast('info', 'System Reset', 'Simulation reset to baseline state.');
  }, [addToast]);

  // Aggregated dynamic metrics
  const totalPeople = zones.reduce((acc, z) => acc + z.currentPeople, 0);
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const highRiskZonesCount = zones.filter(z => z.riskLevel === 'HIGH' || z.riskLevel === 'CRITICAL').length;
  const averageDensity = Math.round(zones.reduce((acc, z) => acc + z.density, 0) / zones.length);
  const responseTime = '01:42';

  return (
    <SimulationContext.Provider
      value={{
        zones,
        selectedZone,
        selectedZoneId,
        securityTeams,
        cameraFeeds,
        alerts,
        settings,
        stage,
        emergencyMode,
        isSimulating,
        soundEnabled,
        currentTime,
        toasts,
        riskBreakdown,
        recommendationApproved,
        recommendationDismissed,
        totalPeople,
        activeAlertsCount,
        highRiskZonesCount,
        averageDensity,
        responseTime,
        selectZone,
        startSurgeSimulation,
        dispatchSecurityTeam,
        redirectCrowd,
        approveRecommendation,
        dismissRecommendation,
        acknowledgeAlert,
        toggleEmergencyMode,
        toggleSound,
        updateSettings,
        resetSimulation,
        dismissToast,
        playAlertSound,
        // Admin & Management operations
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        addAlert,
        resolveAlert,
        deleteAlert,
        addSecurityTeam,
        updateSecurityTeam,
        deleteSecurityTeam,
        addCameraFeed,
        updateCameraFeed,
        deleteCameraFeed,
        updateZone,
        addZone,
        deleteZone,
        addToast,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
