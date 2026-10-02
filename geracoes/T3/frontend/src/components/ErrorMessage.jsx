export default function ErrorMessage({ children }) {
  return children ? <p className="error">{children}</p> : null;
}
