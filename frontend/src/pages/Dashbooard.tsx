import { useEffect, useState } from 'react'
import API from '../utils/api'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Link } from 'react-router-dom'
import { useThemeStore } from '../store/useThemeStore'
ChartJS.register(ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, leads: 0 })
  const [leadsData, setLeadsData] = useState<any[]>([])
  const { theme } = useThemeStore()

  useEffect(() => {
    API.get('/customers')
      .then(res => setStats(s => ({ ...s, customers: res.data.total || res.data.customers?.length || 0 })))
      .catch(() => {})

    API.get('/report/leads-by-status')
      .then(res => {
        setStats(s => ({ ...s, leads: res.data.reduce((a: any, b: any) => a + b.count, 0) }))
        setLeadsData(res.data)
      })
      .catch(console.error)
  }, [])

  const labels = leadsData.map(d => d._id)
  const counts = leadsData.map(d => d.count)

  const colors: Record<string, string> = {
    New: '#3B82F6',
    Contacted: '#FACC15',
    Converted: '#22C55E',
    Lost: '#EF4444',
  }

  return (
    <div className="p-6" data-theme={theme}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/customers/new" className="btn btn-primary">+ Add Customer</Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 bg-base-100 shadow flex flex-col justify-between">
          <div>
            <div className="text-sm">Customers</div>
            <div className="text-2xl font-bold">{stats.customers}</div>
          </div>
        </div>
        <div className="card p-4 bg-base-100 shadow flex flex-col justify-between">
          <div>
            <div className="text-sm">Leads</div>
            <div className="text-2xl font-bold">{stats.leads}</div>
          </div>
        </div>
      </div>


      {leadsData.length > 0 && (
        <div className="card bg-base-100 p-6 shadow max-w-md mx-auto">
          <h2 className="text-lg text-center font-semibold mb-4">Leads by Status</h2>
          <Pie
            data={{
              labels,
              datasets: [
                {
                  data: counts,
                  backgroundColor: labels.map(l => colors[l] || '#9CA3AF'),
                  label: 'Leads by status',
                },
              ],
            }}
          />
        </div>
      )}


      {stats.customers === 0 && (
        <div className="card bg-base-100 p-6 text-center shadow mt-6">
          <p className="mb-4 text-gray-600">No customers yet. Start by adding your first one!</p>
          <Link to="/customers/new" className="btn btn-primary">+ Add Customer</Link>
        </div>
      )}

      {stats.customers > 0 && stats.leads === 0 && (
        <div className="card bg-base-100 p-6 text-center shadow mt-6">
          <p className="mb-4 text-gray-600">
            You have customers but no leads yet. Open a customer profile and add your first lead.
          </p>
          <Link to="/customers/new" className="btn btn-sm btn-outline">+ Add Customer</Link>
        </div>
      )}
    </div>
  )
}
