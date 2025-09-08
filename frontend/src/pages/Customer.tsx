import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import Pagination from '../component/Pagination'
import { useThemeStore } from '../store/useThemeStore';

interface Customer { _id:string; name:string; email?:string; phone?:string; company?:string }

export default function Customers(){
  const { theme } = useThemeStore();
  const [customers, setCustomers] = useState<Customer[]>([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(()=>{ fetchCustomers() }, [page, q])  // 👈 re-fetch when page or query changes

  async function fetchCustomers(){
    try{
      const res = await API.get('/customers', { params: { page, limit, q } })
      setCustomers(res.data.customers || [])
      setTotal(res.data.total ?? res.data.customers?.length ?? 0)
    }catch(err){ console.error(err) }
  }

  async function deleteCustomer(id:string){
    if (!confirm('Delete?')) return
    try{ await API.delete(`/customers/${id}`); fetchCustomers() }catch(err){ alert('Delete failed') }
  }

  return (
    <div className="p-6" data-theme={theme}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">+ Add</Link>
      </div>

      <div className="mb-4 flex gap-2">
        {/* Instant search on typing */}
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1) }}
          placeholder="Search"
          className="input input-bordered"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {customers.map(c=> (
          <div key={c._id} className="card p-4 bg-base-100 shadow">
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <p className="text-sm">{c.email} • {c.phone}</p>
            <div className="mt-2 flex gap-2">
              <Link to={`/customers/${c._id}`} className="btn btn-sm">View</Link>
              <Link to={`/customers/${c._id}/edit`} className="btn btn-sm">Edit</Link>
              <button onClick={()=>deleteCustomer(c._id)} className="btn btn-sm btn-error">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {total > limit && (
        <Pagination total={total} page={page} setPage={setPage} limit={limit} />
      )}
    </div>
  )
}
