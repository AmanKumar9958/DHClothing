import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    // Default delivery fee; PlaceOrder can override per payment method
    const delivery_fee = 79;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Compute bundle and singles totals for an arbitrary cart snapshot
    const computeBundleAndSingles = (snapshot) => {
        let bundleTotal = 0
        let singlesTotal = 0
        let oversizeCount = 0, oversizeBase = 0
        let regularCount = 0, regularBase = 0

        for (const items in snapshot) {
            const [productId, variantId] = items.split('::')
            const itemInfo = products.find((product) => product._id === productId)
            for (const size in snapshot[items]) {
                const qty = snapshot[items][size]
                if (!qty || !itemInfo) continue
                let price = itemInfo.price
                if (variantId && itemInfo.variants) {
                    const v = itemInfo.variants.find(vv => (vv.id && vv.id.toString() === variantId.toString()) || itemInfo.variants.indexOf(vv) === Number(variantId))
                    if (v && v.price) price = v.price
                }
                // singles always adds raw price
                singlesTotal += price * qty
                const sc = (itemInfo.subCategory || '').toLowerCase()
                if (sc === 'oversize') {
                    oversizeCount += qty
                    oversizeBase += price * qty
                } else if (sc === 'regular fit') {
                    regularCount += qty
                    regularBase += price * qty
                } else {
                    bundleTotal += price * qty
                }
            }
        }

        const priceOversize = (n) => {
            let t = 0
            while (n >= 3) { t += 999; n -= 3 }
            if (n === 2) t += 799
            else if (n === 1) t += 499
            return t
        }
        const priceRegular = (n) => {
            let t = 0
            while (n >= 4) { t += 999; n -= 4 }
            while (n >= 3) { t += 799; n -= 3 }
            if (n > 0) t += n * 299
            return t
        }

        bundleTotal += Math.min(oversizeBase, priceOversize(oversizeCount))
        bundleTotal += Math.min(regularBase, priceRegular(regularCount))
        return { bundleTotal, singlesTotal }
    }


    const addToCart = async (itemId, size, variantId = null) => {

        // Require login before adding items to cart
        if (!token) {
            toast.info('Please log in to add items to your cart');
            navigate('/login');
            return;
        }

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

    // detect bundle threshold before add
    const before = computeBundleAndSingles(cartItems)

    let cartData = structuredClone(cartItems);

        // use composite item key when variant selected
        const key = variantId ? `${itemId}::${variantId}` : itemId
        if (cartData[key]) {
            if (cartData[key][size]) {
                cartData[key][size] += 1;
            }
            else {
                cartData[key][size] = 1;
            }
        }
        else {
            cartData[key] = {};
            cartData[key][size] = 1;
        }
        setCartItems(cartData);
        // notify user
        const after = computeBundleAndSingles(cartData)
        const beforeDeal = before.bundleTotal < before.singlesTotal
        const afterDeal = after.bundleTotal < after.singlesTotal
        if (!beforeDeal && afterDeal) {
            toast.success('Bundle pricing applied')
        } else {
            toast.success('Added to cart');
        }

        try {
            await axios.post(backendUrl + '/api/cart/add', { itemId, size, variantId }, { headers: { token } })
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        const before = computeBundleAndSingles(cartItems)

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        // toast when a bundle kicks in via quantity change (increase)
        const after = computeBundleAndSingles(cartData)
        const beforeDeal = before.bundleTotal < before.singlesTotal
        const afterDeal = after.bundleTotal < after.singlesTotal
        if (!beforeDeal && afterDeal) {
            toast.success('Bundle pricing applied')
        }

        // toast for removal
        if (quantity === 0) {
            toast.success('Removed from cart')
        }

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        let oversizeCount = 0, oversizeBase = 0;
        let regularCount = 0, regularBase = 0;

        // 1) Aggregate counts and base prices for special groups; add other items directly
        for (const items in cartItems) {
            const [productId, variantId] = items.split('::')
            const itemInfo = products.find((product) => product._id === productId)
            for (const size in cartItems[items]) {
                try {
                    const qty = cartItems[items][size]
                    if (qty > 0 && itemInfo) {
                        // determine effective base price per item (respect variant overrides)
                        let price = itemInfo.price
                        if (variantId && itemInfo.variants) {
                            const v = itemInfo.variants.find(vv => (vv.id && vv.id.toString() === variantId.toString()) || itemInfo.variants.indexOf(vv) === Number(variantId))
                            if (v && v.price) price = v.price
                        }

                        const sc = (itemInfo.subCategory || '').toLowerCase()
                        if (sc === 'oversize') {
                            oversizeCount += qty
                            oversizeBase += price * qty
                        } else if (sc === 'regular fit') {
                            regularCount += qty
                            regularBase += price * qty
                        } else {
                            totalAmount += price * qty
                        }
                    }
                } catch (error) {
                    // ignore broken items
                }
            }
        }

        // 2) Bundle pricing functions
        const priceOversize = (n) => {
            let t = 0
            while (n >= 3) { t += 999; n -= 3 }
            if (n === 2) t += 799
            else if (n === 1) t += 499
            return t
        }
        const priceRegular = (n) => {
            let t = 0
            while (n >= 4) { t += 999; n -= 4 }
            while (n >= 3) { t += 799; n -= 3 }
            if (n > 0) t += n * 299
            return t
        }

        // 3) Add the better of (base sum) vs (bundle price) so deals never increase cost
        totalAmount += Math.min(oversizeBase, priceOversize(oversizeCount))
        totalAmount += Math.min(regularBase, priceRegular(regularCount))

        return totalAmount;
    }

    // Compute subtotal using normal item prices only (no bundle deals)
    const getCartSinglesAmount = () => {
        let total = 0
        for (const items in cartItems) {
            const [productId, variantId] = items.split('::')
            const itemInfo = products.find((product) => product._id === productId)
            for (const size in cartItems[items]) {
                try {
                    const qty = cartItems[items][size]
                    if (qty > 0 && itemInfo) {
                        let price = itemInfo.price
                        if (variantId && itemInfo.variants) {
                            const v = itemInfo.variants.find(vv => (vv.id && vv.id.toString() === variantId.toString()) || itemInfo.variants.indexOf(vv) === Number(variantId))
                            if (v && v.price) price = v.price
                        }
                        total += price * qty
                    }
                } catch (e) {
                    // ignore bad items
                }
            }
        }
        return total
    }

    const getProductsData = async () => {
        setLoading(true);
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
    getCartAmount, getCartSinglesAmount, navigate, backendUrl,
        setToken, token, loading
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;