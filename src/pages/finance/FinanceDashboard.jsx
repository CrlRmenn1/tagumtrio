export default function FinanceDashboard() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Finance Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-neutral-800 rounded-lg p-6 shadow text-center">
					<div className="text-lg font-semibold mb-2">Cash Flow</div>
					<div className="text-4xl font-bold text-green-300 mb-2">₱1,200,000</div>
					<div className="text-sm text-gray-400">Current Balance</div>
				</div>
				<div className="bg-neutral-800 rounded-lg p-6 shadow text-center">
					<div className="text-lg font-semibold mb-2">Payroll Review</div>
					<div className="text-4xl font-bold text-blue-300 mb-2">2</div>
					<div className="text-sm text-gray-400">Pending Payrolls</div>
				</div>
			</div>
		</div>
	);
}
