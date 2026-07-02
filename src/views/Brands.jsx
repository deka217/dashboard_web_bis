import { Pencil, Plus, Save, Trash2 } from "lucide-react";

function Brands({
  brandForm,
  setBrandForm,
  brandLogoFile,
  setBrandLogoFile,
  brandLogoInputRef,
  brands,
  onSaveBrand,
  onDeleteBrand,
  resetBrandForm,
  formatDate
}) {
  return (
    <section className="stack">
      <form className="panel form-grid" onSubmit={onSaveBrand}>
        <h3>{brandForm.brandID ? "Edit Brand" : "Add Brand"}</h3>
        <label>
          Brand Name
          <input
            value={brandForm.brandName}
            onChange={(event) =>
              setBrandForm((old) => ({ ...old, brandName: event.target.value }))
            }
            required
          />
        </label>
        <label>
          Logo Brand URL
          <input
            value={brandForm.logoBrand}
            onChange={(event) =>
              setBrandForm((old) => ({ ...old, logoBrand: event.target.value }))
            }
            placeholder="https://example.com/brand-logo.png"
          />
        </label>
        <label>
          Upload Logo Brand
          <input
            ref={brandLogoInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setBrandLogoFile(file);
            }}
          />
        </label>
        {brandLogoFile ? <p className="file-note">Selected file: {brandLogoFile.name}</p> : null}
        {brandForm.logoBrand ? (
          <div className="brand-preview">
            <img className="brand-logo" src={brandForm.logoBrand} alt={brandForm.brandName || "Brand logo"} />
          </div>
        ) : null}
        <div className="actions">
          <button className="btn primary" type="submit" title="Save Brand">
            {brandForm.brandID ? <Save size={16} /> : <Plus size={16} />}
            <span>{brandForm.brandID ? "Update" : "Create"}</span>
          </button>
          <button className="btn" type="button" onClick={resetBrandForm} title="Reset Form">
            Reset
          </button>
        </div>
      </form>

      <article className="panel">
        <h3>Brand List</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Logo</th>
                <th>Name</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {brands.map((row) => (
                <tr key={row.brandID}>
                  <td>{row.brandID}</td>
                  <td>
                    {row.logoBrand ? (
                      <img
                        className="brand-logo"
                        src={row.logoBrand}
                        alt={row.brandName || "Brand logo"}
                        loading="lazy"
                      />
                    ) : (
                      <span className="thumb-empty">-</span>
                    )}
                  </td>
                  <td>{row.brandName}</td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td className="row-actions">
                    <button
                      className="icon-btn"
                      type="button"
                      title="Edit Brand"
                      onClick={() => {
                        setBrandForm({
                          brandID: row.brandID,
                          brandName: row.brandName || "",
                          logoBrand: row.logoBrand || ""
                        });
                        setBrandLogoFile(null);
                        if (brandLogoInputRef.current) {
                          brandLogoInputRef.current.value = "";
                        }
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="icon-btn danger"
                      type="button"
                      title="Delete Brand"
                      onClick={() => onDeleteBrand(row.brandID)}
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

export default Brands;
