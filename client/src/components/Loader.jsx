import "../styles/loader.css";

// Simple CSS spinner
function Loader({ label = "Loading..." }) {
  return (
    <div className="loader">
      <div className="loader-spinner" />
      <div className="loader-label">{label}</div>
    </div>
  );
}

export default Loader;
