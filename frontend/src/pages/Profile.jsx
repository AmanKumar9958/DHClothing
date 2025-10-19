import { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

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
    <section className='max-w-3xl mx-auto py-12'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-6'>My Profile</h1>

      {loading && (
        <div className='p-6 border border-gray-200 rounded-lg shadow-sm bg-white'>
          <p className='text-gray-500'>Loading your profile...</p>
        </div>
      )}

      {!loading && !profile && (
        <div className='p-6 border border-red-200 bg-red-50 text-red-600 rounded-lg'>
          <p>We couldn't load your profile details. Please try again later.</p>
        </div>
      )}

      {!loading && profile && (
        <div className='space-y-8'>
          <div className='p-6 border border-gray-200 rounded-lg shadow-sm bg-white'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>Account Info</h2>
            <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base'>
              <div>
                <dt className='text-gray-500 uppercase tracking-wide text-xs mb-1'>Name</dt>
                <dd className='text-gray-800 font-medium'>{profile.name || '—'}</dd>
              </div>
              <div>
                <dt className='text-gray-500 uppercase tracking-wide text-xs mb-1'>Email</dt>
                <dd className='text-gray-800 font-medium break-all'>{profile.email || '—'}</dd>
              </div>
              <div>
                <dt className='text-gray-500 uppercase tracking-wide text-xs mb-1'>Member Since</dt>
                <dd className='text-gray-800 font-medium'>{formatDate(profile.createdAt)}</dd>
              </div>
              <div>
                <dt className='text-gray-500 uppercase tracking-wide text-xs mb-1'>Last Updated</dt>
                <dd className='text-gray-800 font-medium'>{formatDate(profile.updatedAt)}</dd>
              </div>
              <div>
                <dt className='text-gray-500 uppercase tracking-wide text-xs mb-1'>Items In Cart</dt>
                <dd className='text-gray-800 font-medium'>{profile.cartCount}</dd>
              </div>
            </dl>
          </div>

          {cartBreakdown.length > 0 && (
            <div className='p-6 border border-gray-200 rounded-lg shadow-sm bg-white'>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>Cart Breakdown</h2>
              <div className='space-y-4 text-sm sm:text-base'>
                {cartBreakdown.map(({ productId, sizes }) => (
                  <div key={productId} className='border border-gray-100 rounded-md p-3'>
                    <p className='font-medium text-gray-700'>Product ID: <span className='text-gray-900'>{productId}</span></p>
                    <ul className='mt-2 flex flex-wrap gap-3 text-gray-600 text-sm'>
                      {Object.entries(sizes || {}).map(([size, quantity]) => (
                        <li key={size} className='bg-gray-100 px-3 py-1 rounded-full'>
                          Size {size}: <span className='font-semibold text-gray-800 ml-1'>{quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Profile;