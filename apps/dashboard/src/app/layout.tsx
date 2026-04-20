import './global.css';

export const metadata = {
  title: 'IncidentIQ Dashboard',
  description: 'AI-Powered Autonomous Debugging & Incident Resolution Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-primary tracking-tight">IncidentIQ</h1>
            <p className="text-xs text-gray-400 mt-1">Autonomous Debugging</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <a href="#" className="block px-4 py-2 rounded-md bg-primary/10 text-primary font-medium">Dashboard</a>
            <a href="#" className="block px-4 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">Incidents</a>
            <a href="#" className="block px-4 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">Log Stream</a>
            <a href="#" className="block px-4 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">AI Analysis</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-surface border-b border-gray-800">
            <h2 className="text-lg font-medium text-gray-100">Platform Overview</h2>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-700"></div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
