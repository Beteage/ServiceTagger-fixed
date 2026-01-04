import React, { useEffect, useState } from 'react';
import api from '../api/axios';


import { io } from 'socket.io-client';
import BookingDrawer from '../components/BookingDrawer';
import DispatchMap from '../components/DispatchMap';
import MainLayout from '../components/MainLayout';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DroppableProvided, DraggableProvided, DropResult } from 'react-beautiful-dnd';
import { cn } from '../lib/utils';
import { Calendar, MapPin, MoreHorizontal, FileText } from 'lucide-react';

interface Job {
    id: string;
    description: string;
    status: string;
    scheduledStart: string;
    customer?: {
        name: string;
        address: string;
        lat?: number;
        lng?: number;
    };
}

const DashboardPage: React.FC = () => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);
    const [viewMode, setViewMode] = useState<'board' | 'map'>('board');

    useEffect(() => {
        fetchJobs();

        // Socket.io Connection
        const socket = io('http://localhost:3001');

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('job_update', (updatedJob: Job) => {
            setJobs(prevJobs => {
                const index = prevJobs.findIndex(j => j.id === updatedJob.id);
                if (index > -1) {
                    const newJobs = [...prevJobs];
                    newJobs[index] = updatedJob;
                    return newJobs;
                }
                return [...prevJobs, updatedJob];
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // updateStatus removed


    const getJobsByStatus = (status: string) => jobs.filter(j => j.status === status);

    const columns: { [key: string]: Job[] } = {
        'Draft': getJobsByStatus('Draft'),
        'Scheduled': getJobsByStatus('Scheduled'),
        'In Progress': [...getJobsByStatus('EnRoute'), ...getJobsByStatus('Working')],
        'Completed': getJobsByStatus('Done'),
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const draggedJob = jobs.find(job => job.id === draggableId);
        if (!draggedJob) return;

        let newStatus = destination.droppableId;
        if (newStatus === 'In Progress') {
            newStatus = draggedJob.status === 'Working' ? 'Working' : 'EnRoute';
        } else if (newStatus === 'Completed') {
            newStatus = 'Done';
        }

        // Optimistic update
        setJobs(prevJobs => prevJobs.map(job => job.id === draggableId ? { ...job, status: newStatus } : job));

        api.put(`/jobs/${draggableId}/status`, { status: newStatus })
            .catch(error => {
                console.error('Failed to update job status', error);
                fetchJobs(); // Revert on error
            });
    };

    // Helper to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'EnRoute': return 'bg-sky-50 text-sky-600 border-sky-200';
            case 'Working': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Done': return 'bg-gray-50 text-gray-600 border-gray-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <MainLayout>
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dispatch Board</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your team's schedule and active jobs.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
                            <button
                                onClick={() => setViewMode('board')}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                    viewMode === 'board' ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Board
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                    viewMode === 'map' ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Map
                            </button>
                        </div>
                        <button
                            className="bg-brand text-white px-5 py-2 rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
                            onClick={() => setShowDrawer(true)}
                        >
                            <span className="text-lg leading-none">+</span> New Job
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">Loading Dispatch Data...</div>
                    ) : viewMode === 'board' ? (
                        <div className="p-6 h-full overflow-x-auto">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <div className="flex gap-6 h-full min-w-[1200px]">
                                    {Object.keys(columns).map(status => (
                                        <Droppable droppableId={status} key={status}>
                                            {(provided: DroppableProvided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="w-80 flex flex-col h-full bg-slate-50/50 rounded-xl"
                                                >
                                                    <div className="p-4 flex justify-between items-center sticky top-0 bg-slate-50/95 backdrop-blur-md z-10 rounded-t-xl border-b border-slate-100">
                                                        <h2 className="font-bold text-slate-800 text-[13px] tracking-wide uppercase flex items-center gap-2">
                                                            <div className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm",
                                                                status === 'Draft' ? "bg-slate-400" :
                                                                    status === 'Scheduled' ? "bg-blue-500" :
                                                                        status === 'In Progress' ? "bg-brand" : "bg-slate-500"
                                                            )} />
                                                            {status}
                                                        </h2>
                                                        <span className="bg-white text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-bold border border-slate-200">{columns[status].length}</span>
                                                    </div>

                                                    <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                                                        {columns[status].map((job, index) => (
                                                            <Draggable key={job.id} draggableId={job.id} index={index}>
                                                                {(provided: DraggableProvided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{ ...provided.draggableProps.style }}
                                                                        className={cn(
                                                                            "bg-white p-4 rounded-2xl border border-slate-100 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden",
                                                                            snapshot.isDragging ? "shadow-2xl ring-2 ring-brand/20 rotate-2 scale-105 border-brand" : "shadow-sm hover:shadow-md hover:border-brand/30"
                                                                        )}
                                                                    >

                                                                        <div className="flex justify-between items-start mb-3">
                                                                            <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-opacity-50", getStatusColor(job.status))}>
                                                                                {job.status}
                                                                            </span>
                                                                            <button className="text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 p-1 rounded-md opacity-0 group-hover:opacity-100">
                                                                                <MoreHorizontal size={14} />
                                                                            </button>
                                                                        </div>

                                                                        <div className="mb-4">
                                                                            <div className="font-bold text-slate-800 text-[15px] mb-1 leading-tight flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                                                                {job.customer?.name || "Unknown Customer"}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                                                                <MapPin size={12} className="text-slate-400" />
                                                                                <span className="truncate">{job.customer?.address}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                                                <Calendar size={12} className="text-slate-400" />
                                                                                {new Date(job.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </div>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    window.open(`http://localhost:3001/api/invoices/generate?jobId=${job.id}`, '_blank');
                                                                                }}
                                                                                className="flex items-center justify-end gap-1 text-[11px] text-slate-400 hover:text-blue-600 font-semibold uppercase tracking-wide transition-colors"
                                                                            >
                                                                                <FileText size={12} /> Invoice
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                </div>
                            </DragDropContext>
                        </div>
                    ) : (
                        <div className="h-full w-full">
                            <DispatchMap jobs={jobs} />
                        </div>
                    )}
                </div>

                <BookingDrawer
                    isOpen={showDrawer}
                    onClose={() => setShowDrawer(false)}
                    onJobCreated={() => { fetchJobs(); }}
                />
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
