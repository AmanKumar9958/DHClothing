import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import FadeIn from '../components/FadeIn';

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
            // initiate signup -> send OTP
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
            // verify OTP
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

  // OTP countdown and resend cooldown timers
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
    <FadeIn>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10'>
              <p className='prata-regular text-3xl'>{currentState}</p>
              <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
          </div>
          {currentState === 'Login' ? (
            <>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
              <input onChange={(e)=>setPasword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
            </>
          ) : (
            <>
              {!otpPhase && (
                <>
                  <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>
                  <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
                  <input onChange={(e)=>setPasword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
                </>
              )}
              {otpPhase && (
                <>
                  <p className='text-sm text-gray-600 w-full'>Enter the 6-digit code sent to <b>{email}</b></p>
                  <input value={email} disabled className='w-full px-3 py-2 border border-gray-800 bg-gray-100 text-gray-500' />
                  <input onChange={(e)=>setOtp(e.target.value)} value={otp} type="text" inputMode='numeric' pattern='[0-9]*' maxLength={6} className='w-full px-3 py-2 border border-gray-800 tracking-widest text-center' placeholder='Enter OTP' required/>
                  <div className='flex items-center gap-4'>
                    <button type='button' className='text-sm underline' disabled={resendCooldown>0} onClick={async ()=>{
                      try {
                        const response = await axios.post(backendUrl + '/api/user/register-init',{name,email,password})
                        if (response.data.success) {
                          toast.success('OTP resent')
                          setOtpSecondsLeft(otpDurationSeconds)
                          setResendCooldown(resendCooldownSeconds)
                        } else toast.error(response.data.message)
                      } catch(err){ toast.error('Failed to resend OTP') }
                    }}>{resendCooldown>0?`Resend in ${resendCooldown}s`:'Resend OTP'}</button>
                    {otpSecondsLeft>0 && <p className='text-sm text-gray-600'>Expires in {String(Math.floor(otpSecondsLeft/60)).padStart(2,'0')}:{String(otpSecondsLeft%60).padStart(2,'0')}</p>}
                  </div>
                </>
              )}
            </>
          )}
          <div className='w-full flex justify-between text-sm mt-[-8px]'>
              {
                currentState === 'Login' 
                ? <p className=' cursor-pointer' onClick={()=>navigate('/forgot-password')}>Forgot Password?</p>
                : <div></div>
              }
              {
                currentState === 'Login' 
                ? <p onClick={()=>{resetForm(); setCurrentState('Sign Up')}} className=' cursor-pointer'>Create account</p>
                : <p onClick={()=>{resetForm(); setCurrentState('Login')}} className=' cursor-pointer'>Login Here</p>
              }
          </div>
          <button className='bg-black text-white font-light px-8 py-2 mt-4'>
            {currentState === 'Login' ? 'Sign In' : otpPhase ? 'Verify OTP' : 'Sign Up'}
          </button>
      </form>
    </FadeIn>
  )
}

export default Login
