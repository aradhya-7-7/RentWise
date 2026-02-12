const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  const tenants = await pool.query("SELECT COUNT(*) FROM tenants");
  const properties = await pool.query("SELECT COUNT(*) FROM properties");

  res.json({
    tenants: tenants.rows[0].count,
    properties: properties.rows[0].count
  });
};
