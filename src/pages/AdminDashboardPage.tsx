import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStoreManage } from '../context/StoreManageContext';
import { useToast } from '../context/ToastContext';
import { Product, BrandName } from '../types/product';
import { OrderStatus } from '../types/order';
import { Modal } from '../components/ui/Modal';
import { CloudinaryUploader } from '../components/ui/CloudinaryUploader';
import { ForgotPasswordModal } from '../components/ui/ForgotPasswordModal';
import {
  getRecentUploadedMedia,
  removeMediaAsset,
  UploadedMediaAsset,
  getOptimizedCloudinaryUrl,
} from '../services/cloudinaryService';
import {
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  PackageCheck,
  Search,
  ExternalLink,
  LogOut,
  Sparkles,
  Tag,
  Key,
  Lock,
  Database,
  Cloud,
  FileCode,
  HardDrive,
  UploadCloud,
  Image as ImageIcon,
  Copy,
  Zap,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAdmin, login, loginWithGoogle, logout, usersList, updateUserRole, deleteUser } =
    useAuth();
  const {
    products,
    orders,
    coupons,
    headerTickerText,
    setHeaderTickerText,
    updateProductStock,
    updateProductPrice,
    updateProductImage,
    toggleProductFeatured,
    toggleProductBestSeller,
    addNewProduct,
    deleteProduct,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
  } = useStoreManage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Gateway Login Form state if not admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'users' | 'media' | 'settings'>('overview');
  const [recentMediaList, setRecentMediaList] = useState<UploadedMediaAsset[]>([]);
  const [editingProductForImage, setEditingProductForImage] = useState<Product | null>(null);
  const [targetProductForMedia, setTargetProductForMedia] = useState<string>('');

  useEffect(() => {
    setRecentMediaList(getRecentUploadedMedia());
  }, [activeTab]);

  const refreshMedia = () => {
    setRecentMediaList(getRecentUploadedMedia());
  };

  // Search & Filter in Inventory Tab
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryBrandFilter, setInventoryBrandFilter] = useState<string>('all');

  // Orders filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modal: Add New Smartphone
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState<BrandName>('Samsung');
  const [newPrice, setNewPrice] = useState<number>(799);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(899);
  const [newStock, setNewStock] = useState<number>(25);
  const [newCategory, setNewCategory] = useState<'flagship' | 'budget' | 'gaming' | 'foldable' | 'midrange'>('flagship');
  const [newProcessor, setNewProcessor] = useState('Snapdragon 8 Elite');
  const [newCamera, setNewCamera] = useState('50MP OIS Main + 50MP Ultra-Wide');
  const [newScreen, setNewScreen] = useState('6.7 inch 120Hz AMOLED');
  const [newBattery, setNewBattery] = useState('5000 mAh');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80');

  // Settings: Header Ticker Edit
  const [tickerInput, setTickerInput] = useState(headerTickerText);

  // Settings: Add Coupon
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'flat'>('percent');
  const [newCouponValue, setNewCouponValue] = useState<number>(10);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // 1. GATEWAY: If user is not admin, show restricted gateway
  if (!isAdmin) {
    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoggingIn(true);
      const res = await login(adminEmail, adminPassword);
      setIsLoggingIn(false);
      if (!res.success) {
        showToast(res.message || 'Invalid administrator credentials', 'error');
      }
    };

    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900 text-slate-100">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              NovaMobile Command Portal
            </h1>
            <div className="flex items-center justify-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Command Access Gateway
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Restricted Area (<code className="text-blue-400">/admin</code>). Administrative clearance required.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">Admin Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying clearance...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-semibold">Or sign in with</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-slate-200 font-medium inline-flex items-center gap-1"
            >
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>

        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
          defaultEmail={adminEmail || 'sameduhub2025@gmail.com'}
          onSuccessReset={(resetEmail, newPass) => {
            setAdminEmail(resetEmail);
            if (newPass) setAdminPassword(newPass);
          }}
        />
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const totalUnitsInStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockProducts = products.filter((p) => p.stockQuantity < 15);

  // Filtered inventory
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesBrand = inventoryBrandFilter === 'all' || p.brand === inventoryBrandFilter;
    return matchesSearch && matchesBrand;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // Handle Add Product Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productItem: Product = {
      id: `phone-${Date.now()}`,
      slug,
      name: newName.trim(),
      brand: newBrand,
      tagline: `Next-generation ${newBrand} powerhouse with ${newProcessor}`,
      description: `Engineered with high precision, featuring ${newScreen}, ${newCamera}, and ${newBattery} battery.`,
      price: newPrice,
      originalPrice: newOriginalPrice,
      discountPercentage: Math.max(0, Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100)),
      rating: 4.8,
      reviewCount: 1,
      images: [newImage],
      ramOptions: ['8 GB', '12 GB'],
      storageOptions: ['256 GB', '512 GB'],
      availableColours: [
        { name: 'Phantom Black', hex: '#1c1e21' },
        { name: 'Silver Platinum', hex: '#d2d5db' },
      ],
      operatingSystem: 'Android 15',
      screenSize: newScreen,
      batteryCapacity: newBattery,
      cameraSpecification: newCamera,
      processor: newProcessor,
      stockQuantity: newStock,
      releaseDate: new Date().toISOString().split('T')[0],
      category: newCategory,
      featured: true,
      bestSeller: false,
      specifications: {
        display: newScreen,
        processor: newProcessor,
        rearCamera: newCamera,
        frontCamera: '32MP AI Selfie camera',
        battery: newBattery,
        charging: '65W Fast Charge',
        network: '5G, Wi-Fi 7, Bluetooth 5.4',
        sim: 'Dual Nano-SIM',
        weight: '198 g',
        os: 'Android 15',
        warranty: '1 Year Brand Warranty',
      },
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: 'Admin Reviewer',
          rating: 5,
          date: 'Just added',
          title: 'Official catalog release',
          comment: 'Verified specs and inventory count directly added via NovaMobile Admin Console.',
          verifiedPurchase: true,
          helpfulCount: 0,
        },
      ],
    };

    addNewProduct(productItem);
    setIsAddModalOpen(false);
    setNewName('');
  };

  // Handle add coupon submit
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: newCouponValue,
      description: newCouponDesc.trim() || `${newCouponValue}${newCouponType === 'percent' ? '%' : '$'} promotional coupon`,
    });

    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Smartphone className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                NovaMobile <span className="text-blue-400">Admin Control</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                /admin mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Authenticated: <strong className="text-slate-200">{currentUser?.name}</strong> ({currentUser?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            title="Open customer storefront"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Console</span>
          </button>
        </div>
      </header>

      {/* Admin Nav Tabs */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-4 py-2">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
            { id: 'inventory', label: `Inventory (${products.length})`, icon: Smartphone },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'users', label: `Users & Staff (${usersList.length})`, icon: Users },
            { id: 'media', label: 'Media & Product Images', icon: ImageIcon },
            { id: 'settings', label: 'Store & Promos', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Total Revenue</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>Real-time recorded customer volume</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Total Orders</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {orders.length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {orders.filter((o) => o.status === 'Processing').length} awaiting shipment
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Total Stock Units</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {totalUnitsInStock}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Across {products.length} smartphone entries
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Low Stock Warnings</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {lowStockProducts.length}
                  </div>
                  <p className="text-[11px] text-amber-400 mt-1">
                    Models with under 15 units
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Overview */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-blue-400 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-800 text-xs">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{order.id}</span>
                          <span className="text-slate-400">· {order.customerName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {order.items.length} item(s) · {order.city}, {order.state} · {order.createdAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-white tabular-nums">
                          ${order.total.toLocaleString()}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : order.status === 'Shipped'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : order.status === 'Processing'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          <option value="Processing" className="bg-slate-900 text-white">Processing</option>
                          <option value="Shipped" className="bg-slate-900 text-white">Shipped</option>
                          <option value="Delivered" className="bg-slate-900 text-white">Delivered</option>
                          <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Low Stock Inventory</span>
                  </h3>
                  <span className="text-[11px] text-amber-400 font-bold">{lowStockProducts.length} items</span>
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{p.brand} · ${p.price}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {p.stockQuantity} left
                        </span>
                        <button
                          onClick={() => updateProductStock(p.id, p.stockQuantity + 20)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded cursor-pointer"
                          title="Restock +20 units"
                        >
                          +20 Units
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: INVENTORY ==================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search model or brand..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={inventoryBrandFilter}
                  onChange={(e) => setInventoryBrandFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Brands ({products.length})</option>
                  {['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Motorola', 'Tecno', 'Infinix', 'OPPO', 'vivo'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Smartphone</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                      <th className="p-3.5">Smartphone</th>
                      <th className="p-3.5">Brand &amp; Category</th>
                      <th className="p-3.5">Price ($)</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Badges</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-contain rounded bg-slate-950 p-1 shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/products/${p.slug}`}
                                className="font-bold text-white hover:text-blue-400 transition-colors line-clamp-1"
                              >
                                {p.name}
                              </Link>
                              <span className="text-[11px] text-slate-400">{p.processor}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200">{p.brand}</span>
                          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">{p.category}</span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">$</span>
                            <input
                              type="number"
                              defaultValue={p.price}
                              onBlur={(e) => updateProductPrice(p.id, Number(e.target.value) || p.price)}
                              className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white tabular-nums focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              defaultValue={p.stockQuantity}
                              onBlur={(e) => updateProductStock(p.id, Number(e.target.value) || 0)}
                              className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-bold text-white tabular-nums focus:outline-none focus:border-blue-500"
                            />
                            <span className="text-[10px] text-slate-400">units</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleProductFeatured(p.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                                p.featured
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                                  : 'bg-slate-950 text-slate-500 border-slate-800'
                              }`}
                            >
                              Featured
                            </button>
                            <button
                              onClick={() => toggleProductBestSeller(p.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                                p.bestSeller
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                                  : 'bg-slate-950 text-slate-500 border-slate-800'
                              }`}
                            >
                              BestSeller
                            </button>
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingProductForImage(p)}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded cursor-pointer transition-colors"
                              title="Update Smartphone Photo"
                            >
                              <UploadCloud className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/products/${p.slug}`}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded"
                              title="View in storefront"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                              title="Delete from catalogue"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ORDERS ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">Customer Orders Management</h3>
                <p className="text-[11px] text-slate-400">Total volume recorded: {orders.length} orders</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-white">{order.id}</span>
                      <span className="text-xs text-slate-400 font-medium">· {order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white tabular-nums">
                        Total: ${order.total.toLocaleString()}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : order.status === 'Shipped'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : order.status === 'Processing'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        <option value="Processing" className="bg-slate-900 text-white">Processing</option>
                        <option value="Shipped" className="bg-slate-900 text-white">Shipped</option>
                        <option value="Delivered" className="bg-slate-900 text-white">Delivered</option>
                        <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Customer Destination Info */}
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Delivery Address</p>
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-slate-300">{order.address}, {order.city}, {order.state} {order.postalCode}</p>
                      <p className="text-slate-400">{order.email} · {order.phone}</p>
                      <p className="text-slate-500 text-[11px] pt-1">
                        Method: <strong className="text-slate-300">{order.deliveryMethod === 'express' ? 'Priority 24h Air' : 'Standard'}</strong> · Payment: <strong className="text-slate-300 uppercase">{order.paymentMethod}</strong>
                      </p>
                    </div>

                    {/* Purchased Items */}
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Items Purchased</p>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={it.image} alt={it.name} className="w-8 h-8 object-contain rounded bg-slate-900 p-0.5" />
                            <div className="truncate">
                              <span className="font-semibold text-white truncate block">{it.name}</span>
                              <span className="text-[10px] text-slate-400">{it.color} · {it.storage} (Qty: {it.quantity})</span>
                            </div>
                          </div>
                          <span className="font-bold text-slate-200 tabular-nums shrink-0">
                            ${(it.unitPrice * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: USERS ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Registered Customer &amp; Staff Directory</h3>
                <p className="text-[11px] text-slate-400">Users created via Sign Up or administrative seed</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Registered Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                          {usr.name.charAt(0)}
                        </div>
                        <span>{usr.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">{usr.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            usr.role === 'admin'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {usr.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">{usr.joinedDate}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateUserRole(usr.id, usr.role === 'admin' ? 'customer' : 'admin')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded cursor-pointer"
                          >
                            Toggle Role
                          </button>
                          <button
                            onClick={() => deleteUser(usr.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB: PRODUCT MEDIA & STORAGE ==================== */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Top Banner / Status */}
            <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-white tracking-tight">
                        Product Media Storage &amp; Asset CDN
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Cloud Storage Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Store high-resolution smartphone photography, catalogue assets, and promotional banners with automatic responsive compression.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Upload Workbench */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-blue-400" />
                    <span>Product Image Upload Workbench</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Upload smartphone images, banner graphics, or accessories directly to media storage.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <CloudinaryUploader
                  label="Upload Smartphone Photo"
                  helperText="Drag & drop phone image or click to browse (PNG, JPG, WEBP, AVIF)"
                  onUploadSuccess={() => {
                    refreshMedia();
                  }}
                />
              </div>
            </div>

            {/* Product Media Library & Recent Uploads Gallery */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Product Media Library &amp; Gallery ({recentMediaList.length} assets)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Recent assets hosted in storage. Click to copy URL or assign to an existing smartphone in your catalogue.
                  </p>
                </div>

                {products.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Quick Assign Target:</span>
                    <select
                      value={targetProductForMedia}
                      onChange={(e) => setTargetProductForMedia(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none cursor-pointer max-w-[200px] truncate"
                    >
                      <option value="">Select smartphone...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {recentMediaList.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <Cloud className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
                  <p>No uploaded media assets yet.</p>
                  <p className="text-[11px] text-slate-600 mt-1">Upload an image above to populate your media gallery.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentMediaList.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-sm"
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center p-2">
                        <img
                          src={asset.secureUrl || asset.url}
                          alt={asset.name}
                          className="max-h-full max-w-full object-contain rounded group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950/80 text-blue-300 border border-slate-700 uppercase">
                          {asset.format}
                        </span>
                      </div>

                      {/* Details & Actions */}
                      <div className="p-3.5 space-y-2.5 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white truncate" title={asset.name}>
                            {asset.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>{asset.width && asset.height ? `${asset.width}×${asset.height}` : 'HD'}</span>
                            <span>·</span>
                            <span>{asset.size ? `${Math.round(asset.size / 1024)} KB` : 'HD Asset'}</span>
                            <span>·</span>
                            <span>{asset.uploadedAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(asset.secureUrl || asset.url);
                              showToast('Image URL copied to clipboard!', 'success');
                            }}
                            className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-[11px] rounded-lg border border-slate-800 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Copy className="w-3 h-3 text-blue-400" />
                            <span>Copy URL</span>
                          </button>

                          {targetProductForMedia ? (
                            <button
                              type="button"
                              onClick={() => {
                                updateProductImage(targetProductForMedia, asset.secureUrl || asset.url);
                              }}
                              className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer transition-colors"
                              title="Assign this photo to selected smartphone"
                            >
                              Apply
                            </button>
                          ) : (
                            <a
                              href={asset.secureUrl || asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 flex items-center justify-center"
                              title="Open full size"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              removeMediaAsset(asset.id);
                              refreshMedia();
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            title="Remove from media list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: STORE & PROMOS ==================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header Motion Ticker Editor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Customize Top Header Motion Announcement</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  The message text continuously moving across the top header in real time.
                </p>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setHeaderTickerText(tickerInput)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save Ticker Motion Text
                </button>
              </div>
            </div>

            {/* Coupons & Promo Codes Manager */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span>Promotional Coupon Codes</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Customers can apply these discount vouchers during cart and checkout.
                </p>
              </div>

              {/* Active Coupons List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {coupons.map((c) => (
                  <div key={c.code} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-400 font-mono tracking-wider">{c.code}</span>
                      <span className="text-slate-400 ml-2">({c.type === 'percent' ? `${c.value}% off` : `$${c.value} off`})</span>
                      <p className="text-[11px] text-slate-500">{c.description}</p>
                    </div>
                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                      title="Remove coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Coupon Form */}
              <form onSubmit={handleAddCoupon} className="pt-2 border-t border-slate-800 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="CODE (e.g. FLASH20)"
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white uppercase focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none cursor-pointer"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Dollar ($)</option>
                  </select>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    placeholder="Value"
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="Brief description (e.g. 20% discount on orders)"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer shrink-0"
                  >
                    Add Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Add New Smartphone */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Smartphone to Store Inventory"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Model Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Samsung Galaxy S25 Plus"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Brand *</label>
              <select
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value as BrandName)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none cursor-pointer"
              >
                {['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Motorola', 'Tecno', 'Infinix', 'OPPO', 'vivo'].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Price ($) *</label>
              <input
                type="number"
                required
                min={1}
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Original Price ($) *</label>
              <input
                type="number"
                required
                min={1}
                value={newOriginalPrice}
                onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Category *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="flagship">Flagship</option>
                <option value="budget">Budget</option>
                <option value="gaming">Gaming</option>
                <option value="foldable">Foldable</option>
                <option value="midrange">Midrange</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Processor SoC *</label>
              <input
                type="text"
                required
                value={newProcessor}
                onChange={(e) => setNewProcessor(e.target.value)}
                placeholder="e.g. Qualcomm Snapdragon 8 Elite"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Camera Highlights *</label>
              <input
                type="text"
                required
                value={newCamera}
                onChange={(e) => setNewCamera(e.target.value)}
                placeholder="e.g. 200MP + 50MP Periscope"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Display Specs *</label>
              <input
                type="text"
                required
                value={newScreen}
                onChange={(e) => setNewScreen(e.target.value)}
                placeholder="e.g. 6.8 inch 120Hz LTPO AMOLED"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <CloudinaryUploader
                label="Smartphone Image"
                helperText="Upload phone picture to storage or enter URL below"
                currentImageUrl={newImage}
                onUploadSuccess={(url) => {
                  if (url) {
                    setNewImage(url);
                    refreshMedia();
                  }
                }}
              />
              <div className="pt-1">
                <label className="block font-medium text-[11px] text-slate-500 mb-1">
                  Direct Image URL / CDN Link:
                </label>
                <input
                  type="text"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or direct image URL"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Add Smartphone to Store
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Change Smartphone Image */}
      <Modal
        isOpen={Boolean(editingProductForImage)}
        onClose={() => setEditingProductForImage(null)}
        title={`Update Smartphone Photo: ${editingProductForImage?.name || ''}`}
        maxWidth="lg"
      >
        {editingProductForImage && (
          <div className="space-y-4 text-xs text-slate-800">
            <p className="text-slate-600">
              Upload a new high-resolution photo for this smartphone. Once uploaded, the storefront catalogue will automatically update with the new image.
            </p>

            <CloudinaryUploader
              label="New Photo for Smartphone"
              currentImageUrl={editingProductForImage.images[0]}
              onUploadSuccess={(url) => {
                if (url) {
                  updateProductImage(editingProductForImage.id, url);
                  setEditingProductForImage(null);
                  refreshMedia();
                }
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditingProductForImage(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
