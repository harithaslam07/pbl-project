const dayjs = require("dayjs");
const PDFDocument = require("pdfkit");
const { createObjectCsvStringifier } = require("csv-writer");
const pool = require("../../config/db");

function monthRange(month, year) {
  const base = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
  return {
    start: base.startOf("month").format("YYYY-MM-DD"),
    end: base.endOf("month").format("YYYY-MM-DD")
  };
}

async function fetchMonthly(userId, month, year) {
  const { start, end } = monthRange(month, year);
  const [rows] = await pool.query(
    `SELECT id, type, value, emission, activity_date
     FROM activities
     WHERE user_id = ? AND activity_date BETWEEN ? AND ?
     ORDER BY activity_date ASC`,
    [userId, start, end]
  );

  const [summaryRows] = await pool.query(
    `SELECT COALESCE(SUM(emission), 0) AS total_emission,
            COALESCE(AVG(emission), 0) AS avg_emission,
            COUNT(*) AS total_activities
     FROM activities
     WHERE user_id = ? AND activity_date BETWEEN ? AND ?`,
    [userId, start, end]
  );

  return { rows, summary: summaryRows[0], start, end };
}

async function getMonthlyReport(req, res, next) {
  try {
    const now = dayjs();
    const month = Number(req.query.month || now.month() + 1);
    const year = Number(req.query.year || now.year());

    const data = await fetchMonthly(req.user.id, month, year);
    return res.json({ month, year, ...data });
  } catch (error) {
    return next(error);
  }
}

async function downloadCsv(req, res, next) {
  try {
    const now = dayjs();
    const month = Number(req.query.month || now.month() + 1);
    const year = Number(req.query.year || now.year());

    const data = await fetchMonthly(req.user.id, month, year);
    const csv = createObjectCsvStringifier({
      header: [
        { id: "id", title: "ID" },
        { id: "type", title: "TYPE" },
        { id: "value", title: "VALUE" },
        { id: "emission", title: "EMISSION" },
        { id: "activity_date", title: "DATE" }
      ]
    });

    const content = csv.getHeaderString() + csv.stringifyRecords(data.rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=report-${month}-${year}.csv`);
    return res.send(content);
  } catch (error) {
    return next(error);
  }
}

async function downloadPdf(req, res, next) {
  try {
    const now = dayjs();
    const month = Number(req.query.month || now.month() + 1);
    const year = Number(req.query.year || now.year());

    const data = await fetchMonthly(req.user.id, month, year);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=report-${month}-${year}.pdf`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(18).text("Academic Carbon Footprint Report", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${data.start} to ${data.end}`);
    doc.text(`Total Activities: ${data.summary.total_activities}`);
    doc.text(`Total Emission: ${Number(data.summary.total_emission).toFixed(3)} kg CO2`);
    doc.text(`Average Emission: ${Number(data.summary.avg_emission).toFixed(3)} kg CO2`);
    doc.moveDown();

    doc.fontSize(13).text("Activities");
    doc.moveDown(0.5);

    data.rows.forEach((row) => {
      doc
        .fontSize(10)
        .text(
          `${row.activity_date} | ${row.type} | value=${row.value} | emission=${Number(row.emission).toFixed(3)} kg CO2`
        );
    });

    doc.end();
  } catch (error) {
    return next(error);
  }
}

module.exports = { getMonthlyReport, downloadCsv, downloadPdf };
