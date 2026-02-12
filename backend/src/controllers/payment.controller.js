const pool = require("../config/db");

exports.getAll = async (req,res)=>{
 const result = await pool.query("SELECT * FROM payments ORDER BY payment_date DESC");
 res.json(result.rows);
};

exports.create = async (req,res)=>{
 const { lease_id, amount, status, payment_date } = req.body;

 await pool.query(
  "INSERT INTO payments(lease_id,amount,status,payment_date) VALUES($1,$2,$3,$4)",
  [lease_id,amount,status,payment_date]
 );

 res.json({message:"Payment added"});
};
