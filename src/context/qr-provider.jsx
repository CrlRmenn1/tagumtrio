import { useState } from 'react'
import { QRContext } from './qr-context'

export function QRProvider({ children }) {
  const [qrs, setQrs] = useState([])

  function submitScan(record) {
    const id = `QR-${Date.now()}`
    setQrs((s) => [...s, { id, ...record, status: 'pending', submittedAt: new Date().toISOString() }])
    return id
  }

  function approveByLeadman(id, leadmanId) {
    setQrs((s) => s.map(q => q.id === id ? { ...q, status: 'leadman_approved', leadmanId, leadmanAt: new Date().toISOString() } : q))
  }

  function approveByHead(id, headId) {
    setQrs((s) => s.map(q => q.id === id ? { ...q, status: 'head_approved', headId, headAt: new Date().toISOString() } : q))
  }

  function clearAll() {
    setQrs([])
  }

  return (
    <QRContext.Provider value={{ qrs, submitScan, approveByLeadman, approveByHead, clearAll }}>{children}</QRContext.Provider>
  )
}

export default QRProvider
