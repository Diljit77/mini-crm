import  { useEffect, useState } from 'react'
import API from '../utils/api'
import { Link } from 'react-router-dom'
import { useThemeStore } from '../store/useThemeStore';


export default function Dashboard(){
const [stats, setStats] = useState({ customers: 0, leads: 0 })
 const { theme } = useThemeStore();

useEffect(()=>{

API.get('/customers').then(res => setStats(s => ({ ...s, customers: res.data.total || res.data.customers?.length || 0 }))).catch(()=>{})
API.get('/report/leads-by-status').then(res => setStats(s => ({ ...s, leads: res.data.reduce((a:any,b:any)=>a+b.count,0) }))).catch(()=>{})
},[])


return (
  <div className="p-6 " data-theme={theme}>
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="card p-4 bg-base-100 shadow">
        <div className="text-sm">Customers</div>
        <div className="text-2xl font-bold">{stats.customers}</div>
      </div>
      <div className="card p-4 bg-base-100 shadow">
        <div className="text-sm">Leads</div>
        <div className="text-2xl font-bold">{stats.leads}</div>
      </div>
    </div>

    {stats.customers === 0 && (
      <div className="card bg-base-100 p-6 text-center shadow">
        <p className="mb-4 text-gray-600">No customers yet. Start by adding your first one!</p>
        <Link to="/customers/new" className="btn btn-primary">+ Add Customer</Link>
      </div>
    )}

    {stats.customers > 0 && stats.leads === 0 && (
      <div className="card bg-base-100 p-6 text-center shadow">
        <p className="mb-4 text-gray-600">
          You have customers but no leads yet. Open a customer profile and add your first lead.
        </p>
      </div>
    )}
  </div>
)
}