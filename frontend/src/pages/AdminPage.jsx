import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { adminApi } from "../api/services";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [factors, setFactors] = useState([]);
  const [factorDrafts, setFactorDrafts] = useState({});

  const load = async () => {
    const [u, s, f] = await Promise.all([adminApi.users(), adminApi.stats(), adminApi.factors()]);
    setUsers(u.data);
    setStats(s.data);
    setFactors(f.data);
    setFactorDrafts(
      f.data.reduce((acc, item) => {
        acc[item.id] = item.factor;
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    load();
  }, []);

  const removeUser = async (id) => {
    await adminApi.deleteUser(id);
    load();
  };

  const updateFactor = async (activity_type, factor) => {
    await adminApi.updateFactor({ activity_type, factor: Number(factor) });
    load();
  };

  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "faculty");
  const admins = users.filter((u) => u.role === "admin");
  const roleChartData = [
    { role: "Students", emission: Number(stats?.roleEmission?.find((r) => r.role === "student")?.emission || 0) },
    { role: "Teachers", emission: Number(stats?.roleEmission?.find((r) => r.role === "faculty")?.emission || 0) },
    { role: "Admins", emission: Number(stats?.roleEmission?.find((r) => r.role === "admin")?.emission || 0) }
  ];
  const typeChartData = (stats?.byType || []).map((row) => ({
    type: row.type,
    emission: Number(row.emission)
  }));

  return (
    <div className="stack">
      <section className="card">
        <h2>Institution Stats</h2>
        {stats && (
          <div className="grid-3">
            <p>Students: {stats.totalStudents}</p>
            <p>Teachers: {stats.totalTeachers}</p>
            <p>Admins: {stats.totalAdmins}</p>
            <p>All Users: {stats.totalUsers}</p>
            <p>Activities: {stats.totalActivities}</p>
            <p>Total Emission: {Number(stats.totalEmissions).toFixed(3)} kg CO2</p>
          </div>
        )}
      </section>

      <section className="grid-2">
        <div className="card chart-card admin-chart-card">
          <h3>Emission by Role</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roleChartData} barCategoryGap={35}>
              <defs>
                <linearGradient id="roleBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9bb8" />
                  <stop offset="100%" stopColor="#0f6a89" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#d8e8ef" vertical={false} />
              <XAxis dataKey="role" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(3)} kg CO2`, "Emission"]} />
              <Bar dataKey="emission" fill="url(#roleBarGradient)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card admin-chart-card">
          <h3>Emission by Activity Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={typeChartData} barCategoryGap={18}>
              <defs>
                <linearGradient id="typeBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#20b98a" />
                  <stop offset="100%" stopColor="#128f6b" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#d8e8ef" vertical={false} />
              <XAxis dataKey="type" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(3)} kg CO2`, "Emission"]} />
              <Bar dataKey="emission" fill="url(#typeBarGradient)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>Students</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Activities</th>
                <th>Total Emission</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.activityCount}</td>
                  <td>{Number(u.totalEmission).toFixed(3)} kg CO2</td>
                  <td>
                    <button className="danger" onClick={() => removeUser(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Teachers</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Activities</th>
                <th>Total Emission</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.activityCount}</td>
                  <td>{Number(u.totalEmission).toFixed(3)} kg CO2</td>
                  <td>
                    <button className="danger" onClick={() => removeUser(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Admins</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Activities</th>
                <th>Total Emission</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.activityCount}</td>
                  <td>{Number(u.totalEmission).toFixed(3)} kg CO2</td>
                  <td>
                    <button className="danger" onClick={() => removeUser(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Emission Factors</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Activity Type</th>
                <th>Factor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {factors.map((f) => (
                <tr key={f.id}>
                  <td>{f.activity_type}</td>
                  <td>
                    <input
                      type="number"
                      step="0.0001"
                      value={factorDrafts[f.id] ?? ""}
                      onChange={(event) =>
                        setFactorDrafts((prev) => ({ ...prev, [f.id]: event.target.value }))
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => updateFactor(f.activity_type, factorDrafts[f.id])}>
                      Save
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
