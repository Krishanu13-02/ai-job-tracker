export default function Filters({ filters, setFilters }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <input
        placeholder="Role (e.g. React)"
        value={filters.role || ""}
        onChange={(e) =>
          setFilters((f) => ({ ...f, role: e.target.value }))
        }
      />

      <select
        value={filters.workMode || ""}
        onChange={(e) =>
          setFilters((f) => ({ ...f, workMode: e.target.value }))
        }
      >
        <option value="">Any</option>
        <option value="remote">Remote</option>
        <option value="onsite">Onsite</option>
      </select>

      <button onClick={() => setFilters({})}>Clear</button>
    </div>
  );
}
