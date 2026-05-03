import { Users, TrendingUp, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useQr } from '../../context/qr-context'
import { useAuth } from '../../context/auth-context'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

const productionData = [
	{ time: '08:00', output: 120, target: 150 },
	{ time: '10:00', output: 280, target: 300 },
	{ time: '12:00', output: 450, target: 450 },
	{ time: '14:00', output: 590, target: 600 },
	{ time: '16:00', output: 820, target: 750 },
	{ time: '18:00', output: 950, target: 900 },
]

const departmentData = [
	{ name: 'Veneer Prep', employees: 45, efficiency: 92 },
	{ name: 'Drying', employees: 30, efficiency: 88 },
	{ name: 'Gluing', employees: 55, efficiency: 95 },
	{ name: 'Pressing', employees: 40, efficiency: 85 },
	{ name: 'Finishing', employees: 60, efficiency: 90 },
]

function StatCard({ title, value, change, trend, icon: Icon }) {
	return (
		<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm font-medium text-slate-400">{title}</p>
					<h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
				</div>
				<div className="p-3 bg-slate-800 rounded-lg">
					<Icon className="w-5 h-5 text-emerald-400" />
				</div>
			</div>
			<div className="mt-4 flex items-center gap-2">
				<span className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
					{trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
					{change}
				</span>
				<span className="text-sm text-slate-500">vs last week</span>
			</div>
		</div>
	)
}

export default function Dashboard() {
	const { qrs, approveByHead } = useQr()
	const { user } = useAuth()
	const awaitingHead = qrs.filter(q => q.status === 'leadman_approved' && (user?.role === 'production_head' || user?.role === 'admin'))
	return (<>
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-white">Workforce Analytics Overview</h2>
				<p className="text-slate-400 mt-1">Real-time insights into production and workforce performance.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard title="Total Employees Active" value="284 / 300" change="2.5%" trend="up" icon={Users} />
				<StatCard title="Production Output" value="950 Units" change="8.2%" trend="up" icon={TrendingUp} />
				<StatCard title="Total Hours Logged" value="2,145 hrs" change="1.1%" trend="down" icon={Clock} />
				<StatCard title="Pending Transfers" value="12" change="Requires Action" trend="up" icon={AlertTriangle} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">Today's Production vs Target</h3>
					</div>
					<div className="w-full min-h-[300px] h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart id="area-chart" data={productionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
								<defs>
									<linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
								<XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
								<YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
								<Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
								<Legend />
								<Area type="monotone" dataKey="output" name="Actual Output" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOutput)" />
								<Area type="monotone" dataKey="target" name="Target" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} strokeDasharray="5 5" />
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">Department Efficiency</h3>
					</div>
					<div className="w-full min-h-[300px] h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart id="bar-chart" data={departmentData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
								<XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
								<YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
								<Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
								<Bar dataKey="efficiency" name="Efficiency %" fill="#10b981" radius={[0, 4, 4, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>

		{awaitingHead.length > 0 && (
			<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4">Pending Head Approvals</h3>
				<div className="space-y-3">
					{awaitingHead.map((r) => (
						<div key={r.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
							<div>
								<div className="text-sm text-slate-400">{r.id} • {new Date(r.leadmanAt).toLocaleTimeString()}</div>
								<div className="text-white font-medium">{r.workerName} — {r.product} ({r.pieces} pcs)</div>
							</div>
									<div>
										<button onClick={() => approveByHead(r.id, user?.id || 'ADM-001')} className="px-3 py-2 bg-amber-400 text-black rounded font-medium">Approve</button>
									</div>
						</div>
					))}
				</div>
			</div>
		)}
		</>
	)
}
