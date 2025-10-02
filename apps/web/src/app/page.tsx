export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm bg-gray-900">
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <span>Stemphone</span>
        </div>
        <div className="flex items-center gap-2">
          <span>100%</span>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-full h-full bg-green-500 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-light">Stemphone</h1>
          <p className="text-gray-400 mt-2">Ready to connect</p>
        </div>

        {/* Quick Actions */}
        <div className="flex-1 px-6 py-4">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="bg-green-600 hover:bg-green-700 rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">📞</span>
              </div>
              <span className="font-medium">Call</span>
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">💬</span>
              </div>
              <span className="font-medium">Message</span>
            </button>

            <button className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
              <span className="font-medium">Contacts</span>
            </button>

            <button className="bg-orange-600 hover:bg-orange-700 rounded-2xl p-6 flex flex-col items-center gap-3 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">⚙️</span>
              </div>
              <span className="font-medium">Settings</span>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-lg font-medium mb-4">Recent</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">JD</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-400">2 minutes ago</div>
                </div>
                <div className="text-green-500">📞</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-900 px-6 py-4">
          <div className="flex justify-around">
            <button className="flex flex-col items-center gap-1 text-white">
              <span className="text-xl">🏠</span>
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500">
              <span className="text-xl">📞</span>
              <span className="text-xs">Dialer</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500">
              <span className="text-xl">📋</span>
              <span className="text-xs">History</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500">
              <span className="text-xl">👤</span>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
