import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthPage = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = type === "signup" ? "/api/auth/signup" : "/api/auth/login";
    const body = type === "signup" ? { name, email, password } : { email, password };

    try {
      const response = await fetch("http://localhost:5000"+endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {type === "signup" ? "Sign Up" : "Login"}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 mb-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            {type === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};


AuthPage.propTypes = {
  type: PropTypes.string.isRequired, // Ensure 'type' is a required string
};

export default AuthPage;
