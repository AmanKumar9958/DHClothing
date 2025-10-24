import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext)

  const [step, setStep] = useState(1) // 1: enter email, 2: enter otp, 3: new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const otpDurationSeconds = 10 * 60
  const resendCooldownSeconds = 30

  const sendOtp = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/user/forgot-init', { email })
      if (res.data.success) {
        toast.success('OTP sent to your email')
        setStep(2)
        setOtpSecondsLeft(otpDurationSeconds)
        setResendCooldown(resendCooldownSeconds)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      const m = err.response?.data?.message || err.message || 'Failed to send OTP'
      toast.error(m)
    }
  }

  const verifyOtp = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/user/forgot-verify', { email, otp })
      if (res.data.success) {
        toast.success('OTP verified. Please set a new password')
        setStep(3)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      const m = err.response?.data?.message || err.message || 'Failed to verify OTP'
      toast.error(m)
    }
  }

  const submitNewPassword = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/user/forgot-reset', { email, newPassword })
      if (res.data.success) {
        toast.success('Password updated. Login with new password')
        navigate('/login')
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      const m = err.response?.data?.message || err.message || 'Failed to reset password'
      toast.error(m)
    }
  }

  // OTP countdown and resend cooldown timers
  useEffect(() => {
    let interval = null
    if (step === 2 && (otpSecondsLeft > 0 || resendCooldown > 0)) {
      interval = setInterval(() => {
        setOtpSecondsLeft((s) => (s > 0 ? s - 1 : 0))
        setResendCooldown((s) => (s > 0 ? s - 1 : 0))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [step, otpSecondsLeft, resendCooldown])

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Forgot Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {step === 1 && (
        <>
          <p className='text-sm text-gray-600'>Enter the email associated with your account</p>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
          <button onClick={sendOtp} className='bg-black text-white font-light px-8 py-2 mt-4'>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <p className='text-sm text-gray-600'>Enter the 6-digit code sent to <b>{email}</b></p>
          <input value={otp} onChange={(e)=>setOtp(e.target.value)} inputMode='numeric' pattern='[0-9]*' maxLength={6} className='w-full px-3 py-2 border border-gray-800 tracking-widest text-center' placeholder='Enter OTP' />
          <div className='w-full flex justify-between items-center gap-4'>
            <button onClick={()=>{ setStep(1); setOtp('') }} className='text-sm underline'>Change email</button>
            <div className='flex items-center gap-3'>
              <button disabled={resendCooldown>0} onClick={async ()=>{ await sendOtp(); }} className='text-sm underline'>{resendCooldown>0?`Resend in ${resendCooldown}s`:'Resend OTP'}</button>
              {otpSecondsLeft>0 && <p className='text-sm text-gray-600'>Expires in {String(Math.floor(otpSecondsLeft/60)).padStart(2,'0')}:{String(otpSecondsLeft%60).padStart(2,'0')}</p>}
            </div>
          </div>
          <button onClick={verifyOtp} className='bg-black text-white font-light px-8 py-2 mt-4'>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <p className='text-sm text-gray-600'>Set a new password for <b>{email}</b></p>
          <input value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} type='password' className='w-full px-3 py-2 border border-gray-800' placeholder='New password' />
          <div className='w-full flex justify-between'>
            <button onClick={()=>setStep(2)} className='text-sm underline'>Back</button>
          </div>
          <button onClick={submitNewPassword} className='bg-black text-white font-light px-8 py-2 mt-4'>Set Password</button>
        </>
      )}

    </div>
  )
}

export default ForgotPassword
