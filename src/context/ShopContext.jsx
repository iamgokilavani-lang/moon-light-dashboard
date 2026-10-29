import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';
import { coupons } from '../data/coupons';

const ShopContext = createContext();

const INITIAL_ORDERS = [
  {
    id: 'ORD-892104',
    date: '2026-10-21T14:32:00.000Z',
    status: 'Delivered',
    trackingNumber: 'TRK-983274981US',
    customer: {
      name: 'Gokilavani',
      email: 'gokilavani@example.com',
      phone: '+91 98765 43210',
      address: {
        street: '742 Lotus Boulevard, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560038',
        country: 'India'
      }
    },
    items: [
      {
        id: 'prod-1',
        title: 'Aura Pro Wireless Noise-Cancelling Headphones',
        price: 299.99,
        quantity: 1,
        color: 'Midnight Blue',
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'prod-7',
        title: 'Minimalist Italian Leather Bi-Fold Wallet',
        price: 49.00,
        quantity: 1,
        color: 'Chestnut Brown',
        thumbnail: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'
      }
    ],
    pricing: {
      subtotal: 348.99,
      discount: 34.90,
      shipping: 0,
      tax: 25.13,
      total: 339.22
    },
    paymentMethod: 'Credit Card (**** 4242)'
  },
  {
    id: 'ORD-764319',
    date: '2026-10-14T09:15:00.000Z',
    status: 'Delivered',
    trackingNumber: 'TRK-542109843IN',
    customer: {
      name: 'Gokilavani',
      email: 'gokilavani@example.com',
      phone: '+91 98765 43210',
      address: {
        street: '742 Lotus Boulevard, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560038',
        country: 'India'
      }
    },
    items: [
      {
        id: 'prod-4',
        title: 'Vortex Pro Ergonomic Wireless Mouse',
        price: 89.99,
        quantity: 1,
        color: 'Matte Black',
        thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'
      }
    ],
    pricing: {
      subtotal: 89.99,
      discount: 0,
      shipping: 9.99,
      tax: 7.20,
      total: 107.18
    },
    paymentMethod: 'PayPal'
  }
];

export const ShopProvider = ({ children }) => {
  // Products
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('moonlight_products') || localStorage.getItem('novastore_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('moonlight_cart') || localStorage.getItem('novastore_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'prod-1-Space Gray',
          productId: 'prod-1',
          title: 'Aura Pro Wireless Noise-Cancelling Headphones',
          price: 299.99,
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          selectedColor: 'Space Gray',
          quantity: 1,
          stock: 18
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('moonlight_wishlist') || localStorage.getItem('novastore_wishlist');
      return saved ? JSON.parse(saved) : ['prod-2', 'prod-6'];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('moonlight_orders') || localStorage.getItem('novastore_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(o => {
          if (o.customer && (o.customer.name === 'Alex Morgan' || o.customer.name === 'Aarav Sharma' || !o.customer.name)) {
            return {
              ...o,
              customer: {
                ...o.customer,
                name: 'Gokilavani',
                email: 'gokilavani@example.com'
              }
            };
          }
          return o;
        });
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Cart Drawer UI
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Global Toasts
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('moonlight_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('moonlight_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('moonlight_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('moonlight_orders', JSON.stringify(orders));
  }, [orders]);

  // Toast Helper
  const showToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, quantity = 1, selectedColor = null) => {
    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);
    const cartItemId = `${product.id}${color ? `-${color}` : ''}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      } else {
        const newItem = {
          id: cartItemId,
          productId: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          selectedColor: color,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
          category: product.category
        };
        return [...prev, newItem];
      }
    });

    showToast('Added to Cart', `${product.title} (${quantity}) added to your bag.`);
  };

  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const qty = Math.min(newQuantity, item.stock);
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => {
      const target = prev.find(item => item.id === cartItemId);
      if (target) {
        showToast('Item Removed', `${target.title} was removed from your bag.`, 'info');
      }
      return prev.filter(item => item.id !== cartItemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast('Removed from Wishlist', `${product.title} removed from favorites.`, 'info');
        return prev.filter(id => id !== product.id);
      } else {
        showToast('Saved to Wishlist', `${product.title} saved to your favorites.`);
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Coupon operations
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === clean);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try SAVE10 or MOON20' };
    }
    if (found.minSpend && cartSubtotal < found.minSpend) {
      return { success: false, message: `Coupon requires minimum spend of $${found.minSpend}` };
    }
    setAppliedCoupon(found);
    showToast('Promo Code Applied', `${found.code}: ${found.description}`);
    return { success: true, coupon: found };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo Code Removed', 'Discount removed from order.', 'info');
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    }
  }

  const freeShipping = cartSubtotal >= 100 || (appliedCoupon && appliedCoupon.type === 'free_shipping');
  const cartShipping = cartSubtotal === 0 ? 0 : (freeShipping ? 0 : 9.99);
  const cartTax = cartSubtotal > 0 ? (cartSubtotal - cartDiscount) * 0.08 : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);

  // Admin Product Actions
  const addProduct = (newProd) => {
    const product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      price: parseFloat(newProd.price),
      originalPrice: newProd.originalPrice ? parseFloat(newProd.originalPrice) : parseFloat(newProd.price) * 1.2,
      stock: parseInt(newProd.stock, 10) || 10,
      images: newProd.images && newProd.images.length > 0 ? newProd.images : [newProd.thumbnail],
      features: Array.isArray(newProd.features) ? newProd.features : (newProd.features ? newProd.features.split('\n').filter(Boolean) : []),
      colors: Array.isArray(newProd.colors) ? newProd.colors : (newProd.colors ? newProd.colors.split(',').map(c => c.trim()).filter(Boolean) : ['Standard'])
    };

    setProducts(prev => [product, ...prev]);
    showToast('Product Created', `"${product.title}" has been added to catalog.`);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : p.price,
            stock: updatedFields.stock !== undefined ? parseInt(updatedFields.stock, 10) : p.stock,
            originalPrice: updatedFields.originalPrice !== undefined ? parseFloat(updatedFields.originalPrice) : p.originalPrice
          };
        }
        return p;
      })
    );
    showToast('Product Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product Deleted', `"${target?.title || 'Product'}" was removed from catalog.`, 'info');
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    showToast('Catalog Reset', 'Products reset to default sample catalog.');
  };

  // Add Product Review
  const addReview = (productId, review) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      author: review.author || 'Verified Buyer',
      rating: Number(review.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment: review.comment
    };

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedReviews = [newRev, ...(p.reviews || [])];
          const newAvgRating = (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          ).toFixed(1);
          return {
            ...p,
            reviews: updatedReviews,
            rating: parseFloat(newAvgRating),
            reviewCount: updatedReviews.length
          };
        }
        return p;
      })
    );

    showToast('Review Submitted', 'Thank you! Your verified review is published.');
  };

  // Create Order
  const createOrder = (orderData) => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      ...orderData
    };

    // Deduct stock
    setProducts(prev =>
      prev.map(prod => {
        const cartMatch = orderData.items.find(item => item.productId === prod.id);
        if (cartMatch) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartMatch.quantity)
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Clear cart & coupon
    clearCart();
    setAppliedCoupon(null);

    return newOrder;
  };

  const getProductById = (id) => products.find(p => p.id === id);

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      wishlist,
      orders,
      appliedCoupon,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      toasts,
      showToast,
      removeToast,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      applyCoupon,
      removeCoupon,
      cartSubtotal,
      cartCount,
      cartDiscount,
      cartShipping,
      cartTax,
      cartTotal,
      freeShipping,
      addProduct,
      updateProduct,
      deleteProduct,
      resetProducts,
      addReview,
      createOrder,
      getProductById
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
