import { Users, UserCheck, Loader } from 'lucide-react';
import { useData } from '../contexts/fetchDataContext';

const stats = [
  { label: 'Total Students', value: '2,345', icon: Users, color: 'bg-purple-600' },
  { label: 'Pending Approvals', value: '18', icon: UserCheck, color: 'bg-yellow-500' },
  { label: 'Active Sessions', value: '12', icon: Loader, color: 'bg-green-500' },
];


export function DashboardHome() {
  const {egroup} = useData()
  console.log('zakamo', egroup);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  New student registration
                </p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}