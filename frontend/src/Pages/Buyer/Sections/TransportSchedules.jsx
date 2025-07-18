import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import TransportJobModal from './TransportJobModal';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTransportsContext } from '../../../Contexts/Buyer/TransportContext';

export default function TransportJobs() {
	const { orderId } = useParams();
	const { jobs } = useTransportsContext();
	const [jobsFiltered, setJobsFiltered] = useState(jobs);

	useEffect(() => {
		if (orderId) {
			setJobsFiltered(jobs.filter(j => j.orderId === orderId));
		} else {
			setJobsFiltered(jobs);
		}
	}, [orderId, jobs]);

	// Stat cards
	const totalJobs = jobsFiltered.length;
	const completed = jobsFiltered.filter(j => j.status === 'Completed').length;
	const inProgress = jobsFiltered.filter(j => j.status === 'In Progress').length;
	const pending = jobsFiltered.filter(j => j.status === 'Pending').length;

	return (
		<div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
			{/* Title & subtitle */}
			<div>
				<h1 className="text-3xl font-bold dark:text-gray-100">Transport Jobs</h1>
				<div className="mt-1 text-gray-600 dark:text-gray-300 text-lg">All your scheduled and completed transport jobs are listed below.</div>
			</div>

			{/* Stat cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700">
					<span className="text-xs text-gray-500">Total Jobs</span>
					<span className="text-2xl font-bold text-green-700 dark:text-green-300">{totalJobs}</span>
				</div>
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700">
					<span className="text-xs text-gray-500">Completed</span>
					<span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{completed}</span>
				</div>
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700">
					<span className="text-xs text-gray-500">In Progress</span>
					<span className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{inProgress}</span>
				</div>
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700">
					<span className="text-xs text-gray-500">Pending</span>
					<span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{pending}</span>
				</div>
			</div>

			{/* Jobs Table */}
			<div className="overflow-auto">
				<table className="w-full table-auto border-separate border-spacing-y-4">
					<thead className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
						<tr>
							<th>Job ID</th>
							<th>Status</th>
							<th>Vehicle</th>
							<th>Remaining (kg)</th>
							<th>Items</th>
						</tr>
					</thead>
					<tbody>
						{jobsFiltered.length === 0 && (
							<tr>
								<td colSpan={5} className="text-center py-8 text-gray-500">No transport jobs to show.</td>
							</tr>
						)}
						{jobsFiltered.map(job => (
							<tr key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
								<td className="p-4 font-medium text-green-900 dark:text-green-100">
									<Link to={`/buyer/transport/schedules/${job.id}`} className="hover:underline">{job.id}</Link>
								</td>
								<td className="p-4">
									<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
										${job.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
											job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
											job.status === 'Pending' ? 'bg-gray-100 text-gray-700' :
											'bg-gray-200 text-gray-800'}`}>{job.status}</span>
								</td>
								<td className="p-4">{job.vehicleType}</td>
								<td className="p-4">{job.capacityRemaining}</td>
								<td className="p-4">
									<button onClick={() => window.open(`/buyer/transport/schedules/${job.id}`, '_self')} className="text-green-600 hover:underline font-semibold">View Items</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

		</div>
	);
}
