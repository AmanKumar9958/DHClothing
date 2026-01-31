import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'

const EditModal = ({ isOpen, onClose, product, onUpdate }) => {
  if (!isOpen || !product) return null;

  const [formData, setFormData] = useState({
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    subCategory: product.subCategory,
    bestseller: product.bestseller,
    exclusive: product.exclusive,
    sizes: product.sizes || []
  });

  useEffect(() => {
    if (product) {
        setFormData({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            subCategory: product.subCategory,
            bestseller: product.bestseller,
            exclusive: product.exclusive,
            sizes: product.sizes || []
        });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
      setFormData(prev => {
          const sizes = prev.sizes.includes(size)
              ? prev.sizes.filter(s => s !== size)
              : [...prev.sizes, size];
          return { ...prev, sizes };
      });
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div>
                <label className="block mb-2 font-medium text-gray-700">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
             {/* Description */}
            <div>
                <label className="block mb-2 font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {/* Category */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>
                 {/* Sub Category */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Sub Category</label>
                    <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Topwear">Topwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Winterwear">Winterwear</option>
                    </select>
                </div>
                 {/* Price */}
                 <div>
                    <label className="block mb-2 font-medium text-gray-700">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
            </div>

             {/* Sizes */}
            <div>
                <label className="block mb-2 font-medium text-gray-700">Sizes</label>
                <div className="flex gap-3 flex-wrap">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <div key={size} onClick={() => handleSizeChange(size)} className={`cursor-pointer border px-4 py-2 rounded transition-colors ${formData.sizes.includes(size) ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}>
                            {size}
                        </div>
                    ))}
                </div>
            </div>

             {/* Checkboxes */}
            <div className="flex gap-8 mt-2">
                <div className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} id="bestseller" className="w-5 h-5 cursor-pointer accent-black" />
                    <label htmlFor="bestseller" className="cursor-pointer select-none font-medium text-gray-700">Bestseller</label>
                </div>
                 <div className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="exclusive" checked={formData.exclusive} onChange={handleChange} id="exclusive" className="w-5 h-5 cursor-pointer accent-black" />
                    <label htmlFor="exclusive" className="cursor-pointer select-none font-medium text-gray-700">Exclusive</label>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 bg-white text-gray-700 font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors">Update Product</button>
            </div>
        </form>
      </div>
    </div>
  );
};

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (updatedData) => {
     try {
       const formData = new FormData();
       formData.append('id', updatedData.id);
       formData.append('name', updatedData.name);
       formData.append('description', updatedData.description);
       formData.append('price', updatedData.price);
       formData.append('category', updatedData.category);
       formData.append('subCategory', updatedData.subCategory);
       formData.append('sizes', JSON.stringify(updatedData.sizes));
       formData.append('bestseller', updatedData.bestseller);
       formData.append('exclusive', updatedData.exclusive);

       const response = await axios.post(backendUrl + '/api/product/update', formData, { headers: { token } });
       
       if (response.data.success) {
         toast.success(response.data.message);
         setIsEditModalOpen(false);
         setEditingProduct(null);
         fetchList();
       } else {
         toast.error(response.data.message);
       }
     } catch (error) {
       console.log(error);
       toast.error(error.message);
     }
  };

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {loading ? (
          <LoadingSpinner />
        ) : (
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12 h-12 object-cover' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='flex justify-center items-center gap-2 text-right md:text-center'>
                <button onClick={() => handleEditClick(item)} className='px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium'>Edit</button>
                <p onClick={()=>removeProduct(item._id)} className='cursor-pointer text-lg text-red-500 hover:text-red-700 ml-2'>X</p>
              </div>
            </div>
          ))
        )}

      </div>
      
      <EditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={editingProduct} 
        onUpdate={handleUpdateProduct} 
      />
    </>
  )
}

export default List