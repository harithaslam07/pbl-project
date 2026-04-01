import { useEffect, useState } from "react";
import { activityApi } from "../api/services";

const empty = { type: "transportation", value: "", date: "" };

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = () => activityApi.list().then((res) => setActivities(res.data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, value: Number(form.value) };

    if (editId) {
      await activityApi.update(editId, payload);
      setEditId(null);
    } else {
      await activityApi.create(payload);
    }

    setForm(empty);
    load();
  };

  const onEdit = (a) => {
    setEditId(a.id);
    setForm({ type: a.type, value: a.value, date: a.activity_date?.slice(0, 10) });
  };

  const onDelete = async (id) => {
    await activityApi.remove(id);
    load();
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>{editId ? "Edit Activity" : "Add Activity"}</h2>
        <form className="form-grid" onSubmit={submit}>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="transportation">Transportation (km)</option>
            <option value="electricity">Electricity (kWh)</option>
            <option value="paper">Paper (pages)</option>
            <option value="device">Device usage (hours)</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Value"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <button type="submit">{editId ? "Update" : "Add"}</button>
        </form>
      </section>

      <section className="card">
        <h2>Activity History</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Value</th>
                <th>Emission (kg CO2)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id}>
                  <td>{a.activity_date?.slice(0, 10)}</td>
                  <td>{a.type}</td>
                  <td>{a.value}</td>
                  <td>{Number(a.emission).toFixed(3)}</td>
                  <td className="row">
                    <button onClick={() => onEdit(a)}>Edit</button>
                    <button className="danger" onClick={() => onDelete(a.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
