const pool = require("../config/db");

exports.getAll = async(req,res)=>{
 const result = await pool.query("SELECT * FROM maintenance_requests");
 res.json(result.rows);
};

exports.create = async(req,res)=>{
 const { unit_id, issue, priority } = req.body;

 await pool.query(
  "INSERT INTO maintenance_requests(unit_id,issue,priority,status) VALUES($1,$2,$3,'open')",
  [unit_id,issue,priority]
 );

 res.json({message:"Maintenance created"});
};
