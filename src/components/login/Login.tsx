
import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constants";
import langContextObj from "../../store/langContext";
import LoginContext from "../../store/loginContext";
import Button from "../UI/button/Button";
import Input from "../UI/input/Input";
import classes from "./Login.module.scss";

function LoginBox() {
  const loginCtx = useContext(LoginContext);
  const langCtx = useContext(langContextObj);
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errorMessageRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  async function loginHandler(e: React.FormEvent) {
    e.preventDefault();
  
    const username = userNameRef.current?.value;
    const password = passwordRef.current?.value;
  
    if (!username || !password) {
      showError("Username and password are required");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await fetch("http://localhost:9000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (!response.ok) {
        showError(data.message || "Invalid credentials");
        return;
      }
  
      // ✅ Check and save token
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        console.log("✅ Token saved to localStorage:", data.token);
  
        loginCtx.toggleLogin(); // Update login context
        navigate("/"); // Redirect to homepage
      } else {
        console.error("❌ No token in API response!");
        showError("Login failed: No token received.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      showError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
  
  

  function showError(message: string) {
    if (errorMessageRef.current) {
      errorMessageRef.current.textContent = message;
      errorMessageRef.current.style.display = "inline-block";
      errorMessageRef.current.style.opacity = "1";
    }
    userNameRef.current?.focus();
  }

  return (
    <div
      className={`${classes.container} ${
        langCtx.lang === "fa" ? classes.rtl : ""
      }`}
    >
      <div className={classes.loginBox}>
        <div className={classes.logo}>
          <img src={images.logo} alt="digikala" />
        </div>
        <h2 className={classes.title}>{t("loginPage")}</h2>
        <form onSubmit={loginHandler} style={{ position: "relative" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                zIndex: 1,
              }}
            />
          )}
          <Input
            ref={userNameRef}
            type="text"
            id="userName"
            placeholder="Username"
          />
          <Input
            ref={passwordRef}
            type="password"
            id="pass"
            placeholder="Password"
          />
          <span ref={errorMessageRef} className={classes.errorMessage}>
            {t("errorMessage")}
          </span>
          <Button type="submit">
            {loading ? t("loading") : t("login")}
          </Button>
          <Link className={classes.forgat_pass} to="/">
            {t("forgetPass")}
          </Link>
          <div className={classes.checkbox}>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">{t("rememberMe")}</label>
          </div>
        </form>
      </div>

      <div className={classes.keyPic}>
        <img
          src={require("../../assets/images/Revenue-cuate.svg").default}
          alt="illustrator key"
        />
      </div>
    </div>
  );
}

export default LoginBox;
