import { Pencil, Plus, Save, Trash2 } from "lucide-react";

function Categories({
  categoryForm,
  setCategoryForm,
  categories,
  onSaveCategory,
  onDeleteCategory,
  emptyCategoryForm,
  formatDate
}) {
  return (
    <section className="stack">
      <form className="panel form-grid" onSubmit={onSaveCategory}>
        <h3>{categoryForm.categoryID ? "Edit Category" : "Add Category"}</h3>
        <label>
          Category Name
          <input
            value={categoryForm.categoryName}
            onChange={(event) =>
              setCategoryForm((old) => ({ ...old, categoryName: event.target.value }))
            }
            required
          />
        </label>
        <label>
          Description
          <textarea
            rows="3"
            value={categoryForm.description}
            onChange={(event) =>
              setCategoryForm((old) => ({ ...old, description: event.target.value }))
            }
          />
        </label>
        <div className="actions">
          <button className="btn primary" type="submit" title="Save Category">
            {categoryForm.categoryID ? <Save size={16} /> : <Plus size={16} />}
            <span>{categoryForm.categoryID ? "Update" : "Create"}</span>
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => setCategoryForm(emptyCategoryForm)}
            title="Reset Form"
          >
            Reset
          </button>
        </div>
      </form>

      <article className="panel">
        <h3>Category List</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <tr key={row.categoryID}>
                  <td>{row.categoryID}</td>
                  <td>{row.categoryName}</td>
                  <td>{row.description || "-"}</td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td className="row-actions">
                    <button
                      className="icon-btn"
                      type="button"
                      title="Edit Category"
                      onClick={() =>
                        setCategoryForm({
                          categoryID: row.categoryID,
                          categoryName: row.categoryName || "",
                          description: row.description || ""
                        })
                      }
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="icon-btn danger"
                      type="button"
                      title="Delete Category"
                      onClick={() => onDeleteCategory(row.categoryID)}
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

export default Categories;
