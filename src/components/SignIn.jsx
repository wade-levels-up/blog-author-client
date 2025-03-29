import React from "react";
import styled from "styled-components";
import { useState } from "react";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 100%;
  align-items: left;
  gap: 20px;

  & ul {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  & ul li {
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }

  & ul button {
    width: 100%;
  }

  & .passwordInputContainer{
    display: flex;
    align-items: center;
    position: relative;
    width: 200px;
  }

  & input {
    width: 200px;
  }

  & input[id="password"] {
    width: 100%
  }

  & button[title="Toggle Password Visibility"] {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 26px;
    border: none;
    background-color: white;
  }

  @media (min-width: 1100px) {
    flex-direction: row;
    align-items: center;

    & ul {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    }
  }
`;

const SignIn = ({
  signInStatus,
  usernameData,
  viewSignUp,
  setLocalStorage,
  logOut,
  logIn,
  updateViewingPost,
  toggleCreatingPost,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  async function handleSubmitLogin(event) {
    event.preventDefault();

    const response = await fetch(`https://blog-proxy-production.up.railway.app/app/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setLocalStorage("token", data.token);

      const userResponse = await fetch(
        `https://blog-proxy-production.up.railway.app/app/users/${username}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const userData = await userResponse.json();
      if (!userData.user.isAuthor) {
        localStorage.clear("token");
        throw new Error("Login failed - Not an author");
      }
      setLocalStorage("user", userData.user);
      setError("");

      logIn(userData.user.username);
    } else {
      const errorData = await response.json();
      setError(`Login failed: ${errorData.message}`);
      console.error(`Login failed: ${errorData.message}`);
    }
  }

  async function handleSubmitSignUp(event) {
    event.preventDefault();
    const isAuthor = "true";

    const response = await fetch(`https://blog-proxy-production.up.railway.app/app/users`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, password, email, isAuthor }),
    });

    if (response.ok) {
      setError("");
      logOut();
    } else {
      const errorData = await response.json();
      setError(`Sign-Up failed: ${errorData.message}`);
      console.error(`Sign-Up failed: ${errorData.message}`);
    }
  }

  function togglePasswordVisibility() {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  }

  if (signInStatus === "logged in") {
    return (
      <StyledSection>
        <h2>Hi {usernameData}</h2>
        <button
          title="View All Posts"
          onClick={() => {
            updateViewingPost(null);
            toggleCreatingPost(false);
          }}
        >
          <i className="fa-solid fa-eye"></i> All Posts
        </button>
        <button
          onClick={() => {
            updateViewingPost(null);
            toggleCreatingPost();
          }}
          title="Create New Post"
        >
          <i className="fa-solid fa-square-plus"></i> Create Post
        </button>
        <button
          onClick={() => {
            setUsername("");
            setPassword("");
            logOut();
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i> Log Out
        </button>
      </StyledSection>
    );
  } else if (signInStatus === "signing up") {
    return (
      <StyledSection>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmitSignUp}>
          <ul>
            <li>
              <label htmlFor="username">Username </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={30}
              />
            </li>
            <li>
              <label htmlFor="password">Password </label>
              <div className="passwordInputContainer">
                <input
                  type={passwordType}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  title="Toggle Password Visibility"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePasswordVisibility();
                  }}
                >
                  {passwordType === "password" ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
            </li>
            <li>
              <label htmlFor="email">Email </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </li>
            <li>
              <button type="submit">Submit</button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setError("");
                  logOut();
                }}
              >
                Back
              </button>
            </li>
          </ul>
        </form>
        {error ? <p>{error}</p> : <p></p>}
      </StyledSection>
    );
  } else {
    return (
      <StyledSection>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmitLogin}>
          <ul>
            <li>
              <label htmlFor="username">Username </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </li>
            <li>
              <label htmlFor="password">Password </label>
              <div className="passwordInputContainer">
                <input
                  type={passwordType}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  title="Toggle Password Visibility"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePasswordVisibility();
                  }}
                >
                  {passwordType === "password" ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
            </li>
            <li>
              <button type="submit">Submit</button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  viewSignUp();
                }}
              >
                Sign Up
              </button>
            </li>
          </ul>
        </form>
        {error ? <p>{error}</p> : <p></p>}
      </StyledSection>
    );
  }
};

export default SignIn;
