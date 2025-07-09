import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import TransportJobModal from './TransportJobModal';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

// Sample transport job data
export const sampleJobs = [
	{
		id: 'TJ-1001',
		orderId: 'ORD-1001',
		status: 'Open',
		vehicleType: 'Small Van',
		capacityRemaining: '30 kg',
		items: [ /* item data */],
		createdAt: '2025-07-01'
	},
	{
		id: 'TJ-1002',
		orderId: 'ORD-1003',
		status: 'In Progress',
		vehicleType: 'Large Truck',
		capacityRemaining: '150 kg',
		items: [ /* item data */],
		createdAt: '2025-07-02'
	}
];

export default function TransportJobs() {
	const [jobs] = useState(sampleJobs);
	// const [modalJob, setModalJob] = useState(null);
	const [expanded, setExpanded] = useState([]);

	const toggleExpand = id =>
		setExpanded(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);

	return (
		<div className="container mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold dark:text-gray-100">Transport Jobs</h1>
			<div className="space-y-4">
				{jobs.map(job => (
					<div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
						<div className="flex justify-between items-center p-4">
							<div className="space-x-6 flex items-center">
								<Link to={`./${job.id}`} className="text-lg font-medium">{job.id}</Link>
								<span className="text-sm">{job.status}</span>
								<span className="text-sm">Vehicle: {job.vehicleType}</span>
								<span className="text-sm">Remaining: {job.capacityRemaining}</span>
							</div>
							<div className="flex items-center gap-4">
								<button onClick={() => toggleExpand(job.id)} className="p-2">
									<ChevronRightIcon
										className={`w-6 h-6 transform ${expanded.includes(job.id) ? 'rotate-90' : ''}`}
									/>
								</button>
							</div>
						</div>

						{/* {modalJob?.id === job.id && (
							<TransportJobModal
								isOpen
								onClose={() => setModalJob(null)}
								order={job}
								onCreate={(jid, items) =>
									console.log('Add to job', jid, items)
								}
							/>
						)} */}

						{expanded.includes(job.id) && (
							<div className="p-4 border-t border-gray-200 dark:border-gray-700">
								<table className="w-full table-auto border-separate border-spacing-y-4">
									<thead className="text-left text-gray-600">
										<tr>
											<th>Product</th><th>Qty (kg)</th><th>Price/kg</th><th>Total</th>
										</tr>
									</thead>
									<tbody>
										{job.items.map(item => (
											<tr key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg">
												<td className="p-2">{item.type}</td>
												<td className="p-2">{item.quantity}</td>
												<td className="p-2">Rs. {item.pricePerUnit.toFixed(2)}</td>
												<td className="p-2 font-semibold">
													Rs. {(item.quantity * item.pricePerUnit).toFixed(2)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
