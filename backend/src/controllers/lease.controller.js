const pool = require("../config/db");

exports.create = async (req,res)=>{
 const { tenant_id, property_id, start_date, end_date, rent } = req.body;

 await pool.query(
   "INSERT INTO leases(tenant_id,property_id,start_date,end_date,rent) VALUES($1,$2,$3,$4,$5)",
   [tenant_id,property_id,start_date,end_date,rent]
 );

 res.json({message:"Lease created"});
};

exports.getAll = async(req,res)=>{
 const result = await pool.query("SELECT * FROM leases");
 res.json(result.rows);
};
