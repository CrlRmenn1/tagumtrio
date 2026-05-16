import Dexie from 'dexie'

const DB_NAME = 'tagumtrio_offline'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const db = new Dexie(DB_NAME)
db.version(1).stores({
  scans: '&id,leadmanId,status,createdAt,updatedAt'
})

export async function enqueueScan(scan) {
  const now = new Date().toISOString()
  const record = {
    id: scan.id,
    leadmanId: scan.leadmanId || scan.leadman_id || null,
    raw: scan.raw || null,
    meta: scan.meta || null,
    scannedAt: scan.scannedAt || now,
    deviceId: scan.deviceId || scan.device_id || null,
    status: scan.status || 'pending',
    attempts: 0,
    createdAt: now,
    updatedAt: now,
  }
  await db.scans.put(record)
  return record.id
}

export async function getPendingScans(limit = 50) {
  return db.scans.where('status').equals('pending').limit(limit).toArray()
}

export async function markScansUploaded(ids = []) {
  const now = new Date().toISOString()
  return Promise.all(ids.map((id) => db.scans.update(id, { status: 'uploaded', updatedAt: now })))
}

export async function markScanFailed(id, reason) {
  const rec = await db.scans.get(id)
  const attempts = (rec?.attempts || 0) + 1
  const updates = { attempts, updatedAt: new Date().toISOString(), lastError: reason }
  if (attempts >= 5) updates.status = 'error'
  return db.scans.update(id, updates)
}

export async function pendingCount() {
  return db.scans.where('status').equals('pending').count()
}

export async function trySyncOnce(batchSize = 50) {
  if (!navigator.onLine) return { ok: false, reason: 'offline' }
  const pending = await getPendingScans(batchSize)
  if (!pending.length) return { ok: true, uploaded: 0 }

  const payload = { scans: pending.map((p) => ({
    id: p.id,
    leadmanId: p.leadmanId,
    raw: p.raw,
    meta: p.meta,
    scannedAt: p.scannedAt,
    deviceId: p.deviceId,
  })) }

  try {
    const res = await fetch(`${API_URL}/api/scans/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      // mark all as failed attempt
      await Promise.all(pending.map((p) => markScanFailed(p.id, `http:${res.status}`)))
      return { ok: false, reason: `http:${res.status}`, uploaded: 0 }
    }
    const data = await res.json()
    const accepted = Array.isArray(data.accepted) ? data.accepted : []
    const rejected = Array.isArray(data.rejected) ? data.rejected : []

    if (accepted.length) await markScansUploaded(accepted)
    // for rejected, mark as failed
    await Promise.all(rejected.map((r) => markScanFailed(r.id, r.reason || 'rejected')))

    return { ok: true, uploaded: accepted.length, rejected: rejected.length }
  } catch (err) {
    await Promise.all(pending.map((p) => markScanFailed(p.id, err.message)))
    return { ok: false, reason: err.message }
  }
}

export default db
