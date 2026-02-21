const express = require("express")
const cors = require("cors")
const path = require("path")

const errorMiddleware = require("./middlewares/error.middleware")

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use(express.json())

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/dashboard", require("./routes/dashboard.routes"))
app.use("/api/tenants", require("./routes/tenant.routes"))
app.use("/api/properties", require("./routes/property.routes"))
app.use("/api/leases", require("./routes/lease.routes"))
app.use("/api/payments", require("./routes/payment.routes"))
app.use("/api/maintenance", require("./routes/maintenance.routes"))
app.use("/api/documents", require("./routes/document.routes"))

app.use(errorMiddleware)

module.exports = app