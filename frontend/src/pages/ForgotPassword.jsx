import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import FadeIn from '../components/FadeIn'

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
    <div className='min-h-screen bg-brand-cream flex items-center justify-center py-20 px-4'>
        <FadeIn className='w-full max-w-md'>
            <div className='bg-white p-8 sm:p-12 rounded-3xl shadow-soft border border-neutral-100'>
                <div className='text-center mb-10'>
                    <h1 className='font-display text-3xl font-semibold text-brand-black mb-2'>
                        {step === 1 ? 'Reset Password' : step === 2 ? 'Verify Email' : 'New Password'}
                    </h1>
                    <p className='text-neutral-500 text-sm'>
                        {step === 1 ? 'Enter your email to receive a reset code.' : step === 2 ? 'We sent a verification code to your email.' : 'Please enter a new, secure password.'}
                    </p>
                </div>

                <div className='flex flex-col gap-5'>
                    {step === 1 && (
                        <>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-neutral-700 ml-1'>Email Address</label>
                                <input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus-ring transition-colors outline-none' placeholder='name@example.com' required />
                            </div>
                            <button onClick={sendOtp} className='btn-primary w-full py-4 mt-2 rounded-xl text-base'>Send Reset Code</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-neutral-700 ml-1'>Email Address</label>
                                <input value={email} disabled className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500 cursor-not-allowed outline-none' />
                            </div>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-neutral-700 ml-1'>Verification Code</label>
                                <input value={otp} onChange={(e)=>setOtp(e.target.value)} inputMode='numeric' pattern='[0-9]*' maxLength={6} className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white focus-ring transition-colors outline-none tracking-[0.5em] text-center font-semibold text-lg' placeholder='000000' required />
                            </div>
                            
                            <div className='flex items-center justify-between text-sm mt-2'>
                                {otpSecondsLeft > 0 ? (
                                    <p className='text-neutral-500'>Expires in <span className='font-medium text-brand-black'>{String(Math.floor(otpSecondsLeft/60)).padStart(2,'0')}:{String(otpSecondsLeft%60).padStart(2,'0')}</span></p>
                                ) : (
                                    <p className='text-red-500'>Code expired</p>
                                )}
                                <div className='flex items-center gap-3'>
                                    <button onClick={()=>{ setStep(1); setOtp('') }} className='text-neutral-500 hover:text-brand-black transition-colors'>Change email</button>
                                    <button 
                                        className='text-brand-black font-medium hover:text-brand-gold transition-colors disabled:text-neutral-400 disabled:cursor-not-allowed' 
                                        disabled={resendCooldown > 0} 
                                        onClick={async ()=>{ await sendOtp(); }}
                                    >
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                                    </button>
                                </div>
                            </div>
                            <button onClick={verifyOtp} className='btn-primary w-full py-4 mt-2 rounded-xl text-base'>Verify Code</button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-neutral-700 ml-1'>New Password</label>
                                <input value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} type='password' className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus-ring transition-colors outline-none' placeholder='Enter new password' required />
                            </div>
                            
                            <div className='flex justify-between items-center text-sm font-medium mt-2'>
                                <button onClick={()=>setStep(2)} className='text-neutral-500 hover:text-brand-black transition-colors'>Back to Code</button>
                            </div>
                            
                            <button onClick={submitNewPassword} className='btn-primary w-full py-4 mt-2 rounded-xl text-base'>Set Password & Login</button>
                        </>
                    )}
                </div>
            </div>
        </FadeIn>
    </div>
  )
}

export default ForgotPassword
