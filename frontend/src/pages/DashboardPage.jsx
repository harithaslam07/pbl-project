import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { dashboardApi } from "../api/services";

const colors = ["#118ab2", "#06d6a0", "#ef476f", "#ffd166"];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await dashboardApi.me();
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const intervalId = setInterval(load, 30000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (loading && !data) {
    return <p>Loading dashboard...</p>;
  }

  if (error && !data) {
    return (
      <div className="card">
        <p className="error">{error}</p>
        <button onClick={load}>Retry</button>
      </div>
    );
  }

  const monthlySeries = data?.monthlySeries || [];
  const byType = data?.byType || [];
  const suggestions = data?.suggestions || [];

  return (
    <div className="stack">
      <section className="card">
        <div className="row">
          <h2>Total Emissions</h2>
          <button onClick={load}>Refresh</button>
        </div>
        {error && <p className="error">{error}</p>}
        <p className="metric">{Number(data.totalEmission).toFixed(3)} kg CO2</p>
      </section>

      <section className="grid-2">
        <div className="card chart-card">
          <h3>Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="emission" fill="#118ab2" />
            </BarChart>
          </ResponsiveContainer>
          {!monthlySeries.length && <p>No monthly activity data yet.</p>}
        </div>

        <div className="card chart-card">
          <h3>By Activity Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byType} dataKey="emission" nameKey="type" outerRadius={90} label>
                {byType.map((entry, idx) => (
                  <Cell key={entry.type} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {!byType.length && <p>No activity type data yet.</p>}
        </div>
      </section>

      <section className="card">
        <h3>Reduction Suggestions</h3>
        {suggestions.length ? (
          <ul>
            {suggestions.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p>No suggestions available yet.</p>
        )}
      </section>
    </div>
  );
}
