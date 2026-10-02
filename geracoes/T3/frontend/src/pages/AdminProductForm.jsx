import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import AdminLayout from "../components/AdminLayout.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { slugify } from "../utils/slug.js";

const EMPTY_PRODUCT = { name: "", slug: "", shortDescription: "", description: "", price: "", imageUrl: "", active: true };


export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loaded = useAsync(() => (id ? api.adminGetProduct(id) : Promise.resolve(EMPTY_PRODUCT)), [id]);
  const product = loaded.data;
  const setProduct = loaded.setData;
  const [slugEdited, setSlugEdited] = useState(Boolean(id));
  const [error, setError] = useState("");

  const handleFieldChange = (field) => (e) => setProduct((prev) => ({ ...prev, [field]: e.target.value }));

  function changeName(e) {
    const name = e.target.value;
    setProduct((prev) => {
      const next = { ...prev, name };
      if (!slugEdited) next.slug = slugify(name);
      return next;
    });
  }

  function handleSlugChange(e) {
    setSlugEdited(true);
    handleFieldChange("slug")(e);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await (id ? api.adminUpdateProduct(id, product) : api.adminCreateProduct(product));
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  const title = id ? "Editar produto" : "Novo produto";
  if (loaded.loading) return <AdminLayout title={title}><p>Carregando...</p></AdminLayout>;
  if (loaded.error) return <AdminLayout title={title}><ErrorMessage>{loaded.error.message}</ErrorMessage></AdminLayout>;

  return (
    <AdminLayout title={title}>
      <form onSubmit={submit}>
        <label>
          Nome
          <input data-testid="product-name" value={product.name} onChange={changeName} required />
        </label>
        <label>
          Slug
          <input data-testid="product-slug" value={product.slug} onChange={handleSlugChange} required />
        </label>
        <label>
          Descrição curta
          <input data-testid="product-short-description" value={product.shortDescription} onChange={handleFieldChange("shortDescription")} />
        </label>
        <label>
          Descrição completa
          <textarea data-testid="product-description" rows="5" value={product.description} onChange={handleFieldChange("description")} />
        </label>
        <label>
          Preço
          <input data-testid="product-price" value={product.price} onChange={handleFieldChange("price")} />
        </label>
        <label>
          URL da imagem
          <input data-testid="product-image-url" value={product.imageUrl} onChange={handleFieldChange("imageUrl")} />
        </label>
        <label className="checkbox">
          <input
            data-testid="product-active"
            type="checkbox"
            checked={product.active}
            onChange={(e) => setProduct((prev) => ({ ...prev, active: e.target.checked }))}
          />
          Ativo
        </label>
        <ErrorMessage>{error}</ErrorMessage>
        <button data-testid="product-save" type="submit">Salvar</button>
      </form>
    </AdminLayout>
  );
}
