const pool = require("../config/db");

exports.getAll = async(req,res)=>{
 const result = await pool.query("SELECT * FROM documents");
 res.json(result.rows);
};

exports.create = async(req,res)=>{
 const { lease_id, file_url } = req.body;

 await pool.query(
  "INSERT INTO documents(lease_id,file_url) VALUES($1,$2)",
  [lease_id,file_url]
 );

 res.json({message:"Document added"});
};
