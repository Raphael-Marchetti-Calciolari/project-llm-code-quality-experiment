import { useState } from "react";
import { api } from "../api.js";
import { useAsync } from "../hooks/useAsync.js";
import ErrorMessage from "./ErrorMessage.jsx";

const SETTINGS_FIELDS = [
  ["storeName", "Nome da loja"],
  ["headline", "Título principal"],
  ["subtitle", "Subtítulo"],
  ["whatsappNumber", "Número de WhatsApp"],
];

export default function SettingsForm() {
  const settings = useAsync(api.adminGetSettings);
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      settings.setData(await api.adminUpdateSettings(settings.data));
      setMessage("Configurações salvas.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (settings.loading) return <p>Carregando...</p>;
  if (settings.error) return <p>{settings.error.message}</p>;
  const values = settings.data;

  return (
    <form onSubmit={submit}>
      {SETTINGS_FIELDS.map(([key, label]) => (
        <label key={key}>
          {label}
          <input
            data-testid={`settings-${key}`}
            value={values[key] ?? ""}
            onChange={(e) => settings.setData((prev) => ({ ...prev, [key]: e.target.value }))}
          />
        </label>
      ))}
      {message && <p>{message}</p>}
      <button data-testid="settings-save" type="submit">Salvar configurações</button>
    </form>
  );
}
