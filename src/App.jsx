import { useEffect, useMemo, useRef, useState } from "react";
import { BadgePercent, LayoutDashboard, Mail, Package, RefreshCw, Star, Tags } from "lucide-react";
import { api, API_BASE_URL } from "./api";
import Logo from "./assets/BIS 1.png";
import Overview from "./views/Overview";
import Brands from "./views/Brands";
import Categories from "./views/Categories";
import Products from "./views/Products";
import Messages from "./views/Messages";
import Reviews from "./views/Reviews";

const views = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "brands", label: "Brands", icon: BadgePercent },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "products", label: "Products", icon: Package },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "reviews", label: "Reviews", icon: Star }
];

const emptyBrandForm = { brandName: "", logoBrand: "", brandID: null };
const emptyCategoryForm = { categoryName: "", description: "", categoryID: null };
const emptyProductForm = {
  categoryID: "",
  productName: "",
  description: "",
  price: "",
  stockQuantity: "",
  imageID: null,
  imageURL: "",
  imageAltText: "",
  imageDisplayOrder: 0,
  productID: null
};
const emptyDetailForm = {
  detailID: null,
  productID: "",
  crop: "",
  pest: "",
  dosage: "",
  applicationMethod: ""
};

function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
}

function App() {
  const [activeView, setActiveView] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [brandForm, setBrandForm] = useState(emptyBrandForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [detailForm, setDetailForm] = useState(emptyDetailForm);
  const [selectedDetailsProductID, setSelectedDetailsProductID] = useState("");
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);
  const brandLogoInputRef = useRef(null);
  const productImageInputRef = useRef(null);

  const stats = useMemo(
    () => [
      { label: "Users", value: users.length },
      { label: "Brands", value: brands.length },
      { label: "Categories", value: categories.length },
      { label: "Products", value: products.length },
      { label: "Messages", value: messages.length },
      { label: "Reviews", value: reviews.length }
    ],
    [users.length, brands.length, categories.length, products.length, messages.length, reviews.length]
  );

  const firstImageByProductID = useMemo(() => {
    const imageMap = new Map();
    const sorted = [...productImages].sort((a, b) => {
      const orderA = Number(a.displayOrder ?? 0);
      const orderB = Number(b.displayOrder ?? 0);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return Number(a.imageID) - Number(b.imageID);
    });

    for (const image of sorted) {
      const productID = Number(image.productID);
      if (!imageMap.has(productID)) {
        imageMap.set(productID, image);
      }
    }
    return imageMap;
  }, [productImages]);

  const filteredProductDetails = useMemo(() => {
    if (!selectedDetailsProductID) {
      return [];
    }
    return productDetails.filter(
      (item) => Number(item.productID) === Number(selectedDetailsProductID)
    );
  }, [productDetails, selectedDetailsProductID]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [
        usersRes,
        brandsRes,
        categoriesRes,
        productsRes,
        productImagesRes,
        productDetailsRes,
        messagesRes,
        reviewsRes
      ] = await Promise.all([
        api.users.list(),
        api.brands.list(),
        api.categories.list(),
        api.products.list(),
        api.productImages.list(),
        api.productDetails.list(),
        api.messages.list(),
        api.reviews.list()
      ]);

      setUsers(usersRes || []);
      setBrands(brandsRes || []);
      setCategories(categoriesRes || []);
      setProducts(productsRes || []);
      setProductImages(productImagesRes || []);
      setProductDetails(productDetailsRes || []);
      setMessages(messagesRes || []);
      setReviews(reviewsRes || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetBrandForm() {
    setBrandForm(emptyBrandForm);
    setBrandLogoFile(null);
    if (brandLogoInputRef.current) {
      brandLogoInputRef.current.value = "";
    }
  }

  function resetProductForm() {
    setProductForm(emptyProductForm);
    setProductImageFile(null);
    if (productImageInputRef.current) {
      productImageInputRef.current.value = "";
    }
  }

  function resetDetailForm() {
    setDetailForm({
      ...emptyDetailForm,
      productID: selectedDetailsProductID || ""
    });
  }

  async function onSaveBrand(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      let finalLogoBrand = brandForm.logoBrand.trim();
      if (brandLogoFile) {
        const uploadRes = await api.uploads.uploadBrandImage(brandLogoFile);
        finalLogoBrand = uploadRes.imageURL;
      }

      const payload = {
        brandName: brandForm.brandName.trim(),
        logoBrand: finalLogoBrand
      };

      if (brandForm.brandID) {
        await api.brands.update(brandForm.brandID, payload);
        setNotice("Brand updated.");
      } else {
        await api.brands.create(payload);
        setNotice("Brand created.");
      }

      resetBrandForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save brand.");
    }
  }

  async function onDeleteBrand(brandID) {
    setError("");
    setNotice("");
    try {
      await api.brands.remove(brandID);
      setNotice("Brand deleted.");
      if (Number(brandForm.brandID) === Number(brandID)) {
        resetBrandForm();
      }
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete brand.");
    }
  }

  async function onSaveCategory(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      if (categoryForm.categoryID) {
        await api.categories.update(categoryForm.categoryID, {
          categoryName: categoryForm.categoryName,
          description: categoryForm.description
        });
        setNotice("Category updated.");
      } else {
        await api.categories.create({
          categoryName: categoryForm.categoryName,
          description: categoryForm.description
        });
        setNotice("Category created.");
      }

      setCategoryForm(emptyCategoryForm);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save category.");
    }
  }

  async function onDeleteCategory(categoryID) {
    setError("");
    setNotice("");
    try {
      await api.categories.remove(categoryID);
      setNotice("Category deleted.");
      if (Number(categoryForm.categoryID) === Number(categoryID)) {
        setCategoryForm(emptyCategoryForm);
      }
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete category.");
    }
  }

  async function onSaveProduct(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const payload = {
      categoryID: Number(productForm.categoryID),
      productName: productForm.productName,
      description: productForm.description,
      price: Number(productForm.price),
      stockQuantity: Number(productForm.stockQuantity)
    };

    try {
      let finalImageURL = productForm.imageURL.trim();
      if (productImageFile) {
        const uploadRes = await api.uploads.uploadProductImage(productImageFile);
        finalImageURL = uploadRes.imageURL;
      }

      if (productForm.productID) {
        const updatedProduct = await api.products.update(productForm.productID, payload);
        const finalProductID = Number(updatedProduct?.productID || productForm.productID);

        if (finalImageURL) {
          const imagePayload = {
            productID: finalProductID,
            imageURL: finalImageURL,
            altText: productForm.imageAltText.trim(),
            displayOrder: Number(productForm.imageDisplayOrder || 0)
          };

          if (productForm.imageID) {
            await api.productImages.update(productForm.imageID, imagePayload);
          } else {
            await api.productImages.create(imagePayload);
          }
        }

        setNotice("Product updated.");
      } else {
        if (!finalImageURL) {
          setError("Image URL or image file is required when creating a product.");
          return;
        }

        const createdProduct = await api.products.create(payload);
        await api.productImages.create({
          productID: Number(createdProduct.productID),
          imageURL: finalImageURL,
          altText: productForm.imageAltText.trim(),
          displayOrder: Number(productForm.imageDisplayOrder || 0)
        });
        setNotice("Product created.");
      }

      resetProductForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    }
  }

  async function onDeleteProduct(productID) {
    setError("");
    setNotice("");
    try {
      await api.products.remove(productID);
      setNotice("Product deleted.");
      if (Number(productForm.productID) === Number(productID)) {
        resetProductForm();
      }
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    }
  }

  async function onSaveProductDetail(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const payload = {
      productID: Number(detailForm.productID),
      crop: detailForm.crop.trim(),
      pest: detailForm.pest.trim(),
      dosage: detailForm.dosage.trim(),
      applicationMethod: detailForm.applicationMethod.trim()
    };

    if (!payload.productID || !payload.crop || !payload.pest || !payload.dosage || !payload.applicationMethod) {
      setError("Product, crop, pest, dosage, and application method are required.");
      return;
    }

    try {
      if (detailForm.detailID) {
        await api.productDetails.update(detailForm.detailID, payload);
        setNotice("Product detail updated.");
      } else {
        await api.productDetails.create(payload);
        setNotice("Product detail added.");
      }

      resetDetailForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save product detail.");
    }
  }

  async function onDeleteProductDetail(detailID) {
    setError("");
    setNotice("");
    try {
      await api.productDetails.remove(detailID);
      if (Number(detailForm.detailID) === Number(detailID)) {
        resetDetailForm();
      }
      setNotice("Product detail deleted.");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete product detail.");
    }
  }

  async function onChangeMessageStatus(messageID, status) {
    setError("");
    setNotice("");
    try {
      await api.messages.update(messageID, { status });
      setNotice("Message status updated.");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to update message status.");
    }
  }

  async function onDeleteMessage(messageID) {
    setError("");
    setNotice("");
    try {
      await api.messages.remove(messageID);
      setNotice("Message deleted.");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete message.");
    }
  }

  function renderActiveView() {
    if (activeView === "overview") {
      return <Overview stats={stats} messages={messages} formatDate={formatDate} />;
    }

    if (activeView === "categories") {
      return (
        <Categories
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          categories={categories}
          onSaveCategory={onSaveCategory}
          onDeleteCategory={onDeleteCategory}
          emptyCategoryForm={emptyCategoryForm}
          formatDate={formatDate}
        />
      );
    }

    if (activeView === "brands") {
      return (
        <Brands
          brandForm={brandForm}
          setBrandForm={setBrandForm}
          brandLogoFile={brandLogoFile}
          setBrandLogoFile={setBrandLogoFile}
          brandLogoInputRef={brandLogoInputRef}
          brands={brands}
          onSaveBrand={onSaveBrand}
          onDeleteBrand={onDeleteBrand}
          resetBrandForm={resetBrandForm}
          formatDate={formatDate}
        />
      );
    }

    if (activeView === "products") {
      return (
        <Products
          productForm={productForm}
          setProductForm={setProductForm}
          productImageFile={productImageFile}
          setProductImageFile={setProductImageFile}
          productImageInputRef={productImageInputRef}
          categories={categories}
          products={products}
          firstImageByProductID={firstImageByProductID}
          onSaveProduct={onSaveProduct}
          resetProductForm={resetProductForm}
          onDeleteProduct={onDeleteProduct}
          detailForm={detailForm}
          setDetailForm={setDetailForm}
          selectedDetailsProductID={selectedDetailsProductID}
          setSelectedDetailsProductID={setSelectedDetailsProductID}
          filteredProductDetails={filteredProductDetails}
          onSaveProductDetail={onSaveProductDetail}
          resetDetailForm={resetDetailForm}
          onDeleteProductDetail={onDeleteProductDetail}
          formatDate={formatDate}
        />
      );
    }

    if (activeView === "messages") {
      return (
        <Messages
          messages={messages}
          onChangeMessageStatus={onChangeMessageStatus}
          onDeleteMessage={onDeleteMessage}
          formatDate={formatDate}
        />
      );
    }

    if (activeView === "reviews") {
      return <Reviews reviews={reviews} formatDate={formatDate} />;
    }

    return null;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <img src={Logo} alt="Logo" />
        <p>Admin Dashboard</p>

        <nav>
          {views.map((view) => {
            const Icon = view.icon;
            const active = activeView === view.id;
            return (
              <button
                key={view.id}
                className={active ? "nav-btn active" : "nav-btn"}
                onClick={() => setActiveView(view.id)}
                type="button"
                title={view.label}
              >
                <Icon size={16} />
                <span>{view.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="api-url">
          <div>API</div>
          <code>{API_BASE_URL}</code>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>{views.find((view) => view.id === activeView)?.label}</h2>
          <button className="icon-btn" onClick={loadData} type="button" title="Refresh Data">
            <RefreshCw size={16} />
          </button>
        </header>

        {error ? <div className="alert error">{error}</div> : null}
        {notice ? <div className="alert success">{notice}</div> : null}
        {loading ? <div className="alert info">Loading data...</div> : null}

        {renderActiveView()}
      </main>
    </div>
  );
}

export default App;
