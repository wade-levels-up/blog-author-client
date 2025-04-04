import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import SignIn from "./components/SignIn";
import MainView from "./components/MainView";

// Styled Components

const StyledLoader = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding-top: 32px;
  width: 100%;
`;

const StyledHeader = styled.header`
  padding: 20px;

  & h1 {
    font-family: "Big Shoulders Stencil";
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: 25px;
    width: 100%;
  }

  & i {
    display: none;
  }

  @media (min-width: 450px) {
    & i {
      display: inline-block;
    }
  }
`;

const StyledFooter = styled.footer`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: 12px;
`;

function App() {
  const [username, setUsername] = useState("");
  const [signInStatus, setSignInStatus] = useState("logged out");
  const [viewingPost, setViewingPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateViewingPost(post) {
    setViewingPost(post);
  }

  function toggleCreatingPost(state) {
    if (state === false) {
      setCreatingPost(false);
    } else if (state === true) {
      setCreatingPost(true);
    } else {
      setCreatingPost(!creatingPost);
    }
  }

  function setLocalStorage(key, value) {
    if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCreatingPost(false);
    setViewingPost(null);
    setUsername("");
    setSignInStatus("logged out");
    setPosts([]);
  }

  function logIn(usernameData) {
    setUsername(usernameData);
    setSignInStatus("logged in");
    getPosts(usernameData);
  }

  function viewSignUp() {
    setSignInStatus("signing up");
  }

  async function getPosts(username) {
    setLoading(true);
    const token = localStorage.getItem("token");
    await fetch(`https://blog-proxy-production.up.railway.app/app/users/${username}/posts`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          const error = new Error("Server Error");
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then((data) => {
        setPosts([...data.posts]);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });
  }

  function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error(error);
      return true;
    }
  }

  useEffect(() => {
    const usernameData = localStorage.getItem("user");
    const tokenData = localStorage.getItem("token");

    if (tokenData && isTokenExpired(tokenData)) {
      logOut();
    } else {
      if (tokenData) {
        setSignInStatus("logged in");
      }
      if (usernameData) {
        const parsedUsernameData = JSON.parse(usernameData);
        setUsername(parsedUsernameData.username);

        getPosts(parsedUsernameData.username);
      }
    }
  }, []);

  return (
    <>
      <StyledHeader>
        <h1>
          Co.Blog<i className="fa-solid fa-pencil"></i>
        </h1>
        <h2>Author Client</h2>
      </StyledHeader>
      <hr />
      <SignIn
        usernameData={username}
        setLocalStorage={setLocalStorage}
        viewSignUp={viewSignUp}
        signInStatus={signInStatus}
        logOut={logOut}
        logIn={logIn}
        updateViewingPost={updateViewingPost}
        toggleCreatingPost={toggleCreatingPost}
      />
      {loading ? (
        <StyledLoader id="loading">
          <i className="fa-solid fa-spinner fa-spin-pulse fa-2xl"></i>
          <p>Loading Posts...</p>
        </StyledLoader>
      ) : (
        <MainView
          username={username}
          posts={posts}
          viewingPost={viewingPost}
          updateViewingPost={updateViewingPost}
          getPosts={getPosts}
          creatingPost={creatingPost}
          toggleCreatingPost={toggleCreatingPost}
        />
      )}
      <StyledFooter>Made by Wade</StyledFooter>
    </>
  );
}

export default App;
