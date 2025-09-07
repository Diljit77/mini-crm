import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';

type FormState = { name: string; email?: string; phone?: string; company?: string };

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', company: '' });
 const { theme } = useThemeStore();
  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true);
      API.get(`/customers/${id}`).then(res => {
        setForm({
          name: res.data.customer.name || '',
          email: res.data.customer.email || '',
          phone: res.data.customer.phone || '',
          company: res.data.customer.company || ''
        });
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && id !== 'new') {
        await API.put(`/customers/${id}`, form);
      } else {
        await API.post('/customers', form);
      }
      navigate('/customers');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div className="p-6" data-theme={theme}>
      <h1 className="text-xl font-bold mb-4">{id && id !== 'new' ? 'Edit Customer' : 'Add Customer'}</h1>
      <form onSubmit={submit} className="max-w-lg">
        <input className="input input-bordered w-full mb-2" placeholder="Name" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input input-bordered w-full mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="input input-bordered w-full mb-2" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input className="input input-bordered w-full mb-2" placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/customers')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
