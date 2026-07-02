import { Pencil, Plus, Save, Trash2 } from "lucide-react";

function Products({
  productForm,
  setProductForm,
  productImageFile,
  setProductImageFile,
  productImageInputRef,
  categories,
  products,
  firstImageByProductID,
  onSaveProduct,
  resetProductForm,
  onDeleteProduct,
  detailForm,
  setDetailForm,
  selectedDetailsProductID,
  setSelectedDetailsProductID,
  filteredProductDetails,
  onSaveProductDetail,
  resetDetailForm,
  onDeleteProductDetail,
  formatDate
}) {
  return (
    <section className="product-page">
      <div className="stack">
        <form className="panel form-grid" onSubmit={onSaveProduct}>
          <h3>{productForm.productID ? "Edit Product" : "Add Product"}</h3>
          <label>
            Category
            <select
              value={productForm.categoryID}
              onChange={(event) =>
                setProductForm((old) => ({ ...old, categoryID: event.target.value }))
              }
              required
            >
              <option value="">Choose category</option>
              {categories.map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Product Name
            <input
              value={productForm.productName}
              onChange={(event) =>
                setProductForm((old) => ({ ...old, productName: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Description
            <textarea
              rows="3"
              value={productForm.description}
              onChange={(event) =>
                setProductForm((old) => ({ ...old, description: event.target.value }))
              }
            />
          </label>
          <label>
            Image URL
            <input
              value={productForm.imageURL}
              onChange={(event) =>
                setProductForm((old) => ({ ...old, imageURL: event.target.value }))
              }
              placeholder="https://example.com/product-image.jpg"
            />
          </label>
          <label>
            Choose Image File
            <input
              ref={productImageInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setProductImageFile(file);
              }}
            />
          </label>
          {productImageFile ? (
            <p className="file-note">Selected file: {productImageFile.name}</p>
          ) : null}
          <div className="split-inputs">
            <label>
              Image Alt Text
              <input
                value={productForm.imageAltText}
                onChange={(event) =>
                  setProductForm((old) => ({ ...old, imageAltText: event.target.value }))
                }
              />
            </label>
            <label>
              Image Order
              <input
                type="number"
                min="0"
                step="1"
                value={productForm.imageDisplayOrder}
                onChange={(event) =>
                  setProductForm((old) => ({ ...old, imageDisplayOrder: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="split-inputs">
            <label>
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                onChange={(event) =>
                  setProductForm((old) => ({ ...old, price: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                step="1"
                value={productForm.stockQuantity}
                onChange={(event) =>
                  setProductForm((old) => ({ ...old, stockQuantity: event.target.value }))
                }
                required
              />
            </label>
          </div>
          <div className="actions">
            <button className="btn primary" type="submit" title="Save Product">
              {productForm.productID ? <Save size={16} /> : <Plus size={16} />}
              <span>{productForm.productID ? "Update" : "Create"}</span>
            </button>
            <button
              className="btn"
              type="button"
              onClick={resetProductForm}
              title="Reset Form"
            >
              Reset
            </button>
          </div>
        </form>

        <article className="panel">
          <h3>Product List</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((row) => {
                  const category = categories.find((item) => item.categoryID === row.categoryID);
                  const image = firstImageByProductID.get(Number(row.productID));
                  return (
                    <tr key={row.productID}>
                      <td>{row.productID}</td>
                      <td>{row.productName}</td>
                      <td>{category?.categoryName || row.categoryID}</td>
                      <td>
                        {image?.imageURL ? (
                          <img
                            className="product-thumb"
                            src={image.imageURL}
                            alt={image.altText || row.productName || "Product image"}
                            loading="lazy"
                          />
                        ) : (
                          <span className="thumb-empty">-</span>
                        )}
                      </td>
                      <td>{Number(row.price).toFixed(2)}</td>
                      <td>{row.stockQuantity}</td>
                      <td className="row-actions">
                        <button
                          className="icon-btn"
                          type="button"
                          title="Edit Product"
                          onClick={() => {
                            setProductForm({
                              productID: row.productID,
                              categoryID: String(row.categoryID),
                              productName: row.productName || "",
                              description: row.description || "",
                              price: row.price || "",
                              stockQuantity: row.stockQuantity ?? "",
                              imageID: image?.imageID || null,
                              imageURL: image?.imageURL || "",
                              imageAltText: image?.altText || "",
                              imageDisplayOrder: image?.displayOrder ?? 0
                            });
                            setSelectedDetailsProductID(String(row.productID));
                            setDetailForm((old) => ({ ...old, productID: String(row.productID) }));
                            setProductImageFile(null);
                            if (productImageInputRef.current) {
                              productImageInputRef.current.value = "";
                            }
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="icon-btn danger"
                          type="button"
                          title="Delete Product"
                          onClick={() => onDeleteProduct(row.productID)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <article className="panel">
        <h3>Product Detail Data</h3>
        <form className="detail-toolbar" onSubmit={onSaveProductDetail}>
          <label>
            Product
            <select
              value={detailForm.productID}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedDetailsProductID(value);
                setDetailForm((old) => ({ ...old, productID: value }));
              }}
              required
            >
              <option value="">Choose product</option>
              {products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.productName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Crop
            <input
              value={detailForm.crop}
              onChange={(event) => setDetailForm((old) => ({ ...old, crop: event.target.value }))}
              required
            />
          </label>
          <label>
            Pest
            <input
              value={detailForm.pest}
              onChange={(event) => setDetailForm((old) => ({ ...old, pest: event.target.value }))}
              required
            />
          </label>
          <label>
            Dosage
            <input
              value={detailForm.dosage}
              onChange={(event) =>
                setDetailForm((old) => ({ ...old, dosage: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Application Method
            <input
              value={detailForm.applicationMethod}
              onChange={(event) =>
                setDetailForm((old) => ({ ...old, applicationMethod: event.target.value }))
              }
              required
            />
          </label>
          <div className="actions">
            <button className="btn primary" type="submit" title="Save Product Detail">
              {detailForm.detailID ? <Save size={16} /> : <Plus size={16} />}
              <span>{detailForm.detailID ? "Update" : "Add Row"}</span>
            </button>
            <button
              className="btn"
              type="button"
              onClick={resetDetailForm}
              title="Reset Product Detail Form"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Crop</th>
                <th>Pest</th>
                <th>Dosage</th>
                <th>Application Method</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedDetailsProductID && filteredProductDetails.length === 0 ? (
                <tr>
                  <td colSpan="7" className="muted-cell">
                    No product detail rows for this product yet.
                  </td>
                </tr>
              ) : null}

              {!selectedDetailsProductID ? (
                <tr>
                  <td colSpan="7" className="muted-cell">
                    Choose a product to manage detail rows.
                  </td>
                </tr>
              ) : null}

              {filteredProductDetails.map((row) => (
                <tr key={row.detailID}>
                  <td>{row.detailID}</td>
                  <td>{row.crop}</td>
                  <td>{row.pest}</td>
                  <td>{row.dosage}</td>
                  <td>{row.applicationMethod}</td>
                  <td>{formatDate(row.updatedAt)}</td>
                  <td className="row-actions">
                    <button
                      className="icon-btn"
                      type="button"
                      title="Edit Product Detail"
                      onClick={() => {
                        setSelectedDetailsProductID(String(row.productID));
                        setDetailForm({
                          detailID: row.detailID,
                          productID: String(row.productID),
                          crop: row.crop || "",
                          pest: row.pest || "",
                          dosage: row.dosage || "",
                          applicationMethod: row.applicationMethod || ""
                        });
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="icon-btn danger"
                      type="button"
                      title="Delete Product Detail"
                      onClick={() => onDeleteProductDetail(row.detailID)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default Products;
