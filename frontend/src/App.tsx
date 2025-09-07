import  { useEffect, type ReactNode } from 'react'
import {  Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Dashboard from './pages/Dashbooard'
import Customers from './pages/Customer'
import CustomerDetail from './pages/Customerdetail'
import Layout from './component/Layout'
import CustomerForm from './pages/CustomerForm'
import Reports from './pages/Report'
import { useAuthStore } from './store/useAuthStore'
import { Toaster } from 'react-hot-toast'

function PrivateRoute({ children }: { children:ReactNode }){
const token = localStorage.getItem('token')
if (!token) return <Navigate to='/' />
return children
}


export default function App(){
      const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

return (
<>
<Toaster />
<Routes>
<Route path='/' element={<Login/>} />
<Route path='/signup' element={<SignUp/>} />


<Route path='/' element={<Layout/>}>
<Route path='dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>} />
<Route path='customers' element={<PrivateRoute><Customers/></PrivateRoute>} />
<Route path='customers/:id' element={<PrivateRoute><CustomerDetail/></PrivateRoute>} />
<Route path='customers/new' element={<PrivateRoute><CustomerForm/></PrivateRoute>} />
<Route path='customers/:id/edit' element={<PrivateRoute><CustomerForm/></PrivateRoute>} />
<Route path='reports' element={<PrivateRoute><Reports/></PrivateRoute>} />
</Route>


</Routes>
</>

)
}
