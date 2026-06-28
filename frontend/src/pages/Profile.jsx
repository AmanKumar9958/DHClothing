import { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import FadeIn, { FadeInItem } from '../components/FadeIn';

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
};

const Profile = () => {
  const { token, navigate, backendUrl } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { token },
        });
        if (response.data.success) {
          setProfile(response.data.user);
        } else {
          toast.error(response.data.message || 'Failed to load profile');
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to load profile';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, backendUrl, navigate]);

  const cartBreakdown = useMemo(() => {
    if (!profile?.cartData) return [];
    return Object.entries(profile.cartData).map(([productId, sizes]) => ({
      productId,
      sizes,
    }));
  }, [profile]);

  if (!token) {
    return null;
  }

  return (
    <div className='min-h-screen bg-brand-cream pb-24'>
        {/* Header */}
        <div className='bg-brand-black text-white py-16 px-4 text-center'>
            <FadeIn>
                <h1 className='font-display text-4xl sm:text-5xl mb-4'>My Profile</h1>
                <p className='text-neutral-400 text-lg font-light max-w-2xl mx-auto'>
                    Manage your account details and view your shopping activity.
                </p>
            </FadeIn>
        </div>

        <section className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            {loading && (
            <div className='p-12 border border-neutral-100 rounded-3xl shadow-soft bg-white flex flex-col items-center justify-center text-center'>
                <div className='w-12 h-12 border-4 border-neutral-200 border-t-brand-black rounded-full animate-spin mb-4'></div>
                <p className='text-neutral-500'>Loading your profile...</p>
            </div>
            )}

            {!loading && !profile && (
            <div className='p-8 border border-red-200 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center'>
                <p>We couldn't load your profile details. Please try again later.</p>
            </div>
            )}

            {!loading && profile && (
            <div className='space-y-8'>
                <FadeInItem className='p-8 sm:p-10 border border-neutral-100 rounded-3xl shadow-soft bg-white'>
                    <div className='flex items-center gap-6 mb-8 pb-8 border-b border-neutral-100'>
                        <div className='w-20 h-20 rounded-full bg-brand-black text-white flex items-center justify-center font-display text-3xl font-medium shadow-md'>
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h2 className='text-2xl font-display font-medium text-brand-black'>{profile.name || 'User'}</h2>
                            <p className='text-neutral-500'>{profile.email}</p>
                        </div>
                    </div>
                    
                    <h3 className='text-lg font-medium text-brand-black mb-6 uppercase tracking-wider text-sm'>Account Details</h3>
                    <dl className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 text-sm sm:text-base'>
                        <div className='bg-neutral-50 p-4 rounded-xl border border-neutral-100'>
                            <dt className='text-neutral-500 uppercase tracking-wide text-xs mb-2 font-medium'>Member Since</dt>
                            <dd className='text-brand-black font-medium'>{formatDate(profile.createdAt)}</dd>
                        </div>
                        <div className='bg-neutral-50 p-4 rounded-xl border border-neutral-100'>
                            <dt className='text-neutral-500 uppercase tracking-wide text-xs mb-2 font-medium'>Last Updated</dt>
                            <dd className='text-brand-black font-medium'>{formatDate(profile.updatedAt)}</dd>
                        </div>
                        <div className='bg-neutral-50 p-4 rounded-xl border border-neutral-100'>
                            <dt className='text-neutral-500 uppercase tracking-wide text-xs mb-2 font-medium'>Items In Cart</dt>
                            <dd className='text-brand-black font-medium flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                {profile.cartCount}
                            </dd>
                        </div>
                    </dl>
                </FadeInItem>

                {cartBreakdown.length > 0 && (
                <FadeInItem className='p-8 sm:p-10 border border-neutral-100 rounded-3xl shadow-soft bg-white'>
                    <h2 className='text-xl font-display font-medium text-brand-black mb-6'>Cart Breakdown</h2>
                    <div className='space-y-4 text-sm sm:text-base'>
                    {cartBreakdown.map(({ productId, sizes }) => (
                        <div key={productId} className='border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                            <p className='font-medium text-neutral-500 text-sm'>
                                Product ID: <span className='text-brand-black bg-neutral-100 px-2 py-1 rounded'>{productId}</span>
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {Object.entries(sizes || {}).map(([size, quantity]) => (
                                    <div key={size} className='bg-brand-cream border border-brand-gold/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm'>
                                        <span className='text-neutral-600 font-medium'>Size {size}</span>
                                        <span className='w-px h-4 bg-brand-gold/30'></span>
                                        <span className='font-semibold text-brand-black'>Qty: {quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    </div>
                </FadeInItem>
                )}
            </div>
            )}
        </section>
    </div>
  );
};

export default Profile;