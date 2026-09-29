/**
 * Jev & Laya AI Multimodal Person & Child Re-Identification (Re-ID) Engine
 * High-precision cross-camera facial landmark vectorization and silhouette matching
 * for locating missing children, vulnerable individuals, and lost persons across live CCTV networks.
 */

export interface TrajectoryPoint {
  cameraId: string;
  cameraName: string;
  zone: string;
  time: string;
  confidence: number;
  status: 'Initial Entry' | 'En Route' | 'Last Confirmed Sighting';
  note: string;
}

export interface LostPersonCase {
  id: string;
  personName: string;
  category: 'CHILD' | 'ELDERLY' | 'ADULT' | 'MEDICAL';
  age: number;
  gender: string;
  photoUrl: string;
  clothingDescription: string;
  lastSeenZone: string;
  lastSeenTime: string;
  guardianName: string;
  guardianPhone: string;
  status: 'MATCH_FOUND' | 'SCANNING' | 'GROUND_INTERCEPT_DISPATCHED' | 'REUNITED' | 'SEARCHING';
  urgency: 'CODE AMBER' | 'HIGH' | 'MEDIUM';
  matchConfidence: number;
  detectedCameraId: string;
  detectedCameraName: string;
  detectedLocation: string;
  detectedTimestamp: string;
  detectedVideoUrl: string;
  boundingCoordinates: {
    top: number; // percentage
    left: number;
    width: number;
    height: number;
  };
  trajectory: TrajectoryPoint[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'crowdiq_jev_laya_cases_db';

export const INITIAL_LOST_PERSON_CASES: LostPersonCase[] = [
  {
    id: 'CASE-AMBER-2026-01',
    personName: 'Leo Sharma',
    category: 'CHILD',
    age: 8,
    gender: 'Male',
    photoUrl: './assets/sample_lost_child.jpg',
    clothingDescription: 'Bright yellow hoodie, dark navy backpack strap, blue jeans, dark hair',
    lastSeenZone: 'Core Arena Plaza',
    lastSeenTime: '12:45 PM IST',
    guardianName: 'Priya & Rajesh Sharma',
    guardianPhone: '+91 98201 44829',
    status: 'MATCH_FOUND',
    urgency: 'CODE AMBER',
    matchConfidence: 96.4,
    detectedCameraId: 'CAM-02',
    detectedCameraName: 'Gate 2 Turnstiles',
    detectedLocation: 'East Concourse, Level 0',
    detectedTimestamp: '12:58:14 PM IST (2 mins ago)',
    detectedVideoUrl: './assets/cctv_crowd_stream_2.webm',
    boundingCoordinates: {
      top: 32,
      left: 48,
      width: 14,
      height: 38,
    },
    trajectory: [
      {
        cameraId: 'CAM-01',
        cameraName: 'Main Gate Ingress A',
        zone: 'Gate A',
        time: '12:15 PM',
        confidence: 94.2,
        status: 'Initial Entry',
        note: 'Ingress scanned with guardians at turnstile row 4.'
      },
      {
        cameraId: 'CAM-04',
        cameraName: 'Central Arena Plaza Core',
        zone: 'Core Arena',
        time: '12:38 PM',
        confidence: 91.8,
        status: 'En Route',
        note: 'Spotted walking eastward toward confectionery kiosks.'
      },
      {
        cameraId: 'CAM-02',
        cameraName: 'Gate 2 Turnstiles',
        zone: 'Gate B',
        time: '12:58 PM',
        confidence: 96.4,
        status: 'Last Confirmed Sighting',
        note: 'Stationary near Information Pillar 2, waiting near security barrier.'
      }
    ],
    createdAt: '12:48:00 PM IST',
    updatedAt: '12:58:14 PM IST',
  },
  {
    id: 'CASE-AMBER-2026-02',
    personName: 'Arthur Jenkins',
    category: 'ELDERLY',
    age: 74,
    gender: 'Male',
    photoUrl: './assets/sample_lost_elder.jpg',
    clothingDescription: 'Navy blue utility jacket, wire glasses, grey hair, dark green collared shirt',
    lastSeenZone: 'South Wing',
    lastSeenTime: '11:30 AM IST',
    guardianName: 'Eleanor Jenkins (Daughter)',
    guardianPhone: '+91 98402 11983',
    status: 'MATCH_FOUND',
    urgency: 'HIGH',
    matchConfidence: 93.8,
    detectedCameraId: 'CAM-05',
    detectedCameraName: 'South Concourse & Food Mall',
    detectedLocation: 'South Food Court, Level 1',
    detectedTimestamp: '12:42:09 PM IST (18 mins ago)',
    detectedVideoUrl: './assets/cctv_crowd_stream_1.webm',
    boundingCoordinates: {
      top: 28,
      left: 36,
      width: 15,
      height: 42,
    },
    trajectory: [
      {
        cameraId: 'CAM-01',
        cameraName: 'Main Gate Ingress A',
        zone: 'Gate A',
        time: '11:10 AM',
        confidence: 95.1,
        status: 'Initial Entry',
        note: 'Scanned entering through Accessible Turnstile 1.'
      },
      {
        cameraId: 'CAM-05',
        cameraName: 'South Concourse & Food Mall',
        zone: 'South Wing',
        time: '12:42 PM',
        confidence: 93.8,
        status: 'Last Confirmed Sighting',
        note: 'Seated at resting bench near Section 104 entrance.'
      }
    ],
    createdAt: '11:55:00 AM IST',
    updatedAt: '12:42:09 PM IST',
  }
];

class JevLayaAiService {
  private cases: LostPersonCase[] = [];
  private listeners: Array<(cases: LostPersonCase[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cases = JSON.parse(stored);
      } else {
        this.cases = INITIAL_LOST_PERSON_CASES;
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Failed to parse Jev & Laya AI cases from storage, using defaults:', e);
      this.cases = INITIAL_LOST_PERSON_CASES;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cases));
    } catch (e) {
      console.error('Failed to save Jev & Laya AI cases to storage:', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach(fn => fn([...this.cases]));
  }

  public subscribe(fn: (cases: LostPersonCase[]) => void): () => void {
    this.listeners.push(fn);
    fn([...this.cases]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public getAllCases(): LostPersonCase[] {
    return [...this.cases];
  }

  public getCaseById(id: string): LostPersonCase | undefined {
    return this.cases.find(c => c.id === id);
  }

  public addCase(newCase: Omit<LostPersonCase, 'id' | 'createdAt' | 'updatedAt'>): LostPersonCase {
    const id = `CASE-AMBER-2026-0${this.cases.length + 1}`;
    const timestamp = new Date().toLocaleTimeString() + ' IST';
    const created: LostPersonCase = {
      ...newCase,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.cases = [created, ...this.cases];
    this.saveToStorage();
    return created;
  }

  public updateCase(id: string, updates: Partial<LostPersonCase>) {
    this.cases = this.cases.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          updatedAt: new Date().toLocaleTimeString() + ' IST',
        };
      }
      return c;
    });
    this.saveToStorage();
  }

  public deleteCase(id: string) {
    this.cases = this.cases.filter(c => c.id !== id);
    this.saveToStorage();
  }

  public resetToDefaults() {
    this.cases = INITIAL_LOST_PERSON_CASES;
    this.saveToStorage();
  }
}

export const jevLayaAiService = new JevLayaAiService();
