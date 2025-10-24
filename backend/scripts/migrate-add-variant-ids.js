/*
 A small migration script to assign stable ids to existing product variants that lack an `id` field.
 Usage (PowerShell):
   $env:MONGODB_URI = "mongodb://localhost:27017"
   node backend/scripts/migrate-add-variant-ids.js

 It reads all products and assigns string ObjectId ids to any variant without an `id`.
*/

import mongoose from 'mongoose'
import productModel from '../models/productModel.js'

const run = async () => {
  const mongo = process.env.MONGODB_URI
  if (!mongo) {
    console.error('Please set MONGODB_URI environment variable (example: mongodb://localhost:27017)')
    process.exit(1)
  }

  await mongoose.connect(`${mongo}/e-commerce`)
  console.log('Connected to DB')

  const products = await productModel.find({})
  let updated = 0
  for (const p of products) {
    let changed = false
    if (Array.isArray(p.variants) && p.variants.length > 0) {
      for (let v of p.variants) {
        if (!v.id) {
          v.id = new mongoose.Types.ObjectId().toString()
          changed = true
        }
      }
    }
    if (changed) {
      await p.save()
      updated++
      console.log('Updated product', p._id)
    }
  }

  console.log('Done. Products updated:', updated)
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })
