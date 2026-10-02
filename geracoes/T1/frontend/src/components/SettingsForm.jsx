import { useEffect, useState } from "react";
import { api } from "../api.js";

const FIELDS = [
  ["storeName", "Nome da loja"],
  ["headline", "Título principal"],
  ["subtitle", "Subtítulo"],
  ["whatsappNumber", "Número de WhatsApp"],
];

export default function SettingsForm() {
  const [values, setValues] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.adminGetSettings().then(setValues).catch((err) => setMessage(err.message));
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      setValues(await api.adminUpdateSettings(values));
      setMessage("Configurações salvas.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (!values) return <p>{message || "Carregando..."}</p>;

  return (
    <form onSubmit={submit}>
      {FIELDS.map(([key, label]) => (
        <label key={key}>
          {label}
          <input
            data-testid={`settings-${key}`}
            value={values[key] ?? ""}
            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
          />
        </label>
      ))}
      {message && <p>{message}</p>}
      <button data-testid="settings-save" type="submit">Salvar configurações</button>
    </form>
  );
}
