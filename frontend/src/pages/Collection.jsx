import { useCallback, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import LoadingSpinner from '../components/LoadingSpinner';
import FadeIn, { FadeInItem } from '../components/FadeIn';
import { useLocation } from 'react-router-dom';

const Collection = () => {

  const { products , search , showSearch, loading } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent')
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.subCategory) {
        setSubCategory([location.state.subCategory]);
      }
      if (location.state.category) {
        setCategory([location.state.category]);
      }
    }
  }, [location.state])

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev,e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = useCallback(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
  }, [products, showSearch, search, category, subCategory])

  const sortProduct = useCallback(() => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }, [filterProducts, sortType, applyFilter])

  useEffect(()=>{
    applyFilter();
  },[applyFilter])

  useEffect(()=>{
    sortProduct();
  },[sortProduct])

  return (
    <div className='min-h-screen bg-brand-cream'>
        {/* Header Banner */}
        <div className='pt-24 pb-8 px-4 text-center'>
            <h1 className='font-display text-brand-black text-4xl md:text-5xl mb-4'>The Collection</h1>
            <p className='text-neutral-600 text-body-sm md:text-base max-w-2xl mx-auto'>
                Curated styles for the modern wardrobe. Filter by category, fit, or style to find your perfect match.
            </p>
        </div>

        <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
                
                {/* Filter Sidebar */}
                <div className='lg:w-64 flex-shrink-0'>
                    <div className='sticky top-28 bg-white p-6 rounded-2xl shadow-soft border border-neutral-100'>
                        <div 
                            onClick={()=>setShowFilter(!showFilter)} 
                            className='flex items-center justify-between cursor-pointer lg:cursor-default mb-6'
                        >
                            <h2 className='font-display text-xl font-semibold'>Filters</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 text-neutral-500 lg:hidden transition-transform ${showFilter ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        
                        <div className={`space-y-8 ${showFilter ? 'block' : 'hidden'} lg:block`}>
                            {/* Categories */}
                            <div>
                                <h3 className='text-body-sm font-semibold text-brand-black mb-4 uppercase tracking-wider'>Categories</h3>
                                <div className='flex flex-col gap-3'>
                                    {['Men', 'Women', 'Kids'].map((cat) => (
                                        <label key={cat} className='flex items-center gap-3 cursor-pointer group'>
                                            <input 
                                                type="checkbox" 
                                                value={cat} 
                                                onChange={toggleCategory} 
                                                checked={category.includes(cat)}
                                            />
                                            <span className='text-neutral-600 group-hover:text-brand-black transition-colors'>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Type */}
                            <div>
                                <h3 className='text-body-sm font-semibold text-brand-black mb-4 uppercase tracking-wider'>Fit & Style</h3>
                                <div className='flex flex-col gap-3'>
                                    {['Topwear', 'Bottomwear', 'Winterwear', 'Hoodie', 'Oversize', 'Regular fit'].map((sub) => (
                                        <label key={sub} className='flex items-center gap-3 cursor-pointer group'>
                                            <input 
                                                type="checkbox" 
                                                value={sub} 
                                                onChange={toggleSubCategory} 
                                                checked={subCategory.includes(sub)}
                                            />
                                            <span className='text-neutral-600 group-hover:text-brand-black transition-colors'>{sub}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Products */}
                <div className='flex-1'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-soft border border-neutral-100'>
                        <div className='text-neutral-500 text-sm font-medium'>
                            Showing <span className='text-brand-black'>{filterProducts.length}</span> results
                        </div>
                        
                        <div className='flex items-center gap-3 relative w-full sm:w-auto'>
                            <span className='text-sm text-neutral-500 whitespace-nowrap'>Sort by:</span>
                            <div className='relative w-full sm:w-48'>
                                <select 
                                    onChange={(e)=>setSortType(e.target.value)} 
                                    className='w-full appearance-none bg-neutral-50 border border-neutral-200 text-brand-black text-sm rounded-lg pl-4 pr-10 py-2.5 outline-none focus:border-brand-black transition-colors cursor-pointer'
                                >
                                    <option value="relavent">Relevant</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className='h-96 flex items-center justify-center bg-white rounded-2xl shadow-soft border border-neutral-100'>
                            <LoadingSpinner />
                        </div>
                    ) : filterProducts.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-soft border border-neutral-100 p-8 text-center">
                            <div className='w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            </div>
                            <h3 className='font-display text-xl font-semibold mb-2'>No products found</h3>
                            <p className="text-neutral-500 max-w-sm">We couldn't find any items matching your current filters. Try adjusting them to see more results.</p>
                            <button onClick={() => { setCategory([]); setSubCategory([]); }} className='btn-secondary mt-6'>Clear All Filters</button>
                        </div>
                    ) : (
                        <FadeIn stagger={0.05} direction="up" distance={30}>
                            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                            {filterProducts.map((item, index)=>(
                                <FadeInItem key={index}>
                                    <ProductItem name={item.name} id={item._id} price={item.price} image={item.image} />
                                </FadeInItem>
                            ))}
                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Collection
