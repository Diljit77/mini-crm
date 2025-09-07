
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Home, Users, LogOut, DockIcon } from 'lucide-react'
import ThemeSelector from './ThemeSelector'
import { useThemeStore } from '../store/useThemeStore'

export default function Layout(){
const navigate = useNavigate()
const logout = () => { localStorage.removeItem('token'); navigate('/') }
 const { theme } = useThemeStore();

return (
<div className="min-h-screen bg-base-200" data-theme={theme}>
<div className="drawer drawer-mobile">
<input id="my-drawer" type="checkbox" className="drawer-toggle" />
<div className="drawer-content p-4">
<nav className="navbar bg-base-100 rounded-box mb-4">
<div className="flex-1">
<button className="btn btn-ghost " onClick={() => document.getElementById('my-drawer')!.click()}>☰</button>
<span className="text-lg font-bold">Mini CRM</span>
</div>
<div className="flex-none">
<ThemeSelector />
<button className="btn btn-ghost" onClick={logout}><LogOut/></button>
</div>
</nav>


<Outlet />
</div>
<div className="drawer-side">
<label htmlFor="my-drawer" className="drawer-overlay"></label>
<ul className="menu p-4 w-80 bg-base-100 text-base-content">
<li><Link to="/dashboard"><Home/> Dashboard</Link></li>
<li><Link to="/customers"><Users/> Customers</Link></li>
<li><Link to="/reports"><DockIcon/> Reports</Link></li>
</ul>
</div>
</div>
</div>
)
}