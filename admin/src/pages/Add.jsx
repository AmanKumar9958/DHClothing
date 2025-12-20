import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)
  const [variants, setVariants] = useState([])

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("Men");
   const [subCategory, setSubCategory] = useState("Topwear");
   const [bestseller, setBestseller] = useState(false);
  const [exclusive, setExclusive] = useState(false);
   const [sizes, setSizes] = useState([]);

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
  formData.append("exclusive",exclusive)
      formData.append("sizes",JSON.stringify(sizes))

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      // append variants metadata and files
      if (variants.length > 0) {
        const meta = variants.map(v => ({ colorName: v.colorName, colorHex: v.colorHex, sku: v.sku, stock: v.stock }))
        formData.append('variants', JSON.stringify(meta))
        variants.forEach((v, idx) => {
          (v.images || []).forEach(file => {
            formData.append(`variant_${idx}_images`, file)
          })
        })
      }

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
   }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2 font-bold'>Upload Cover Image</p>

          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

            <div>
              <p className='mb-2'>Product category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Sub category</p>
              <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                  <option value="Hoodie">Hoodie</option>
                  <option value="Oversize">Oversize</option>
                  <option value="Regular fit">Regular fit</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Product Price</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
            </div>

        </div>

        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter( item => item !== "S") : [...prev,"S"])}>
              <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>S</p>
            </div>
            
            <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter( item => item !== "M") : [...prev,"M"])}>
              <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>M</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter( item => item !== "L") : [...prev,"L"])}>
              <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>L</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter( item => item !== "XL") : [...prev,"XL"])}>
              <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XL</p>
            </div>

            <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter( item => item !== "XXL") : [...prev,"XXL"])}>
              <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>XXL</p>
            </div>
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setExclusive(prev => !prev)} checked={exclusive} type="checkbox" id='exclusive' />
          <label className='cursor-pointer' htmlFor="exclusive">Add to exclusive</label>
        </div>

        <div>
          <p className='mb-2 font-bold'>Add Variants (colors)</p>
          <div className='flex flex-col gap-2'>
            {variants.map((v, idx) => (
              <div key={idx} className='p-2 border'>
                <div className='flex gap-2 items-center'>
                  <input value={v.colorName} onChange={(e)=>{ const copy=[...variants]; copy[idx].colorName = e.target.value; setVariants(copy)}} placeholder='Color name' className='px-2 py-1'/>
                  <input value={v.colorHex} onChange={(e)=>{ const copy=[...variants]; copy[idx].colorHex = e.target.value; setVariants(copy)}} placeholder='#ff0000' className='px-2 py-1'/>
                  <input value={v.sku||''} onChange={(e)=>{ const copy=[...variants]; copy[idx].sku = e.target.value; setVariants(copy)}} placeholder='SKU' className='px-2 py-1'/>
                  <button type='button' onClick={()=>{ setVariants(prev=> prev.filter((_,i)=>i!==idx)) }} className='px-2'>Remove</button>
                </div>
                <div className='flex gap-2 mt-2'>
                  {[0,1,2,3].map(i=> (
                    <label key={i}>
                      <img className='w-16' src={!v.images || !v.images[i] ? assets.upload_area : URL.createObjectURL(v.images[i])} alt='' />
                      <input onChange={(e)=>{ const file = e.target.files[0]; const copy=[...variants]; copy[idx].images = copy[idx].images||[]; copy[idx].images[i] = file; setVariants(copy)}} type='file' hidden />
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type='button' onClick={()=> setVariants(prev=>[...prev,{ colorName:'', colorHex:'', sku:'', stock:{}, images:[] }])} className='mt-2 px-3 py-1 bg-slate-200'>Add Variant</button>
          </div>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>

    </form>
  )
}

export default Add