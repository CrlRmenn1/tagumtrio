import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import Portal from '../../components/ui/Portal'
import { useQr } from '../../context/qr-context'
import { useAuth } from '../../context/auth-context'

const productionLogs = [
	{ id: 'PRD-2026-001', product: 'Marine Plywood 3/4"', worker: 'Juan Dela Cruz', scannedAt: '08:45 AM', pieces: 25 },
	{ id: 'PRD-2026-002', product: 'Ordinary Plywood 1/2"', worker: 'Pedro Penduko', scannedAt: '09:12 AM', pieces: 40 },
	{ id: 'PRD-2026-003', product: 'Veneer Core 1/4"', worker: 'Maria Clara', scannedAt: '09:30 AM', pieces: 100 },
]

export default function LeadmanProduction() {
	const [query, setQuery] = useState('')
	const [selected, setSelected] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)

	const list = productionLogs.filter(l => l.id.includes(query) || l.product.toLowerCase().includes(query.toLowerCase()) || l.worker.toLowerCase().includes(query.toLowerCase()))

	useEffect(() => {
		if (selected) setModalOpen(true)
		else setModalOpen(false)
	}, [selected])

	const { approveByLeadman } = useQr()
	const { user } = useAuth()

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			<div>
				<h2 className="text-2xl font-bold text-white">Production</h2>
				<p className="text-slate-400 mt-1">Verify submitted production entries. Tap an entry to view details and submit verification.</p>
			</div>

			<div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
				<div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
					<div className="relative w-full sm:w-96">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
						<input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search by ID, worker, or product..." className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
					</div>
					<button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors w-full sm:w-auto justify-center">
						<Filter className="w-4 h-4" />
						Filter
					</button>
				</div>

					<div className="space-y-3 p-4">
						{list.map((l, idx) => (
							<div key={l.id} onClick={() => setSelected(l)} className={`cursor-pointer bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors transform ${selected?.id === l.id ? 'scale-1' : 'hover:scale-[1.01]'} duration-150`} style={{ transitionDelay: `${idx * 30}ms` }}>
								<div>
									<div className="text-sm text-slate-400">{l.id} • {l.scannedAt}</div>
									<div className="text-white font-medium">{l.worker} — {l.product} ({l.pieces} pcs)</div>
								</div>
								<div>
									<button className="px-3 py-2 bg-emerald-500 text-black rounded font-medium">Verify</button>
								</div>
							</div>
						))}
					</div>

				{selected && (
					<Portal>
						<div className={`fixed left-0 right-0 top-16 bottom-0 flex items-center justify-center bg-black/40 p-4 transition-opacity duration-200 z-30 ${modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
							<div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-xl transform transition-all duration-200 z-40 ${modalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
							<h3 className="text-lg font-medium text-white">Verify Entry • {selected.id}</h3>
							<p className="text-slate-400 text-sm mt-1">Review the full information below and submit verification.</p>
							<div className="mt-4 bg-slate-950 border border-slate-800 rounded-lg p-4">
								<div className="text-sm text-slate-400">Worker</div>
								<div className="text-white font-medium">{selected.worker}</div>
								<div className="text-sm text-slate-400 mt-3">Product</div>
								<div className="text-white font-medium">{selected.product}</div>
								<div className="text-sm text-slate-400 mt-3">Pieces</div>
								<div className="text-white font-medium">{selected.pieces}</div>
							</div>
							<div className="mt-4 flex justify-end gap-2">
								<button onClick={() => setSelected(null)} className="px-4 py-2 bg-slate-800 text-slate-200 rounded">Cancel</button>
								<button onClick={() => { approveByLeadman(selected.id, user?.id || 'LD-001'); setSelected(null) }} className="px-4 py-2 bg-emerald-500 text-black rounded font-medium">Submit Verification</button>
							</div>
						</div>
						</div>
						</Portal>
					)}
			</div>
		</div>
	)
}
