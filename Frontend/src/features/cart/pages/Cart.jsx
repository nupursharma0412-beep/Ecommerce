import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'
import { Link, useNavigate } from 'react-router'

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD       = '#b8973a'
const GOLD_DARK  = '#8a6e22'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .cart-root * { box-sizing: border-box; }
  .font-display { font-family: 'DM Serif Display', serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }

  @keyframes cartFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .c-fade-1 { animation: cartFadeUp 0.4s ease forwards; }
  .c-fade-2 { animation: cartFadeUp 0.4s 0.07s ease forwards; opacity: 0; }
  .c-fade-3 { animation: cartFadeUp 0.4s 0.14s ease forwards; opacity: 0; }

  .cart-item {
    display: flex;
    gap: 24px;
    padding: 24px;
    background: #faf9f7;
    border: 1px solid #f0ede6;
    border-radius: 20px;
    transition: box-shadow .2s;
  }
  .cart-item:hover {
    box-shadow: 0 8px 32px rgba(184,151,58,0.08);
  }

  .qty-btn {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none;
    font-size: 18px; font-weight: 300;
    cursor: pointer;
    color: #1b1c1a;
    transition: opacity .15s;
  }
  .qty-btn:hover { opacity: 0.55; }

  .remove-btn {
    background: none; border: none; cursor: pointer;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #9ca3af;
    transition: color .15s;
    padding: 0;
  }
  .remove-btn:hover { color: #b8973a; }

  .cta-dark {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 14px;
    font-size: 13px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    cursor: pointer;
    background: #0f0f0f;
    color: white;
    transition: background .2s, transform .1s;
    font-family: 'DM Sans', sans-serif;
  }
  .cta-dark:hover  { background: ${GOLD}; }
  .cta-dark:active { transform: scale(.98); }

  .cta-outline {
    width: 100%;
    padding: 15px;
    border: 2px solid #e6e2da;
    border-radius: 14px;
    font-size: 13px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    cursor: pointer;
    background: transparent;
    color: #374151;
    transition: border-color .2s, transform .1s;
    font-family: 'DM Sans', sans-serif;
  }
  .cta-outline:hover  { border-color: ${GOLD}; color: ${GOLD}; }
  .cta-outline:active { transform: scale(.98); }

  .attr-chip {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    background: ${GOLD};
    color: white;
  }

  .summary-card {
    background: white;
    border: 1px solid #e8e5de;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.05);
    position: sticky;
    top: 100px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 10px 0;
    border-bottom: 1px solid #f5f3f0;
    font-size: 13px;
  }

  .perk-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 32px;
    padding-top: 28px;
    border-top: 1px solid #f0ede6;
  }

  .perk-cell {
    display: flex; flex-direction: column; gap: 4px;
  }
`

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (amount, currency = 'INR') => {
  const num = Number(amount)
  if (isNaN(num)) return '—'
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(num)
  } catch {
    return `${currency} ${num.toLocaleString('en-IN')}`
  }
}

const getDisplayImage = (product, variant) => {
  if (variant?.images?.length) return variant.images[0].url
  if (product?.images?.length) return product.images[0].url
  return null
}

// ── Compute cart totals from items ────────────────────────────────────────────
// cart.totalPrice is NOT stored in the schema, so we derive it here.
const computeCartTotals = (items = []) => {
  const currency = items[0]?.price?.currency ?? 'INR'
  const total = items.reduce((sum, item) => {
    const amount   = item.price?.amount ?? 0
    const quantity = item.quantity ?? 1
    return sum + amount * quantity
  }, 0)
  return { total, currency }
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ size = 14, stroke = GOLD, sw = 1.5, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)
const TruckIcon  = () => <Icon><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>
const ShieldIcon = () => <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
const ReturnIcon = () => <Icon><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></Icon>

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyCart = ({ navigate }) => (
  <>
    <style>{STYLES}</style>
    <div className="cart-root font-body" style={{ minHeight: '100vh', background: '#f7f6f3', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid #f0ede6', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, textDecoration: 'none' }}>
          Premium Fashion House · Clothy
        </Link>
        <button onClick={() => navigate(-1)} style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 24px' }}>
        <div style={{ width: 48, height: 2, background: GOLD, borderRadius: 2, marginBottom: 8 }} />
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: '#0f0f0f', margin: 0, textAlign: 'center', lineHeight: 1.1 }}>
          Your cart is empty.
        </h1>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9ca3af', margin: 0 }}>
          Nothing selected yet
        </p>
        <Link to="/"
          style={{ marginTop: 16, padding: '14px 36px', borderRadius: 12, background: GOLD, color: 'white', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
          onMouseLeave={e => e.currentTarget.style.background = GOLD}>
          Explore the Collection
        </Link>
      </div>
    </div>
  </>
)

// ── Main Cart ─────────────────────────────────────────────────────────────────
const Cart = () => {
  const cart     = useSelector(state => state.cart)
  const { handleGetCart , handleIncreamentCartItem} = useCart()
  const navigate = useNavigate()

  const [quantities, setQuantities] = useState({})

  useEffect(() => { handleGetCart() }, [])

  const changeQty = (id, delta) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }))
  }

  // ── Derive totals from items (totalPrice is not in the schema) ──
  const { total: computedTotal, currency: totalCurrency } = computeCartTotals(cart?.items)

  if (!cart?.items?.length) return <EmptyCart navigate={navigate} />

  return (
    <>
      <style>{STYLES}</style>
      <div className="cart-root font-body" style={{ minHeight: '100vh', background: '#f7f6f3' }}>

        {/* Brand strip */}
        <div style={{ borderBottom: '1px solid #f0ede6', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, textDecoration: 'none' }}>
            Premium Fashion House · Clothy
          </Link>
          <span style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em' }}>
            Estimated delivery: 3–5 business days
          </span>
        </div>

        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>

            {/* ── Left: items ─────────────────────────────────────────── */}
            <div className="c-fade-1">

              <div style={{ marginBottom: 28 }}>
                <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: '#0f0f0f', margin: '0 0 8px', lineHeight: 1.1 }}>
                  Your Selection
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 2, background: GOLD, borderRadius: 2 }} />
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9ca3af' }}>
                    {cart.items.length} {cart.items.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {cart.items.map(item => {
                  const { product, variant: variantId, price } = item
                  const productId    = product._id
                  const variant      = product?.variants?.find(v => v._id?.toString() === variantId?.toString()) ?? null
                  const imageUrl     = getDisplayImage(product, variant)
                  const displayPrice = price ?? variant?.price ?? product?.price
                  const qty          = quantities[productId] ?? item.quantity ?? 1
                  const stock        = variant?.stock

                  return (
                    <div key={productId} className="cart-item">
                      {/* Image */}
                      <div style={{ flexShrink: 0, width: 'clamp(90px, 12vw, 140px)', aspectRatio: '4/5', borderRadius: 12, overflow: 'hidden', background: '#f0ede6' }}>
                        {imageUrl
                          ? <img src={imageUrl} alt={product?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', background: '#e8e5de' }} />}
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h2 className="font-display" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontWeight: 400, color: '#0f0f0f', margin: '0 0 10px', lineHeight: 1.2 }}>
                            {product?.title}
                          </h2>

                          {variant?.attributes && Object.keys(variant.attributes).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                              {Object.entries(variant.attributes).map(([k, v]) => (
                                <span key={k} className="attr-chip">{v}</span>
                              ))}
                            </div>
                          )}

                          {/* Per-item price — price is { amount, currency } */}
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: '#0f0f0f' }}>
                              {displayPrice?.amount != null
                                ? formatINR(displayPrice.amount, displayPrice.currency)
                                : '—'}
                            </span>
                          </div>

                          {stock !== undefined && (
                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: stock > 0 ? '#15803d' : '#dc2626' }}>
                              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                            </span>
                          )}
                        </div>

                        {/* Qty + remove */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid #e6e2da`, borderRadius: 10, overflow: 'hidden' }}>
                            <button className="qty-btn" style={{ borderRight: '1px solid #e6e2da' }} onClick={() => changeQty(productId, -1)} aria-label="Decrease">−</button>
                            <span style={{ width: 40, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#0f0f0f', userSelect: 'none' }}>{qty}</span>
                            <button className="qty-btn" style={{ borderLeft: '1px solid #e6e2da' }} onClick={(e) =>{
                              e.preventDefault()
                              handleIncreamentCartItem({productId , variantId})
                               } }aria-label="Increase">+</button>
                          </div>
                          <button className="remove-btn">Remove</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Policy strip */}
              <div className="perk-strip">
                {[
                  { icon: <TruckIcon />, label: 'Shipping',      sub: 'Complimentary over ₹15,000' },
                  { icon: <ReturnIcon />, label: 'Returns',      sub: 'Within 14 days' },
                  { icon: <ShieldIcon />, label: 'Authenticity', sub: '100% Guaranteed' },
                ].map(p => (
                  <div key={p.label} className="perk-cell">
                    {p.icon}
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{p.label}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{p.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: summary ──────────────────────────────────────── */}
            <div className="c-fade-2">
              <div className="summary-card">

                <h2 className="font-display" style={{ fontSize: 28, fontWeight: 400, color: '#0f0f0f', margin: '0 0 6px' }}>
                  Order Summary
                </h2>
                <div style={{ width: 36, height: 2, background: GOLD, borderRadius: 2, marginBottom: 24 }} />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { label: 'Subtotal',       value: formatINR(computedTotal, totalCurrency) },
                    { label: 'Shipping',       value: computedTotal >= 15000 ? 'Complimentary' : 'Calculated at checkout' },
                    { label: 'Duties & Taxes', value: 'Included' },
                  ].map(row => (
                    <div key={row.label} className="summary-row">
                      <span style={{ color: '#6b7280' }}>{row.label}</span>
                      <span style={{ fontWeight: 500, color: '#0f0f0f' }}>{row.value}</span>
                    </div>
                  ))}

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0 24px' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f0f0f' }}>Total</span>
                    <span style={{ fontSize: 20, fontWeight: 600, color: GOLD }}>
                      {formatINR(computedTotal, totalCurrency)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button className="cta-outline" onClick={() => navigate('/')}>
                    Continue Shopping
                  </button>
                </div>

                <p style={{ marginTop: 20, textAlign: 'center', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', lineHeight: 1.6 }}>
                  Free returns within 14 days · Authenticity guaranteed
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Cart