export default function Index() {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Incidents', value: '3', color: 'text-danger' },
          { label: 'Events Processed/s', value: '4,281', color: 'text-primary' },
          { label: 'Anomalies Detected', value: '12', color: 'text-yellow-400' },
          { label: 'System Health', value: '98.5%', color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-gray-800 shadow-sm">
            <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents Panel */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-gray-800 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Recent Incidents</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 flex justify-between items-center">
              <div>
                <h4 className="text-danger font-medium">Memory Leak Detected</h4>
                <p className="text-sm text-gray-400 mt-1">auth-service • 10 mins ago</p>
              </div>
              <button className="px-4 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                View Trace
              </button>
            </div>
            
            <div className="p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex justify-between items-center">
              <div>
                <h4 className="text-yellow-400 font-medium">High Latency Alert</h4>
                <p className="text-sm text-gray-400 mt-1">payment-service • 25 mins ago</p>
              </div>
              <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-500/30 transition-colors">
                Analyze AI
              </button>
            </div>
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="bg-surface rounded-xl border border-gray-800 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Live Kafka Stream</h3>
          <div className="font-mono text-xs space-y-2 text-gray-400 bg-gray-900/50 p-4 rounded-lg h-[300px] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 pointer-events-none"></div>
            <p><span className="text-primary">[INFO]</span> ingest-service: Log parsed OK</p>
            <p><span className="text-danger">[WARN]</span> auth-service: Rate limit near</p>
            <p><span className="text-primary">[INFO]</span> ingest-service: 50 events sent</p>
            <p><span className="text-green-400">[SYST]</span> anomaly-detector: Model loaded</p>
            <p><span className="text-primary">[INFO]</span> ingest-service: Log parsed OK</p>
          </div>
        </div>
      </div>
    </div>
  );
}
