import QRCode from 'qrcode';
import { localDatabase } from './localDatabase';

/**
 * Generate a Data URL for a QR code representing the ticket payload
 */
export async function generateQRCodeDataURL(payload) {
  try {
    const stringPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(stringPayload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
    return dataUrl;
  } catch (err) {
    console.error('QR Generation failed', err);
    throw err;
  }
}

/**
 * Validate a scanned QR code payload
 */
export function validateTicketPayload(rawCode, activeGate = null) {
  let ticketId = rawCode;
  let metadata = null;

  try {
    if (rawCode.startsWith('{')) {
      const parsed = JSON.parse(rawCode);
      ticketId = parsed.id || parsed.ticketId;
      metadata = parsed;
    }
  } catch (_) {
    ticketId = rawCode;
  }

  const tickets = localDatabase.getTickets();
  const existing = tickets.find(t => t.id.toLowerCase() === ticketId.trim().toLowerCase());
  const nowStr = new Date().toLocaleTimeString();

  if (!existing) {
    // If not found in mock DB, check if it's a freshly user-generated pass
    if (ticketId.startsWith('TKT-')) {
      const newEntry = {
        id: ticketId,
        attendee: metadata?.attendee || 'Guest Attendee',
        tier: metadata?.tier || 'General Admission',
        zone: metadata?.zone || 'zone-north-gate',
        gate: metadata?.gate || 'Gate North-A',
        valid: true,
        used: true,
        timestamp: nowStr
      };
      localDatabase.saveTickets([newEntry, ...tickets]);
      localDatabase.addAuditLog('TICKET_VALIDATED', `New pass registered & admitted: ${newEntry.id} (${newEntry.attendee})`, 'TURNSTILE_A', 'SUCCESS');
      return {
        status: 'GRANTED',
        message: 'Access Granted - New Pass Registered',
        ticket: newEntry,
        timestamp: nowStr
      };
    }

    localDatabase.addAuditLog('TICKET_REJECTED', `Unrecognized ticket code rejected: ${ticketId}`, 'TURNSTILE_A', 'WARNING');
    return {
      status: 'INVALID',
      message: 'Invalid Ticket - Code not recognized in security database',
      ticket: null,
      timestamp: nowStr
    };
  }

  if (existing.used) {
    localDatabase.addAuditLog('ANTI_PASSBACK_TRIGGERED', `Duplicate pass reuse attempt: ${existing.id}`, 'TURNSTILE_A', 'CRITICAL');
    return {
      status: 'DUPLICATE',
      message: `Access Denied - Ticket already scanned at ${existing.timestamp}! Anti-passback triggered.`,
      ticket: existing,
      timestamp: nowStr
    };
  }

  // Mark ticket as scanned/used
  existing.used = true;
  existing.timestamp = nowStr;
  localDatabase.saveTickets([...tickets]);
  localDatabase.addAuditLog('TICKET_ADMITTED', `Turnstile access granted: ${existing.id} (${existing.attendee})`, 'TURNSTILE_A', 'INFO');

  return {
    status: 'GRANTED',
    message: `Access Granted - Verified ${existing.tier} (${existing.attendee})`,
    ticket: existing,
    timestamp: nowStr
  };
}

export function registerNewPass(passData) {
  const newPass = {
    ...passData,
    valid: true,
    used: false,
    timestamp: null
  };
  const tickets = localDatabase.getTickets();
  localDatabase.saveTickets([newPass, ...tickets.filter(t => t.id !== newPass.id)]);
  localDatabase.addAuditLog('PASS_GENERATED', `Digital Pass created for ${newPass.attendee} (${newPass.id})`, 'TICKET_OFFICE', 'INFO');
  return newPass;
}

export function getTicketRegistry() {
  return localDatabase.getTickets();
}
