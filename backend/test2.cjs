const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dhclothing:dhclothing2025@cluster0.gjzjyyj.mongodb.net/e-commerce').then(async () => {
  const coll = mongoose.connection.collection('products');
  const doc = await coll.findOne({});
  console.log(doc.image);
  if (doc.variants) console.log(doc.variants.map(v => v.images));
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
