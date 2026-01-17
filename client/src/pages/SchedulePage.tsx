import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface Job {
    id: string;
    description: string;
    status: string;
    scheduledStart: string;
    customer?: {
        name: string;
        address: string;
    };
    technicianName?: string;
}

const SchedulePage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
            toast.error('Failed to load schedule');
        } finally {
            setLoading(false);
        }
    };

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const goToToday = () => setCurrentDate(new Date());

    const getJobsForDate = (date: Date) => {
        return jobs.filter(job => {
            if (!job.scheduledStart) return false;
            return isSameDay(parseISO(job.scheduledStart), date);
        });
    };

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
            <div className="h-full flex flex-col bg-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <CalendarIcon className="text-brand" /> Weekly Schedule
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {format(startDate, 'MMMM d')} - {format(weekDays[6], 'MMMM d, yyyy')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={goToToday}
                            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            Today
                        </button>
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={prevWeek}
                                className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={nextWeek}
                                className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto bg-slate-50 p-6">
                    <div className="grid grid-cols-7 gap-4 h-full min-w-[1200px]">
                        {weekDays.map((date) => (
                            <div key={date.toString()} className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Day Header */}
                                <div className={cn(
                                    "p-3 border-b border-slate-100 text-center",
                                    isSameDay(date, new Date()) ? "bg-blue-50/50" : "bg-white"
                                )}>
                                    <div className={cn(
                                        "text-xs font-bold uppercase tracking-wider mb-1",
                                        isSameDay(date, new Date()) ? "text-brand" : "text-slate-500"
                                    )}>
                                        {format(date, 'EEE')}
                                    </div>
                                    <div className={cn(
                                        "text-lg font-bold",
                                        isSameDay(date, new Date()) ? "text-brand" : "text-slate-800"
                                    )}>
                                        {format(date, 'd')}
                                    </div>
                                </div>

                                {/* Jobs List */}
                                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                                    {loading ? (
                                        <div className="h-20 animate-pulse bg-slate-50 rounded-lg" />
                                    ) : getJobsForDate(date).map(job => (
                                        <div
                                            key={job.id}
                                            className="group p-3 rounded-lg border border-slate-100 hover:border-brand/30 hover:shadow-md transition-all bg-white cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", getStatusColor(job.status))}>
                                                    {job.status}
                                                </span>
                                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {job.scheduledStart ? format(parseISO(job.scheduledStart), 'h:mm a') : 'TBD'}
                                                </span>
                                            </div>

                                            <div className="font-semibold text-sm text-slate-800 mb-1 line-clamp-2">
                                                {job.description || 'No Description'}
                                            </div>

                                            <div className="space-y-1">
                                                {job.customer && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <User size={12} className="text-slate-400" />
                                                        <span className="truncate">{job.customer.name}</span>
                                                    </div>
                                                )}
                                                {job.customer?.address && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <MapPin size={12} className="text-slate-400" />
                                                        <span className="truncate">{job.customer.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {!loading && getJobsForDate(date).length === 0 && (
                                        <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-lg">
                                            <div className="text-slate-300 text-xs font-medium">No jobs</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SchedulePage;
