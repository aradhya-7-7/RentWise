import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <Link className="text-blue-600 underline" to="/login">
        Go to Login
      </Link>
    </div>
  )
}
