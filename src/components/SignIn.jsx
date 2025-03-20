import React from "react";
import styled from "styled-components";
import { useState } from "react"

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
`

const SignIn = ({signInStatus, usernameData, viewSignUp, setLocalStorage, logOut, logIn, updateViewingPost}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    async function handleSubmitLogin(event) {
        event.preventDefault();

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ username, password}),
        });

        if (response.ok) {

            const data = await response.json();
            setLocalStorage("token", data.token);

            const userResponse = await fetch(`http://localhost:3000/users/${username}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${data.token}`
                }
            });

            const userData = await userResponse.json();
            if (!userData.user.isAuthor) {
                localStorage.clear("token")
                throw new Error("Login failed - Not an author")
            }
            setLocalStorage("user", userData.user);

            logIn(userData.user.username);
        } else {
            console.error("Login failed");
        }
    }

    async function handleSubmitSignUp(event) {
        event.preventDefault();
        const isAuthor = 'true';

        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ username, password, email, isAuthor }),
        });

        if (response.ok) {
            logOut();
        } else {
            console.error("Login failed");
        }
    }

    if (signInStatus === 'logged in') {
        return (
            <StyledSection>
                <h2>Hi {usernameData}</h2>
                <button title="View All Posts" onClick={() => updateViewingPost(null)}><i className="fa-solid fa-eye"></i> All Posts</button>
                <button onClick={logOut}><i className="fa-solid fa-right-from-bracket"></i> Log Out</button>
            </StyledSection>
        );
    } else if (signInStatus === 'signing up') {
        return (
            <StyledSection>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmitSignUp}>
                    <ul>
                        <li>
                            <label htmlFor="username">Username </label> 
                            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </li>
                        <li>
                            <label htmlFor="password">Password </label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </li>
                        <li>
                            <label htmlFor="email">Email </label>
                            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </li>
                        <li>
                            <button type="submit">Submit</button>
                        </li>
                        <li>
                            <button onClick={logOut}>Back</button>
                        </li>
                    </ul>
                </form>
            </StyledSection>
        )
    } else {
        return (
            <StyledSection>
                <h2>Sign In</h2>
                <form onSubmit={handleSubmitLogin}>
                    <ul>
                        <li>
                            <label htmlFor="username">Username </label> 
                            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </li>
                        <li>
                            <label htmlFor="password">Password </label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </li>
                        <li>
                            <button type="submit">Submit</button>
                        </li>
                        <li>
                            <button onClick={viewSignUp}>Sign Up</button>
                        </li>
                    </ul>
                </form>
                <button title="View All Posts" onClick={() => updateViewingPost(null)}><i className="fa-solid fa-eye"></i> All Posts</button>
            </StyledSection>
        );
    }
}

export default SignIn;