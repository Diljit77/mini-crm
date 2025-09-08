import { useEffect, useState } from 'react'
import API from '../utils/api'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useThemeStore } from '../store/useThemeStore'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Reports() {
  const [data, setData] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all")
  const { theme } = useThemeStore()

  useEffect(() => {
    API.get('/customers')
      .then(res => setCustomers(res.data.customers || []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    const url = selectedCustomer === "all"
      ? '/report/leads-by-status'
      : `/report/leads-by-status/${selectedCustomer}`

    API.get(url)
      .then(res => setData(res.data))
      .catch(console.error)
  }, [selectedCustomer])

  const labels = data.map(d => d._id)
  const counts = data.map(d => d.count)

  const colors: Record<string, string> = {
    New: '#3B82F6',
    Contacted: '#FACC15',
    Converted: '#22C55E',
    Lost: '#EF4444',
  }

  return (
    <div className="p-6" data-theme={theme}>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* Dropdown to filter by customer */}
      <div className="mb-4">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="select select-bordered"
        >
          <option value="all">All Customers</option>
          {customers.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="max-w-md">
        <Pie
          data={{
            labels,
            datasets: [
              {
                data: counts,
                label: 'Leads by status',
                backgroundColor: labels.map(l => colors[l] || '#9CA3AF'),
              },
            ],
          }}
        />
      </div>
    </div>
  )
}
