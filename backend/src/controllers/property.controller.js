const pool = require("../config/db");

exports.getAll = async (req,res)=>{
 const result = await pool.query("SELECT * FROM properties");
 res.json(result.rows);
};

exports.create = async (req,res)=>{
 const { name,address } = req.body;

 await pool.query(
  "INSERT INTO properties(name,address) VALUES($1,$2)",
  [name,address]
 );

 res.json({message:"Property created"});
};
