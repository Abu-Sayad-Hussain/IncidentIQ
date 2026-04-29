'use client';

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Index() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [healthData, setHealthData] = useState<{ time: string; errors: number; info: number }[]>([]);
  const errorCountRef = useRef(0);
  const infoCountRef = useRef(0);

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
      ].slice(0, 10)); // Keep last 10 incidents
    });

    socket.on('log.new', (log) => {
      // Accumulate for charting
      if (log.level === 'ERROR' || log.level === 'CRITICAL') {
        errorCountRef.current += 1;
      } else {
        infoCountRef.current += 1;
      }

      setLogs((prev) => [
        {
          text: `[${log.level}] ${log.serviceName}: ${log.message}`,
          color: log.level === 'ERROR' || log.level === 'CRITICAL' ? 'text-danger' : log.level === 'WARN' ? 'text-yellow-400' : 'text-primary'
        },
        ...prev
      ].slice(0, 30)); // Keep last 30 logs in buffer
    });

    // Tick the health chart every 3 seconds
    const interval = setInterval(() => {
      setHealthData(prev => {
        const newData = [
          ...prev, 
          { 
            time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }), 
            errors: errorCountRef.current, 
            info: infoCountRef.current 
          }
        ].slice(-15); // Show last 15 ticks on chart
        
        // Reset counters for next tick window
        errorCountRef.current = 0;
        infoCountRef.current = 0;
        
        return newData;
      });
    }, 3000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Incidents', value: incidents.length.toString(), color: 'text-danger' },
          { label: 'Pipeline Ticks', value: healthData.length.toString(), color: 'text-primary' },
          { label: 'Total Logs Parsed', value: logs.length.toString(), color: 'text-yellow-400' },
          { label: 'System Health', value: incidents.length === 0 ? '100%' : 'Critical', color: incidents.length === 0 ? 'text-green-400' : 'text-danger' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-gray-800 shadow-sm transition-all duration-300">
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Health Chart */}
        <div className="lg:col-span-3 bg-surface rounded-xl border border-gray-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-100">Live Throughput & Error Rate</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Area type="monotone" dataKey="info" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInfo)" isAnimationActive={false} />
                <Area type="monotone" dataKey="errors" stroke="#ef4444" fillOpacity={1} fill="url(#colorErrors)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Incidents Panel */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-gray-800 shadow-sm p-6 overflow-y-auto max-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-100">Actionable Incidents</h3>
            {incidents.length > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div className="space-y-4">
            {incidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <div className="text-4xl mb-2">✨</div>
                <p>System is stable. No active incidents.</p>
              </div>
            ) : (
              incidents.map((incident, idx) => (
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
                    Review Context
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="bg-surface rounded-xl border border-gray-800 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Raw Log Stream</h3>
          <div className="font-mono text-xs space-y-2 text-gray-400 bg-gray-900/50 p-4 rounded-lg h-[320px] overflow-y-auto relative flex flex-col-reverse">
            {logs.length === 0 ? (
              <p className="text-center text-gray-600 mt-20">Awaiting Log Ingestion...</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className={`whitespace-nowrap overflow-hidden text-ellipsis ${log.color}`}>
                  {log.text}
                </p>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
