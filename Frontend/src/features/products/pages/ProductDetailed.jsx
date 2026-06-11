import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hooks/useCart';

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD      = '#b8973a';
const GOLD_DARK = '#8a6e22';
const GOLD_LIGHT = '#fdf9ef';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .pd-root * { box-sizing: border-box; }
  .font-display { font-family: 'DM Serif Display', serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }

  .text-gold   { color: ${GOLD}; }
  .bg-gold     { background-color: ${GOLD}; }
  .border-gold { border-color: ${GOLD}; }
  .hover-bg-gold-dark:hover { background-color: ${GOLD_DARK} !important; }
  .hover-bg-gold-tint:hover { background-color: ${GOLD_LIGHT} !important; }

  @keyframes pdFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: pdFadeUp 0.45s ease forwards; }
  .fade-up-2 { animation: pdFadeUp 0.45s 0.08s ease forwards; opacity: 0; }
  .fade-up-3 { animation: pdFadeUp 0.45s 0.16s ease forwards; opacity: 0; }
  .fade-up-4 { animation: pdFadeUp 0.45s 0.24s ease forwards; opacity: 0; }

  @keyframes dotPulse {
    0%,80%,100% { opacity:.3; transform:scale(.8); }
    40%         { opacity:1;  transform:scale(1); }
  }
  .dot-1 { animation: dotPulse 1.2s ease-in-out infinite; }
  .dot-2 { animation: dotPulse 1.2s .2s ease-in-out infinite; }
  .dot-3 { animation: dotPulse 1.2s .4s ease-in-out infinite; }

  .thumb-btn { transition: border-color .15s, transform .15s; }
  .thumb-btn:hover { transform: scale(1.04); }

  .img-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #1b1c1a;
    opacity: 0;
    transition: opacity .2s, background .2s, transform .2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .img-wrap:hover .img-nav-btn { opacity: 1; }
  .img-nav-btn:hover { background: white; transform: translateY(-50%) scale(1.06); }

  .attr-pill {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1.5px solid #e6e2da;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: white;
    color: #374151;
    transition: border-color .15s, background .15s, color .15s;
  }
  .attr-pill:hover { border-color: ${GOLD}; }
  .attr-pill.active { background: ${GOLD}; color: white; border-color: ${GOLD}; }

  .cta-primary {
    flex: 1;
    padding: 16px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .05em;
    cursor: pointer;
    border: none;
    background: ${GOLD};
    color: white;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background .2s, transform .1s;
  }
  .cta-primary:hover:not(:disabled) { background: ${GOLD_DARK}; }
  .cta-primary:active:not(:disabled) { transform: scale(.97); }
  .cta-primary:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }

  .cta-outline {
    flex: 1;
    padding: 16px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .05em;
    cursor: pointer;
    background: transparent;
    color: ${GOLD};
    border: 2px solid ${GOLD};
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background .2s, transform .1s;
  }
  .cta-outline:hover:not(:disabled) { background: ${GOLD_LIGHT}; }
  .cta-outline:active:not(:disabled) { transform: scale(.97); }
  .cta-outline:disabled { border-color: #e5e7eb; color: #9ca3af; cursor: not-allowed; }

  .perk-card {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    gap: 6px;
    background: #faf9f7;
    border: 1px solid #f0ede6;
    border-radius: 12px;
    padding: 12px 8px;
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (amount, currency) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount ?? ''} ${currency || ''}`;
  }
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ size = 16, stroke = 'currentColor', sw = 2, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

const StarIcon = ({ filled }) => (
  <Icon size={14} stroke={filled ? GOLD : '#d1d5db'} fill={filled ? GOLD : 'none'} sw={1.5}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Icon>
);
const ChevLeft  = () => <Icon sw={1.5}><polyline points="15 18 9 12 15 6" /></Icon>;
const ChevRight = () => <Icon sw={1.5}><polyline points="9 18 15 12 9 6" /></Icon>;
const CartIcon  = () => (
  <Icon>
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Icon>
);
const BoltIcon  = () => <Icon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>;
const TruckIcon = () => (
  <Icon size={14} stroke={GOLD} sw={1.5}>
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </Icon>
);
const ShieldIcon = () => (
  <Icon size={14} stroke={GOLD} sw={1.5}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Icon>
);
const ReturnIcon = () => (
  <Icon size={14} stroke={GOLD} sw={1.5}>
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
  </Icon>
);

// ── Loader ────────────────────────────────────────────────────────────────────
const Loader = () => (
  <>
    <style>{STYLES}</style>
    <div className="font-body" style={{ minHeight: '100vh', background: '#f7f6f3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {['dot-1', 'dot-2', 'dot-3'].map(c => (
        <div key={c} className={c} style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
      ))}
    </div>
  </>
);

const PERKS = [
  { icon: <TruckIcon />, label: 'Free shipping', sub: 'Over ₹1,999' },
  { icon: <ShieldIcon />, label: 'Secure pay',   sub: 'Encrypted' },
  { icon: <ReturnIcon />, label: 'Easy returns', sub: '7-day policy' },
];

const TAGLINES = [
  'Crafted with precision.',
  'Designed with intention.',
  'Made to be worn, remembered, and loved.',
];

// ── Main component ────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { productId }             = useParams();
  const [product, setProduct]     = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const navigate                  = useNavigate();
  const { handleGetProductById }  = useProduct();
  const { handleAddItem }         = useCart();

  // ── Fetch ─────────────────────────────────────────────────────────────────
  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      setProduct(data?.product || data);
    } catch (error) {
      console.error('Failed to fetch product details', error);
    }
  }

  useEffect(() => { fetchProductDetails(); }, [productId]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedAttributes(product.variants[0].attributes || {});
    }
  }, [product]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants.find(v => {
      if (!v.attributes) return false;
      const vKeys = Object.keys(v.attributes);
      const sKeys = Object.keys(selectedAttributes);
      return vKeys.length === sKeys.length && vKeys.every(k => v.attributes[k] === selectedAttributes[k]);
    });
  }, [product, selectedAttributes]);

  const availableAttributes = useMemo(() => {
    if (!product?.variants) return {};
    const attrs = {};
    product.variants.forEach(v => {
      if (v.attributes) {
        Object.entries(v.attributes).forEach(([k, val]) => {
          (attrs[k] = attrs[k] || new Set()).add(val);
        });
      }
    });
    Object.keys(attrs).forEach(k => { attrs[k] = Array.from(attrs[k]); });
    return attrs;
  }, [product]);

  useEffect(() => { setSelectedImage(0); }, [activeVariant]);

  const handleAttributeChange = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };
    const exactMatch = product.variants.find(v => {
      const vAttrs = v.attributes || {};
      return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
             Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
    });
    if (exactMatch) {
      setSelectedAttributes(exactMatch.attributes);
    } else {
      const fallback = product.variants.find(v => v.attributes?.[attrName] === value);
      setSelectedAttributes(fallback ? fallback.attributes : newAttrs);
    }
  };

  if (!product) return <Loader />;

  const displayImages = (activeVariant?.images?.length ? activeVariant.images : product.images?.length ? product.images : [{ url: '/placeholder.png' }]);
  const displayPrice  = activeVariant?.price?.amount ? activeVariant.price : product.price;
  const inStock       = (activeVariant?.stock ?? product?.stock ?? 0) > 0;
  const rating        = product.rating || 0;
  const hasImgs       = displayImages.length > 1;

  const handleAddToCart = () => {
    handleAddItem({ productId: product._id, variantId: activeVariant?._id ?? null });
  };

  const handleBuyNow = () => {
    handleAddItem({ productId: product._id, variantId: activeVariant?._id ?? null });
    navigate('/checkout');
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="pd-root font-body" style={{ minHeight: '100vh', background: '#f7f6f3', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: 1152, background: 'white', borderRadius: 24, border: '1px solid #e8e5de', boxShadow: '0 30px 80px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          {/* Brand strip */}
          <div style={{ borderBottom: '1px solid #f0ede6', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD }}>
              Premium Fashion House · Clothy
            </span>
            <span style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.04em' }}>
              Estimated delivery: 3–5 business days
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>

            {/* ── Gallery ── */}
            <div className="fade-up" style={{ padding: '32px', borderRight: '1px solid #f0ede6' }}>
              <div style={{ display: 'flex', gap: 16 }}>

                {/* Thumbnails */}
                {hasImgs && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
                    {displayImages.map((img, idx) => (
                      <button key={idx} onClick={() => setSelectedImage(idx)}
                        className="thumb-btn"
                        style={{ width: 52, height: 66, borderRadius: 10, overflow: 'hidden', border: `2px solid ${idx === selectedImage ? GOLD : '#e8e5de'}`, flexShrink: 0, padding: 0, cursor: 'pointer', background: 'none' }}>
                        <img src={img.url} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div className="img-wrap" style={{ flex: 1, position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#f0ede6', aspectRatio: '4/5' }}>
                  <img
                    src={displayImages[selectedImage]?.url || displayImages[0].url}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity .4s' }}
                  />
                  {hasImgs && (
                    <>
                      <button className="img-nav-btn" style={{ left: 12 }} onClick={() => setSelectedImage(p => p === 0 ? displayImages.length - 1 : p - 1)} aria-label="Previous">
                        <ChevLeft />
                      </button>
                      <button className="img-nav-btn" style={{ right: 12 }} onClick={() => setSelectedImage(p => p === displayImages.length - 1 ? 0 : p + 1)} aria-label="Next">
                        <ChevRight />
                      </button>
                      <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>
                        {selectedImage + 1} / {displayImages.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Product info ── */}
            <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>

                {/* Title */}
                <div className="fade-up-2">
                  <h1 className="font-display" style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 400, color: '#0f0f0f', margin: '0 0 12px' }}>
                    {product.title}
                  </h1>
                  <div style={{ width: 48, height: 2, background: GOLD, borderRadius: 2, marginBottom: 20 }} />
                </div>

                {/* Stars */}
                <div className="fade-up-2" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} filled={i < Math.round(rating)} />)}
                  </div>
                  {rating > 0 && <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>{rating.toFixed(1)} / 5</span>}
                </div>

                {/* Price */}
                <div className="fade-up-3" style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: '#0f0f0f' }}>
                    {formatINR(displayPrice?.amount, displayPrice?.currency)}
                  </span>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>incl. taxes</span>
                </div>

                {/* Description */}
                <p className="fade-up-3" style={{ fontSize: 15, lineHeight: 1.7, color: '#6b7280', marginBottom: 24, maxWidth: 400 }}>
                  {product.description}
                </p>

                {/* Attribute selectors */}
                {Object.entries(availableAttributes).map(([attrName, values]) => (
                  <div key={attrName} className="fade-up-3" style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: GOLD, marginBottom: 10 }}>
                      {attrName}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {values.map(val => (
                        <button key={val}
                          className={`attr-pill${selectedAttributes[attrName] === val ? ' active' : ''}`}
                          onClick={() => handleAttributeChange(attrName, val)}>
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Stock badge */}
                {activeVariant?.stock !== undefined && (
                  <div className="fade-up-3" style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: activeVariant.stock > 0 ? '#15803d' : '#dc2626' }}>
                      {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                )}

                {/* Meta rows */}
                <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: 13, marginBottom: 24 }}>
                  {[
                    { label: 'SKU',      value: String(product._id).slice(-6).toUpperCase() },
                    { label: 'Category', value: product.category || 'Fashion' },
                    { label: 'Listed',   value: new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                    { label: 'Currency', value: displayPrice?.currency },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0ede6', paddingBottom: 10 }}>
                      <span style={{ color: '#9ca3af' }}>{label}</span>
                      <span style={{ fontWeight: 500, color: '#374151' }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Perks */}
                <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                  {PERKS.map(p => (
                    <div key={p.label} className="perk-card">
                      {p.icon}
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{p.label}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{p.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="fade-up-4" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="cta-primary" disabled={!inStock} onClick={handleAddToCart}>
                    <CartIcon /> Add to Cart
                  </button>
                  <button className="cta-outline" disabled={!inStock} onClick={handleBuyNow}>
                    <BoltIcon /> Buy Now
                  </button>
                </div>

                {/* Taglines */}
                <div style={{ paddingTop: 20, borderTop: '1px solid #f0ede6', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {TAGLINES.map(t => (
                    <p key={t} style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{t}</p>
                  ))}
                </div>

                {/* Info rows */}
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>
                  {[
                    { label: 'Shipping',     value: 'Complimentary over ₹15,000' },
                    { label: 'Returns',      value: 'Within 14 days of delivery' },
                    { label: 'Authenticity', value: '100% Guaranteed' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0ede6', paddingBottom: 10 }}>
                      <span>{label}</span><span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;