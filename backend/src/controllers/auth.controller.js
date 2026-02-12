const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users(email,password) VALUES($1,$2)",
    [email, hash]
  );

  res.json({ message: "Registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length)
    return res.status(401).json({ message: "Invalid" });

  const valid = await bcrypt.compare(password, user.rows[0].password);

  if (!valid)
    return res.status(401).json({ message: "Invalid" });

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET
  );

  res.json({ token });
};
