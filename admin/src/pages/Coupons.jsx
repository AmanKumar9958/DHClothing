import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'

const Coupons = ({ token }) => {

  const [code, setCode] = useState('')
  const [type, setType] = useState('percent')
  const [value, setValue] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/coupon/list', { headers: { token } })
      if (response.data.success) setCoupons(response.data.coupons)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ fetchCoupons() }, [token])

  const onAdd = async () => {
    try {
      const payload = { code, type, value: Number(value), expiresAt: expiresAt ? new Date(expiresAt).getTime() : null }
      const response = await axios.post(backendUrl + '/api/coupon/create', payload, { headers: { token } })
      if (response.data.success) {
        toast.success('Coupon added')
        setCode(''); setValue(''); setExpiresAt(''); setType('percent')
        fetchCoupons()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggle = async (id, active) => {
    try {
      const response = await axios.post(backendUrl + '/api/coupon/toggle', { couponId: id, active }, { headers: { token } })
      if (response.data.success) fetchCoupons()
    } catch (error) { toast.error(error.message) }
  }

  return (
    <div>
      <h3 className='text-xl font-medium mb-4'>Manage Coupons</h3>
      <div className='border p-4 mb-6'>
        <div className='flex gap-3'>
          <input value={code} onChange={e=>setCode(e.target.value)} className='border p-2' placeholder='Code (e.g. GET10OFF)' />
          <select value={type} onChange={e=>setType(e.target.value)} className='border p-2'>
            <option value='percent'>Percent (%)</option>
            <option value='fixed'>Fixed (₹)</option>
          </select>
          <input value={value} onChange={e=>setValue(e.target.value)} className='border p-2' placeholder='Value' />
          <input value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} type='date' className='border p-2'  placeholder='Expiration Date' />
          <button onClick={onAdd} className='bg-black text-white px-4 py-2'>Add Coupon</button>
        </div>
      </div>

      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          coupons.map((c)=> (
            <div key={c._id} className='flex items-center justify-between border p-3 mb-2'>
              <div>
                <p className='font-medium'>{c.code} {c.type === 'percent' ? `(${c.value}%)` : `(₹${c.value})`}</p>
                <p className='text-xs text-gray-500'>Expires: {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</p>
              </div>
              <div>
                <button onClick={()=>toggle(c._id, !c.active)} className={`px-3 py-1 rounded ${c.active ? 'bg-green-400' : 'bg-gray-300'}`}>{c.active ? 'Active' : 'Inactive'}</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Coupons
