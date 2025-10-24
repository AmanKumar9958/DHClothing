import { v2 as cloudinary } from "cloudinary"
import mongoose from "mongoose"
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        // collect uploaded files (multer.any gives req.files as array)
        const files = req.files || []

        // helper: upload a file object to cloudinary
        const uploadFile = async (file) => {
            const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' })
            return result.secure_url
        }

        // default image fields (image1..image4) — maintain backward compatibility
        const imageFields = ['image1','image2','image3','image4']
        const defaultImages = []
        for (const f of files) {
            if (imageFields.includes(f.fieldname)) {
                const url = await uploadFile(f)
                defaultImages.push(url)
            }
        }

        // Parse variants (metadata) first; we'll attach uploaded urls into these variant entries
        let parsedVariants = []
        try {
            if (req.body.variants) {
                parsedVariants = typeof req.body.variants === 'string' ? JSON.parse(req.body.variants) : req.body.variants
            }
        } catch (e) {
            console.log('Failed to parse variants:', e.message)
            parsedVariants = []
        }

        // Initialize images arrays for each parsed variant and ensure each variant has a stable id
        for (let i = 0; i < parsedVariants.length; i++) {
            parsedVariants[i].images = parsedVariants[i].images || []
            // ensure each variant has an id (stable across edits). Use a stringified ObjectId.
            if (!parsedVariants[i].id) {
                parsedVariants[i].id = new mongoose.Types.ObjectId().toString()
            }
        }

        // Attach uploaded variant images based on fieldname pattern: variant_<index>_images
        for (const f of files) {
            if (!imageFields.includes(f.fieldname)) {
                const m = f.fieldname.match(/^variant_(\d+)_images?$/)
                if (m) {
                    const idx = Number(m[1])
                    if (!isNaN(idx) && parsedVariants[idx]) {
                        const url = await uploadFile(f)
                        parsedVariants[idx].images.push(url)
                    }
                }
            }
        }

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: defaultImages,
            variants: parsedVariants,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
    const { id } = req.body

    await productModel.findByIdAndDelete(id)

    // Remove deleted product from every user's cart
    const unsetField = {}
    unsetField[`cartData.${id}`] = ""
    await userModel.updateMany({}, { $unset: unsetField })

    res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }