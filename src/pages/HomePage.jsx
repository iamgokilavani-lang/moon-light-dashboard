import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  TrendingUp,
  Headphones,
  Cpu,
  Watch,
  Shirt,
  Home
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Special Launch Discount",
    title: "Next-Gen Studio Audio Experience",
    subtitle: "Immerse yourself in pure acoustic fidelity with hybrid active noise cancellation and 40-hour battery life.",
    ctaText: "Shop Headphones",
    ctaLink: "/product/prod-1",
    secondaryText: "View Audio Catalog",
    secondaryLink: "/products?category=Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-indigo-950 via-slate-900 to-slate-950",
    highlight: "$80 OFF Today"
  },
  {
    id: 2,
    badge: "Flagship Wearable",
    title: "Titanium Precision for Every Milestone",
    subtitle: "Chronos Ultra Smartwatch with sapphire AMOLED display, continuous ECG and 14 days of typical battery life.",
    ctaText: "Explore Chronos",
    ctaLink: "/product/prod-2",
    secondaryText: "Browse Wearables",
    secondaryLink: "/products?category=Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-blue-950 via-slate-900 to-slate-950",
    highlight: "Free Shipping"
  },
  {
    id: 3,
    badge: "Workspace Essentials",
    title: "Acoustic Tactile Mechanical Precision",
    subtitle: "Apex RGB hot-swappable keyboard and ergonomic accessories built to elevate your daily productivity and focus.",
    ctaText: "Upgrade Setup",
    ctaLink: "/product/prod-3",
    secondaryText: "All Electronics",
    secondaryLink: "/products?category=Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-violet-950 via-slate-900 to-slate-950",
    highlight: "Popular Choice"
  }
];

const CATEGORIES = [
  { name: "Electronics", icon: Cpu, count: "4 Products", color: "from-blue-500/10 to-indigo-500/10 text-blue-600" },
  { name: "Audio", icon: Headphones, count: "2 Products", color: "from-indigo-500/10 to-purple-500/10 text-indigo-600" },
  { name: "Wearables", icon: Watch, count: "1 Product", color: "from-emerald-500/10 to-teal-500/10 text-emerald-600" },
  { name: "Fashion", icon: Shirt, count: "3 Products", color: "from-rose-500/10 to-orange-500/10 text-rose-600" },
  { name: "Home & Office", icon: Home, count: "2 Products", color: "from-amber-500/10 to-yellow-500/10 text-amber-600" },
];

export const HomePage = () => {
  const { products } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('featured');

  // Countdown timer for Deal of the Day
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  // Filter products by tab
  let filteredProducts = products.filter(p => p.isFeatured);
  if (activeTab === 'trending') {
    filteredProducts = products.filter(p => p.isTrending);
  } else if (activeTab === 'new') {
    filteredProducts = products.filter(p => p.isNew);
  }

  // Fallback to all if tab empty
  if (filteredProducts.length === 0) {
    filteredProducts = products.slice(0, 8);
  }

  // Deal of the day product
  const dealProduct = products.find(p => p.id === 'prod-1') || products[0];

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl">
        <div className={`relative min-h-[500px] sm:min-h-[560px] flex items-center bg-gradient-to-r ${slide.gradient} transition-all duration-700`}>
          {/* Subtle Background Overlay Grid */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10 w-full">
            {/* Text details */}
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-brand-300">
                <Sparkles size={14} className="text-amber-400" />
                <span>{slide.badge}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-amber-400 font-bold">{slide.highlight}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {slide.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={slide.ctaLink}
                  className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={slide.secondaryLink}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 backdrop-blur-sm transition-all"
                >
                  {slide.secondaryText}
                </Link>
              </div>
            </div>

            {/* Visual Photo */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-xs uppercase tracking-wider text-brand-300 font-semibold">Special Offer</span>
                    <h3 className="text-lg font-bold">Featured Innovation</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Navigation Buttons */}
          <button
            onClick={() => setCurrentSlide(prev => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all border border-white/10"
            title="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all border border-white/10"
            title="Next Slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === i ? 'w-8 bg-brand-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-brand-600">Explore By Category</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Top Shopping Departments</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-brand-400 shadow-soft-sm hover:shadow-soft transition-all duration-300 text-center flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm text-slate-800 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-400 mt-0.5">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-brand-600">Curated Catalog</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Recommended Products</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'featured'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'trending'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trending 🔥
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'new'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Arrivals ✨
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-brand-500 bg-white text-slate-800 hover:text-brand-600 font-semibold text-xs shadow-soft-sm transition-all"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Deal of the Day Banner */}
      {dealProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-soft-lg">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-lg">
                  <Zap size={14} className="fill-slate-900" /> Deal of the Day
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  {dealProduct.title}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  {dealProduct.description}
                </p>

                {/* Countdown Timer */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-brand-200">
                    <Clock size={16} />
                    <span>Offer ends in:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-center min-w-[50px]">
                      <span className="block text-lg font-extrabold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400">Hours</span>
                    </div>
                    <span className="font-bold text-lg text-white">:</span>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-center min-w-[50px]">
                      <span className="block text-lg font-extrabold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400">Mins</span>
                    </div>
                    <span className="font-bold text-lg text-white">:</span>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-center min-w-[50px]">
                      <span className="block text-lg font-extrabold text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400">Secs</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">${dealProduct.price.toFixed(2)}</span>
                    {dealProduct.originalPrice && (
                      <span className="text-lg text-slate-400 line-through">${dealProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <Link
                    to={`/product/${dealProduct.id}`}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                  >
                    Claim Deal Now
                  </Link>
                </div>
              </div>

              {/* Deal Image */}
              <div className="lg:col-span-5 flex justify-center">
                <img
                  src={dealProduct.thumbnail}
                  alt={dealProduct.title}
                  className="w-full max-w-sm rounded-2xl shadow-2xl object-cover aspect-square border border-white/10"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Trust & Reviews Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-600">Client Reviews</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Loved by thousands of shoppers worldwide</h2>
          <p className="text-xs text-slate-500 mt-2">
            Real feedback from verified purchasers who rely on Moon Light Store daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-3">
            <div className="flex text-amber-400 gap-1 text-sm">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The Aura Pro noise cancelling headphones blew my expectations away. Fast shipping and the packaging was ultra-clean!"
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Gokilavani"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Gokilavani</h4>
                <span className="text-[11px] text-emerald-600 font-medium">Verified Buyer</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-3">
            <div className="flex text-amber-400 gap-1 text-sm">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The checkout experience is the smoothest I have ever tested. Love the live cart synchronization and instant promo codes."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Vikram Malhotra"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Vikram Malhotra</h4>
                <span className="text-[11px] text-emerald-600 font-medium">Verified Buyer</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm space-y-3">
            <div className="flex text-amber-400 gap-1 text-sm">★★★★★</div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Nomad Canvas Backpack arrived in 2 days. The craftsmanship is pure luxury. Will definitely order all my tech gear here."
            </p>
            <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Ananya Iyer"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Ananya Iyer</h4>
                <span className="text-[11px] text-emerald-600 font-medium">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
