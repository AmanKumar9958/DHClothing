import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import FadeIn from '../components/FadeIn';
import Title from '../components/Title';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPasword] = useState('')
  const [email,setEmail] = useState('')
  const [otpPhase, setOtpPhase] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const otpDurationSeconds = 10 * 60 // 10 minutes
  const resendCooldownSeconds = 30

  const resetForm = () => {
    setName('');
    setEmail('');
    setPasword('');
    setOtp('');
    setOtpPhase(false);
    setOtpSecondsLeft(0);
    setResendCooldown(0);
  };

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if (currentState === 'Sign Up') {
          if (!otpPhase) {
            const response = await axios.post(backendUrl + '/api/user/register-init',{name,email,password})
            if (response.data.success) {
              setOtpPhase(true);
              toast.success('OTP sent to your email')
              setOtpSecondsLeft(otpDurationSeconds)
              setResendCooldown(resendCooldownSeconds)
            } else {
              toast.error(response.data.message)
            }
          } else {
            const response = await axios.post(backendUrl + '/api/user/register-verify',{email, otp})
            if (response.data.success) {
              toast.success('Email verified. Please login.')
              resetForm()
              setCurrentState('Login')
            } else {
              toast.error(response.data.message || 'Invalid OTP. Please try again.')
              setOtp('')
            }
          }
        } else {
          const response = await axios.post(backendUrl + '/api/user/login', {email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            toast.error(response.data.message)
          }
        }
      } catch (error) {
        console.log(error)
        const message = error.response?.data?.message || error.message || 'Something went wrong'
        toast.error(message)
      }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token, navigate])

  useEffect(() => {
    let interval = null;
    if (otpPhase && (otpSecondsLeft > 0 || resendCooldown > 0)) {
      interval = setInterval(() => {
        setOtpSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        setResendCooldown((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpPhase, otpSecondsLeft, resendCooldown]);

  return (
    <div className='min-h-screen bg-brand-cream flex items-center justify-center py-20 px-4'>
        <FadeIn className='w-full max-w-md'>
            <div className='bg-white p-8 sm:p-12 rounded-3xl shadow-soft border border-neutral-100'>
                <div className='text-center mb-10'>
                    <h1 className='font-display text-3xl font-semibold text-brand-black mb-2'>{currentState === 'Login' ? 'Welcome Back' : otpPhase ? 'Verify Email' : 'Create Account'}</h1>
                    <p className='text-neutral-500 text-sm'>
                        {currentState === 'Login' ? 'Sign in to access your orders and saved items.' : otpPhase ? 'We sent a verification code to your email.' : 'Join us for an exclusive shopping experience.'}
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
                    {currentState === 'Login' ? (
                        <>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-neutral-700 ml-1'>Email</label>
                                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus-ring transition-colors outline-none' placeholder='name@example.com' required/>
                            </div>
                            <div className='space-y-1.5'>
                                <label className='text-sm font-medium text-neutral-700 ml-1'>Password</label>
                                <input onChange={(e)=>setPasword(e.target.value)} value={password} type="password" className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus-ring transition-colors outline-none' placeholder='Enter your password' required/>
                            </div>
                        </>
                    ) : (
                        <>
                            {!otpPhase && (
                                <>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Full Name</label>
                                        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus-ring transition-colors outline-none' placeholder='John Doe' required/>
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Email</label>
                                        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus-ring transition-colors outline-none' placeholder='name@example.com' required/>
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Password</label>
                                        <input onChange={(e)=>setPasword(e.target.value)} value={password} type="password" className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus-ring transition-colors outline-none' placeholder='Create a strong password' required/>
                                    </div>
                                </>
                            )}
                            {otpPhase && (
                                <>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Email Address</label>
                                        <input value={email} disabled className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500 cursor-not-allowed outline-none' />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Verification Code</label>
                                        <input onChange={(e)=>setOtp(e.target.value)} value={otp} type="text" inputMode='numeric' pattern='[0-9]*' maxLength={6} className='w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white focus-ring transition-colors outline-none tracking-[0.5em] text-center font-semibold text-lg' placeholder='000000' required/>
                                    </div>
                                    
                                    <div className='flex items-center justify-between text-sm mt-2'>
                                        {otpSecondsLeft > 0 ? (
                                            <p className='text-neutral-500'>Expires in <span className='font-medium text-brand-black'>{String(Math.floor(otpSecondsLeft/60)).padStart(2,'0')}:{String(otpSecondsLeft%60).padStart(2,'0')}</span></p>
                                        ) : (
                                            <p className='text-red-500'>Code expired</p>
                                        )}
                                        
                                        <button 
                                            type='button' 
                                            className='text-brand-black font-medium hover:text-brand-gold transition-colors disabled:text-neutral-400 disabled:cursor-not-allowed' 
                                            disabled={resendCooldown > 0} 
                                            onClick={async ()=>{
                                                try {
                                                    const response = await axios.post(backendUrl + '/api/user/register-init',{name,email,password})
                                                    if (response.data.success) {
                                                        toast.success('OTP resent')
                                                        setOtpSecondsLeft(otpDurationSeconds)
                                                        setResendCooldown(resendCooldownSeconds)
                                                    } else toast.error(response.data.message)
                                                } catch(err){ toast.error('Failed to resend OTP') }
                                            }}
                                        >
                                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <div className='flex justify-between items-center text-sm font-medium mt-2'>
                        {currentState === 'Login' ? (
                            <button type="button" onClick={()=>navigate('/forgot-password')} className='text-neutral-500 hover:text-brand-black transition-colors'>Forgot Password?</button>
                        ) : <div></div>}
                    </div>

                    <button type="submit" className='btn-primary w-full py-4 mt-2 rounded-xl text-base'>
                        {currentState === 'Login' ? 'Sign In' : otpPhase ? 'Verify & Continue' : 'Create Account'}
                    </button>
                </form>

                <div className='mt-8 pt-8 border-t border-neutral-100 text-center text-sm'>
                    <p className='text-neutral-500'>
                        {currentState === 'Login' ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button"
                            onClick={()=>{
                                resetForm(); 
                                setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')
                            }} 
                            className='font-semibold text-brand-black hover:text-brand-gold transition-colors'
                        >
                            {currentState === 'Login' ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </FadeIn>
    </div>
  )
}

export default Login
