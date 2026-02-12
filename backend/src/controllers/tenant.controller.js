const pool = require("../config/db");

exports.getAll = async (req, res) => {
  const result = await pool.query("SELECT * FROM tenants ORDER BY id DESC");
  res.json(result.rows);
};

exports.getOne = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM tenants WHERE id=$1",
    [id]
  );

  res.json(result.rows[0]);
};

exports.create = async (req, res) => {
  const { name, email, phone } = req.body;

  await pool.query(
    "INSERT INTO tenants(name,email,phone) VALUES($1,$2,$3)",
    [name, email, phone]
  );

  res.json({ message: "Tenant created" });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  await pool.query(
    "UPDATE tenants SET name=$1,email=$2,phone=$3 WHERE id=$4",
    [name, email, phone, id]
  );

  res.json({ message: "Tenant updated" });
};

exports.remove = async (req, res) => {
  await pool.query("DELETE FROM tenants WHERE id=$1", [req.params.id]);
  res.json({ message: "Tenant deleted" });
};
