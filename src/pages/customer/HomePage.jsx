import { useEffect, useMemo, useRef, useState } from "react";
import TopNav from "../../components/customer/TopNav.jsx";
import Hero from "../../components/customer/Hero.jsx";
import CampaignStrip from "../../components/customer/CampaignStrip.jsx";
import CategoryPills from "../../components/customer/CategoryPills.jsx";
import ProductCard from "../../components/customer/ProductCard.jsx";
import ProductDetailModal from "../../components/customer/ProductDetailModal.jsx";
import CartDrawer from "../../components/customer/CartDrawer.jsx";
import CheckoutModal from "../../components/customer/CheckoutModal.jsx";
import SearchOverlay from "../../components/customer/SearchOverlay.jsx";
import FavoritesPanel from "../../components/customer/FavoritesPanel.jsx";
import ProfilePanel from "../../components/customer/ProfilePanel.jsx";
import Footer from "../../components/customer/Footer.jsx";
import BottomTabBar from "../../components/customer/BottomTabBar.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import { useCategories } from "../../hooks/useCategories.js";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import { useSettings } from "../../hooks/useSettings.js";
import { createOrder } from "../../services/orders.js";
import { useFavorites } from "../../hooks/useFavorites.js";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function HomePage() {
  const { products, isLoading: productsLoading, error } = useProducts();
  const { categories } = useCategories();
  const { campaigns } = useCampaigns();
  const { settings } = useSettings();
  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites();
  const { items, total, closeCart, addItem, clearCart } = useCart();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRefs = useRef(new Map());
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef(null);
  const hasUserScrolledRef = useRef(false);

  function handleCategoryChange(name) {
    setActiveCategory(name);

    isProgrammaticScrollRef.current = true;
    if (programmaticScrollTimeoutRef.current) clearTimeout(programmaticScrollTimeoutRef.current);
    programmaticScrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 700);

    if (name === "all") {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const cat = activeCategories.find((c) => c.name === name);
    if (cat) sectionRefs.current.get(cat.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeCategories = useMemo(() => categories.filter((c) => c.active), [categories]);
  const activeCampaigns = useMemo(() => campaigns.filter((c) => c.active), [campaigns]);

  const groupedSections = useMemo(() => {
    return activeCategories
      .map((cat) => ({ ...cat, products: products.filter((p) => p.active && p.category === cat.name) }))
      .filter((group) => group.products.length > 0);
  }, [activeCategories, products]);

  useEffect(() => {
    function onFirstScroll() {
      hasUserScrolledRef.current = true;
      window.removeEventListener("scroll", onFirstScroll);
    }
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    return () => window.removeEventListener("scroll", onFirstScroll);
  }, []);

  useEffect(() => {
    const elements = groupedSections
      .map((group) => sectionRefs.current.get(group.id))
      .filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current || !hasUserScrolledRef.current) return;
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;
        const group = groupedSections.find((g) => sectionRefs.current.get(g.id) === visible.target);
        if (group) setActiveCategory(group.name);
      },
      { rootMargin: "-132px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groupedSections]);

  function handleQuickAdd(product) {
    addItem({
      productId: product.id,
      qty: 1,
      sizeName: null,
      sizeDelta: 0,
      selectedExtras: [],
      spicyLevel: null,
      unitPrice: product.price,
      name: product.name,
      image: product.image,
      variant: null,
      price: product.price,
    });
    showToast(`${product.name} səbətə əlavə edildi`);
  }

  function handleAddFromModal(item) {
    addItem(item);
    showToast(`${item.name} səbətə əlavə edildi`);
  }

  async function handleOrderSubmitted(orderData) {
    try {
      // service call, not useOrders(): the admin order list is not readable
      // (or needed) on the public storefront
      await createOrder(orderData);
    } catch (err) {
      showToast("Sifariş göndərilə bilmədi. Yenidən cəhd edin.", "error");
      throw err; // keeps the checkout modal open with the cart intact
    }
    clearCart();
    closeCart();
  }

  function handleOrderComplete() {
    setCheckoutOpen(false);
    showToast("Sifarişiniz göndərildi");
  }

  return (
    <>
      <TopNav onSearchClick={() => setSearchOpen(true)} whatsappNumber={settings?.general?.whatsapp1} />
      <Hero />

      <CampaignStrip campaigns={activeCampaigns} />

      <CategoryPills categories={activeCategories} active={activeCategory} onChange={handleCategoryChange} />

      <main id="menu" className="mx-auto max-w-6xl scroll-mt-33 px-4 py-6 pb-24 sm:pb-8">
        {error ? (
          <EmptyState icon="⚠️" title="Xəta baş verdi" description={error} />
        ) : productsLoading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-64" />
            ))}
          </div>
        ) : groupedSections.length === 0 ? (
          <EmptyState icon="🍽️" title="Məhsul tapılmadı" description="Hazırda məhsul yoxdur." />
        ) : (
          groupedSections.map((group) => (
            <section
              key={group.id}
              id={`cat-${group.id}`}
              ref={(el) => {
                if (el) sectionRefs.current.set(group.id, el);
                else sectionRefs.current.delete(group.id);
              }}
              className="scroll-mt-33 py-4"
            >
              <h2 className="mb-4 flex items-center gap-2 font-(--font-display) text-xl font-bold text-text">
                <span>{group.icon}</span>
                {group.name}
              </h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {group.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpen={setSelectedProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer settings={settings} />
      <BottomTabBar
        onFavoritesClick={() => setFavoritesOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
        onProfileClick={() => setProfileOpen(true)}
      />

      <ProductDetailModal
        product={selectedProduct}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddFromModal}
      />

      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />

      <ProfilePanel isOpen={profileOpen} settings={settings} onClose={() => setProfileOpen(false)} />

      <CheckoutModal
        isOpen={checkoutOpen}
        items={items}
        total={total}
        whatsappNumber={settings?.general?.whatsapp1}
        onClose={() => setCheckoutOpen(false)}
        onSubmitted={async (data) => {
          await handleOrderSubmitted(data);
          handleOrderComplete();
        }}
      />

      <SearchOverlay
        isOpen={searchOpen}
        products={products}
        onClose={() => setSearchOpen(false)}
        onSelect={(p) => {
          setSearchOpen(false);
          setSelectedProduct(p);
        }}
      />

      <FavoritesPanel
        isOpen={favoritesOpen}
        products={products}
        favorites={favorites}
        onClose={() => setFavoritesOpen(false)}
        onSelect={(p) => {
          setFavoritesOpen(false);
          setSelectedProduct(p);
        }}
      />
    </>
  );
}
