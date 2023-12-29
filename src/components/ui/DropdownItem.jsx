export default function DropdownItem({ icon, handleSelect, id, value, first }) {
  return (
    <button
      className="option"
      onClick={() => handleSelect(value)}
      aria-label={`dropdown item ${id}`}
      type="button"
    >
      {first === "text" ? (
        <>
          <span>{value}</span>
          <span className="dropdown-icon">{icon()}</span>
        </>
      ) : (
        <>
          <span className="dropdown-icon">{icon()}</span>
          <span>{value}</span>
        </>
      )}
    </button>
  );
}
