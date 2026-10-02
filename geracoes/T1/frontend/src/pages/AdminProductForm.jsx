import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import AdminLayout from "../components/AdminLayout.jsx";

const EMPTY = { name: "", slug: "", shortDescription: "", description: "", price: "", imageUrl: "", active: true };

const slugify = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(EMPTY);
  const [slugEdited, setSlugEdited] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) api.adminGetProduct(id).then(setProduct).catch((err) => setError(err.message));
  }, [id]);

  const set = (field) => (e) => setProduct({ ...product, [field]: e.target.value });

  function changeName(e) {
    const name = e.target.value;
    setProduct({ ...product, name, ...(slugEdited ? {} : { slug: slugify(name) }) });
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

  return (
    <AdminLayout title={id ? "Editar produto" : "Novo produto"}>
      <form onSubmit={submit}>
        <label>
          Nome
          <input data-testid="product-name" value={product.name} onChange={changeName} required />
        </label>
        <label>
          Slug
          <input
            data-testid="product-slug"
            value={product.slug}
            onChange={(e) => {
              setSlugEdited(true);
              set("slug")(e);
            }}
            required
          />
        </label>
        <label>
          Descrição curta
          <input data-testid="product-short-description" value={product.shortDescription} onChange={set("shortDescription")} />
        </label>
        <label>
          Descrição completa
          <textarea data-testid="product-description" rows="5" value={product.description} onChange={set("description")} />
        </label>
        <label>
          Preço
          <input data-testid="product-price" value={product.price} onChange={set("price")} />
        </label>
        <label>
          URL da imagem
          <input data-testid="product-image-url" value={product.imageUrl} onChange={set("imageUrl")} />
        </label>
        <label className="checkbox">
          <input
            data-testid="product-active"
            type="checkbox"
            checked={product.active}
            onChange={(e) => setProduct({ ...product, active: e.target.checked })}
          />
          Ativo
        </label>
        {error && <p className="error">{error}</p>}
        <button data-testid="product-save" type="submit">Salvar</button>
      </form>
    </AdminLayout>
  );
}
