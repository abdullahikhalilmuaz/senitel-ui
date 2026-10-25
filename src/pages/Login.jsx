import { useState } from "react";
import Button from "../components/UI/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      addToast("Authentication successful. Welcome back.", "success");
      navigate("/dashboard");
    } else {
      addToast(result.message, "error");
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-glass"
      style={{ padding: "40px" }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "8px",
          letterSpacing: "-0.5px",
        }}
      >
        Welcome Back
      </h2>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "15px",
          marginBottom: "32px",
        }}
      >
        Sign in to your account to continue
      </p>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              marginBottom: "10px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <label
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Password
            </label>
            <a
              href="#"
              style={{
                fontSize: "13px",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              Forgot?
            </a>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          style={{ marginTop: "8px" }}
        >
          Sign In
        </Button>
      </form>
    </motion.div>
  );
};

export default Login;
