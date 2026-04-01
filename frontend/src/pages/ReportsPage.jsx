import { useEffect, useMemo, useState } from "react";
import { reportApi } from "../api/services";

const now = new Date();

export default function ReportsPage() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);

  const params = useMemo(() => ({ month, year }), [month, year]);

  useEffect(() => {
    reportApi.monthly(params).then((res) => setReport(res.data));
  }, [params]);

  const csvHref = reportApi.csvUrl(params);
  const pdfHref = reportApi.pdfUrl(params);
  const token = localStorage.getItem("token");

  return (
    <div className="stack">
      <section className="card form-grid">
        <h2>Monthly Report</h2>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }).map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {idx + 1}
            </option>
          ))}
        </select>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </section>

      {report && (
        <section className="card">
          <p>Total activities: {report.summary.total_activities}</p>
          <p>Total emission: {Number(report.summary.total_emission).toFixed(3)} kg CO2</p>
          <p>Average emission: {Number(report.summary.avg_emission).toFixed(3)} kg CO2</p>
          <div className="row">
            <a className="btn-link" href={`${csvHref}`} target="_blank" rel="noreferrer" onClick={(e) => {
              e.preventDefault();
              fetch(csvHref, { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `report-${month}-${year}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                });
            }}>Download CSV</a>
            <a className="btn-link" href={`${pdfHref}`} target="_blank" rel="noreferrer" onClick={(e) => {
              e.preventDefault();
              fetch(pdfHref, { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `report-${month}-${year}.pdf`;
                  link.click();
                  URL.revokeObjectURL(url);
                });
            }}>Download PDF</a>
          </div>
        </section>
      )}
    </div>
  );
}
