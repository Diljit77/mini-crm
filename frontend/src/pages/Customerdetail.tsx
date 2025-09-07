import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../utils/api'
import { useThemeStore } from '../store/useThemeStore';

type Lead = { _id:string; title:string; description?:string; status:string; value:number }

export default function CustomerDetail(){
   const { theme } = useThemeStore();
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState('All')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title:'', description:'', status:'New', value:0 })

  useEffect(()=>{ if (id) load() }, [id])

  async function load(){
    const res = await API.get(`/customers/${id}`)
    setCustomer(res.data.customer)
    setLeads(res.data.leads)
  }

  async function createLead(e?: React.FormEvent){
    e?.preventDefault()
    try{
      await API.post(`/customers/${id}/leads`, form)
      setForm({ title:'', description:'', status:'New', value:0 })
      setCreating(false)
      load()
    }catch(err){ alert('Create failed') }
  }

  async function deleteLead(leadId:string){
    if (!confirm('Delete lead?')) return
    try{ await API.delete(`/customers/${id}/leads/${leadId}`); load() }catch(err){ alert('Delete failed') }
  }

  async function updateLead(leadId:string, data: Partial<Lead>){
    try{ await API.put(`/customers/${id}/leads/${leadId}`, data); load() }catch(err){ alert('Update failed') }
  }

  const filtered = leads.filter(l => filter === 'All' ? true : l.status === filter)

  return (
    <div className="p-6" data-theme={theme}>
      <h1 className="text-2xl font-bold">{customer?.name}</h1>
      <p className="text-sm text-gray-500">{customer?.company} • {customer?.email}</p>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Leads</h2>
          <div className="flex gap-2">
            <select className="select select-bordered" value={filter} onChange={e => setFilter(e.target.value)}>
              <option>All</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>
            <button className="btn btn-sm" onClick={() => setCreating(!creating)}>{creating ? 'Cancel' : '+ Add Lead'}</button>
          </div>
        </div>

        {creating && (
          <form onSubmit={createLead} className="card p-4 mb-4 bg-base-100">
            <input className="input input-bordered w-full mb-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
            <textarea className="textarea textarea-bordered w-full mb-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <div className="flex gap-2">
              <select className="select select-bordered" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
                <option>Lost</option>
              </select>
              <input type="number" className="input input-bordered" placeholder="Value" value={String(form.value)} onChange={e=>setForm({...form, value: Number(e.target.value)})} />
              <button className="btn btn-primary">Create</button>
            </div>
          </form>
        )}

        <div className="grid gap-3">
          {filtered.map(l => (
            <div className="card p-3 bg-base-100 shadow" key={l._id}>
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{l.title}</div>
                  <div className="text-sm text-gray-500">{l.status} • ${l.value}</div>
                </div>
                <div className="flex gap-2">
                  <select value={l.status} onChange={e=>updateLead(l._id, { status: e.target.value })} className="select select-sm select-bordered">
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Converted</option>
                    <option>Lost</option>
                  </select>
                  <button onClick={()=>deleteLead(l._id)} className="btn btn-sm btn-error">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
