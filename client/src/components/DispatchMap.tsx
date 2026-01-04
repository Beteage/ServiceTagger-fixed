import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React + Leaflet/Vite using specific CDN to ensure they load
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DispatchMapProps {
    jobs: any[]; // Using any for MVP, should be Job type
}

const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const DispatchMap: React.FC<DispatchMapProps> = ({ jobs }) => {
    // Default center (Los Angeles)
    const [center, setCenter] = useState<[number, number]>([34.0522, -118.2437]);

    useEffect(() => {
        // If we have jobs with valid coords, center on the first one or calculate simplified center
        if (jobs.length > 0) {
            const validJob = jobs.find((j: any) => j.customer?.lat && j.customer?.lng);
            if (validJob) {
                setCenter([validJob.customer.lat, validJob.customer.lng]);
            }
        }
    }, [jobs]);

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Component to update view when center changes */}
            <RecenterAutomatically lat={center[0]} lng={center[1]} />

            {jobs.map((job: any) => (
                job.customer?.lat && (
                    <Marker
                        key={job.id}
                        position={[job.customer.lat, job.customer.lng]}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className="block text-slate-800">{job.customer.name}</strong>
                                <span className="text-slate-600">{job.title}</span>
                                <div className={`text-xs mt-1 font-bold ${job.status === 'COMPLETED' ? 'text-emerald-600' :
                                        job.status === 'IN_PROGRESS' ? 'text-blue-600' : 'text-slate-500'
                                    }`}>
                                    {job.status.replace('_', ' ')}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}

export default React.memo(DispatchMap);
