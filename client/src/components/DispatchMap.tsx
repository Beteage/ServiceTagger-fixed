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
    jobs: any[];
    customers?: any[];
}


const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const DispatchMap: React.FC<DispatchMapProps> = ({ jobs, customers = [] }) => {
    // Default center (Los Angeles)
    const [center, setCenter] = useState<[number, number]>([34.0522, -118.2437]);

    useEffect(() => {
        // If we have jobs with valid coords, center on the first one or calculate simplified center
        if (jobs.length > 0) {
            const validJob = jobs.find((j: any) => j.customer?.lat && j.customer?.lng);
            if (validJob) {
                setCenter([validJob.customer.lat, validJob.customer.lng]);
            }
        } else if (customers.length > 0) {
            const validCust = customers.find((c: any) => c.lat && c.lng);
            if (validCust) setCenter([validCust.lat, validCust.lng]);
        }
    }, [jobs, customers]);

    // Blue Icon for Jobs
    const jobIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Violet Icon for Customers
    const customerIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Component to update view when center changes */}
            <RecenterAutomatically lat={center[0]} lng={center[1]} />

            {/* Render Job Markers */}
            {jobs.map((job: any) => (
                job.customer?.lat && (
                    <Marker
                        key={`job-${job.id}`}
                        position={[job.customer.lat, job.customer.lng]}
                        icon={jobIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className="block text-slate-800">Job: {job.customer.name}</strong>
                                <span className="text-slate-600 block">{job.customer.address}</span>
                                <div className={`text-xs mt-1 font-bold ${job.status === 'Done' ? 'text-emerald-600' :
                                    job.status === 'Working' ? 'text-blue-600' : 'text-slate-500'
                                    }`}>
                                    {job.status}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}

            {/* Render Customer Markers */}
            {customers.map((customer: any) => (
                customer.lat && (
                    <Marker
                        key={`cust-${customer.id}`}
                        position={[customer.lat, customer.lng]}
                        icon={customerIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className="block text-slate-800">Customer: {customer.name}</strong>
                                <span className="text-slate-600 block">{customer.address}</span>
                                <div className="text-xs text-slate-400 mt-1">Has {customer.jobs?.length || 0} jobs</div>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}

export default React.memo(DispatchMap);
