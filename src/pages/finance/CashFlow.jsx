const cashFlow = [
	{ id: 1, date: '2026-05-01', type: 'Income', amount: 50000 },
	{ id: 2, date: '2026-04-30', type: 'Expense', amount: 20000 },
];

export default function CashFlow() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Cash Flow</h1>
			<table className="min-w-full bg-neutral-800 rounded-lg overflow-hidden">
				<thead>
					<tr className="bg-neutral-700">
						<th className="px-4 py-2 text-left">Date</th>
						<th className="px-4 py-2 text-left">Type</th>
						<th className="px-4 py-2 text-left">Amount</th>
					</tr>
				</thead>
				<tbody>
					{cashFlow.map((row) => (
						<tr key={row.id} className="border-b border-neutral-700">
							<td className="px-4 py-2">{row.date}</td>
							<td className={`px-4 py-2 font-semibold ${row.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>{row.type}</td>
							<td className="px-4 py-2">₱{row.amount.toLocaleString()}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
