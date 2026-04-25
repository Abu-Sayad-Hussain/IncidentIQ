'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Index() {
  const [incidents, setIncidents] = useState<any[]>([
    { title: 'Memory Leak Detected', serviceName: 'auth-service', time: '10 mins ago', type: 'danger' },
    { title: 'High Latency Alert', serviceName: 'payment-service', time: '25 mins ago', type: 'warning' }
  ]);

  useEffect(() => {
    const socket = io('http://localhost:3003', {
      reconnectionDelayMax: 10000,
    });

    socket.on('connect', () => {
      console.log('Dashboard connected to Real-time Notification Gateway:', socket.id);
    });

    socket.on('incident.new', (incident) => {
      setIncidents((prev) => [
        {
          title: incident.message || 'Incoming Anomaly Alert',
          serviceName: incident.serviceName || 'unknown-service',
          time: 'Just now',
          type: incident.level === 'CRITICAL' || incident.level === 'ERROR' ? 'danger' : 'warning',
        },
        ...prev
      ].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Incidents', value: incidents.length.toString(), color: 'text-danger' },
          { label: 'Events Processed/s', value: '4,281', color: 'text-primary' },
          { label: 'Anomalies Detected', value: '12', color: 'text-yellow-400' },
          { label: 'System Health', value: '98.5%', color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-gray-800 shadow-sm transition-all duration-300">
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents Panel */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-gray-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-100">Live Incident Feed</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div className="space-y-4">
            {incidents.map((incident, idx) => (
              <div key={idx} className={`p-4 rounded-lg border flex justify-between items-center transition-all duration-500 ease-in-out ${
                incident.type === 'danger' ? 'bg-danger/10 border-danger/20' : 'bg-yellow-400/10 border-yellow-400/20'
              }`}>
                <div>
                  <h4 className={incident.type === 'danger' ? 'text-danger font-medium' : 'text-yellow-400 font-medium'}>
                    {incident.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">{incident.serviceName} • {incident.time}</p>
                </div>
                <button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  incident.type === 'danger' ? 'bg-danger text-white hover:bg-red-600' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                }`}>
                  Analyze Context
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="bg-surface rounded-xl border border-gray-800 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Pipeline Diagnostics</h3>
          <div className="font-mono text-xs space-y-2 text-gray-400 bg-gray-900/50 p-4 rounded-lg h-[300px] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 pointer-events-none"></div>
            <p><span className="text-primary">[INFO]</span> Connected to WSS Gateway</p>
            <p><span className="text-primary">[INFO]</span> ingest-service: Log parsed OK</p>
            <p><span className="text-danger">[WARN]</span> auth-service: Rate limit near</p>
            <p><span className="text-green-400">[SYST]</span> anomaly-detector: Model loaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
