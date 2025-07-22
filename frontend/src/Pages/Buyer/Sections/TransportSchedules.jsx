import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CustomModal from '../../../Components/CustomModel';
// import TransportJobModal from './TransportJobModal';
import { ChevronRightIcon, TruckIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useTransportsContext } from '../../../Contexts/Buyer/TransportContext';


export default function TransportJobs() {
	const { orderId } = useParams();
	const { jobs, addJob } = useTransportsContext();
	const [modalOpen, setModalOpen] = useState(false);
	const [newJob, setNewJob] = useState({
		vehicleType: '',
		pickupLocation: '',
		dropOffLocation: '',
		items: [ { type: '', quantity: '' } ],
	});
	const [filters, setFilters] = useState({
		vehicleType: '',
		status: '',
		pickupLocation: '',
		date: ''
	});

	// Filtering logic
	const jobsFiltered = jobs.filter(j => {
		if (orderId && j.orderId !== orderId) return false;
		if (filters.vehicleType && j.vehicleType !== filters.vehicleType) return false;
		if (filters.status && j.status !== filters.status) return false;
		if (filters.pickupLocation && j.pickupLocation !== filters.pickupLocation) return false;
		if (filters.date && j.createdAt && !j.createdAt.startsWith(filters.date)) return false;
		return true;
	});

	// Stat cards
	const totalJobs = jobsFiltered.length;
	const completed = jobsFiltered.filter(j => j.status === 'Completed').length;
	const inProgress = jobsFiltered.filter(j => j.status === 'In Progress').length;
	const pending = jobsFiltered.filter(j => j.status === 'Pending').length;

	// Unique options for filters
	const vehicleTypeOptions = Array.from(new Set(jobs.map(j => j.vehicleType).filter(Boolean)));
	const statusOptions = Array.from(new Set(jobs.map(j => j.status).filter(Boolean)));
	const pickupLocationOptions = Array.from(new Set(jobs.map(j => j.pickupLocation).filter(Boolean)));

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
			{/* Header styled like PaymentManagement.jsx */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-2">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transport Jobs</h1>
						<p className="text-gray-600 mt-1 text-sm dark:text-gray-300">All your scheduled and completed transport jobs are listed below.</p>
					</div>
					<div className="flex items-center space-x-3">
						{/* Future: Add filter/export buttons here if needed */}
						<button
							className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-semibold shadow"
							onClick={() => setModalOpen(true)}
						>
							+ New Transport Job
						</button>
					</div>
				</div>
			</div>



		{/* Stat cards styled like Orders.jsx */}
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{/* Total Jobs */}
			<div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900">
					<TruckIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
				</div>
				<div>
					<div className="text-xs text-gray-500">Total Jobs</div>
					<div className="text-xl font-bold text-green-700 dark:text-green-300">{totalJobs}</div>
				</div>
			</div>
			{/* Completed */}
			<div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
					<CheckCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
				</div>
				<div>
					<div className="text-xs text-gray-500">Completed</div>
					<div className="text-xl font-bold text-blue-700 dark:text-blue-300">{completed}</div>
				</div>
			</div>
			{/* In Progress */}
			<div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900">
					<ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
				</div>
				<div>
					<div className="text-xs text-gray-500">In Progress</div>
					<div className="text-xl font-bold text-yellow-600 dark:text-yellow-300">{inProgress}</div>
				</div>
			</div>
			{/* Pending */}
			<div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800">
					<ExclamationCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
				</div>
				<div>
					<div className="text-xs text-gray-500">Pending</div>
					<div className="text-xl font-bold text-gray-700 dark:text-gray-300">{pending}</div>
				</div>
			</div>
		</div>

		{/* Filters Card (moved below stat cards) */}
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
			<div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
				<div>
					<label className="block text-xs font-medium text-gray-600 mb-1">Vehicle Type</label>
					<select
						value={filters.vehicleType}
						onChange={e => setFilters(f => ({ ...f, vehicleType: e.target.value }))}
						className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
					>
						<option value="">All Types</option>
						{vehicleTypeOptions.map(v => <option key={v} value={v}>{v}</option>)}
					</select>
				</div>
				<div>
					<label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
					<select
						value={filters.status}
						onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
						className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
					>
						<option value="">All Statuses</option>
						{statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
					</select>
				</div>
				<div>
					<label className="block text-xs font-medium text-gray-600 mb-1">Pickup Location</label>
					<select
						value={filters.pickupLocation}
						onChange={e => setFilters(f => ({ ...f, pickupLocation: e.target.value }))}
						className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
					>
						<option value="">All Locations</option>
						{pickupLocationOptions.map(p => <option key={p} value={p}>{p}</option>)}
					</select>
				</div>
				<div>
					<label className="block text-xs font-medium text-gray-600 mb-1">Created Date</label>
					<input
						type="date"
						value={filters.date}
						onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
						className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
					/>
				</div>
				<button
					type="button"
					onClick={() => setFilters({ vehicleType: '', status: '', pickupLocation: '', date: '' })}
					className="ml-auto px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition"
				>
					Clear Filters
				</button>
			</div>
		</div>

			{/* Jobs Table */}
			<div className="space-y-4">
				{jobsFiltered.length === 0 && (
					<div className="text-center py-8 text-gray-500">No transport jobs to show.</div>
				)}
				{jobsFiltered.map(job => (
					<div
						key={job.id}
						className="relative flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition"
					>
						{/* Accent bar */}
						<div className={`w-2 md:w-3 h-full ${job.status === 'Completed' ? 'bg-blue-500' : job.status === 'In Progress' ? 'bg-yellow-400' : job.status === 'Pending' ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
						{/* Main content */}
						<div className="flex-1 flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
							<div className="flex-1 min-w-0">
								<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
									<div className="flex items-center gap-2">
										<span className="font-bold text-lg text-green-900 dark:text-green-100">{job.vehicleType}</span>
										<span className="text-xs px-2 py-1 rounded-full font-semibold ml-2
											${job.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
												job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
												job.status === 'Pending' ? 'bg-gray-100 text-gray-700' :
												'bg-gray-200 text-gray-800'}">
											{job.status}
										</span>
									</div>
									<div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm">
										<span>Job ID:</span>
										<Link to={`/buyer/transport/schedules/${job.id}`} className="hover:underline font-medium text-green-700 dark:text-green-300">{job.id}</Link>
									</div>
									{/* <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm">
										<span>Remaining:</span>
										<span className="font-semibold text-gray-700 dark:text-gray-100">{job.capacityRemaining} kg</span>
									</div> */}
								</div>
								<div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
									<span>Pickup: <span className="font-medium text-gray-800 dark:text-gray-100">{job.pickupLocation}</span></span>
									<span>Drop-off: <span className="font-medium text-gray-800 dark:text-gray-100">{job.dropOffLocation}</span></span>
								</div>
							</div>
							<div className="flex flex-col gap-2 md:items-end md:justify-center">
								<button
									onClick={() => window.open(`/buyer/transport/schedules/${job.id}`, '_self')}
									className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
								>
									View Details
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* New Transport Job Modal */}
			<CustomModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Create New Transport Job"
				description="Fill in the details to create a new transport job. You can add up to 10 items."
				submitText="Create Job"
				onSubmit={() => {
					addJob({
						...newJob,
						id: `T${Date.now()}`,
						status: 'Pending',
						capacityRemaining: 0,
						items: newJob.items.map((item, idx) => ({ ...item, id: `I${Date.now()}${idx}` })),
						createdAt: new Date().toLocaleString(),
					});
					setModalOpen(false);
					setNewJob({
						vehicleType: '',
						pickupLocation: '',
						dropOffLocation: '',
						items: [ { type: '', quantity: '' } ],
					});
				}}
			>
				<form className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Vehicle Type</label>
						<input
							type="text"
							className="w-full border rounded px-3 py-2"
							value={newJob.vehicleType}
							onChange={e => setNewJob(n => ({ ...n, vehicleType: e.target.value }))}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Pickup Location</label>
						<input
							type="text"
							className="w-full border rounded px-3 py-2"
							value={newJob.pickupLocation}
							onChange={e => setNewJob(n => ({ ...n, pickupLocation: e.target.value }))}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Drop Off Location</label>
						<input
							type="text"
							className="w-full border rounded px-3 py-2"
							value={newJob.dropOffLocation}
							onChange={e => setNewJob(n => ({ ...n, dropOffLocation: e.target.value }))}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Items</label>
						<div className="space-y-2">
							{newJob.items.map((item, idx) => (
								<div key={idx} className="flex gap-2 items-end">
									<input
										type="text"
										className="border rounded px-2 py-1 w-1/2"
										placeholder="Type"
										value={item.type}
										onChange={e => setNewJob(n => {
											const items = [...n.items];
											items[idx].type = e.target.value;
											return { ...n, items };
										})}
										required
									/>
									<input
										type="number"
										className="border rounded px-2 py-1 w-1/2"
										placeholder="Quantity (kg)"
										value={item.quantity}
										onChange={e => setNewJob(n => {
											const items = [...n.items];
											items[idx].quantity = e.target.value;
											return { ...n, items };
										})}
										min={1}
										required
									/>
									{newJob.items.length > 1 && (
										<button
											type="button"
											className="text-red-500 hover:text-red-700 px-2"
											onClick={() => setNewJob(n => ({ ...n, items: n.items.filter((_, i) => i !== idx) }))}
										>
											Remove
										</button>
									)}
								</div>
							))}
							{newJob.items.length < 10 && (
								<button
									type="button"
									className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-semibold"
									onClick={() => setNewJob(n => ({ ...n, items: [...n.items, { type: '', quantity: '' }] }))}
								>
									+ Add Item
								</button>
							)}
						</div>
					</div>
				</form>
			</CustomModal>
		</div>
	);
}
