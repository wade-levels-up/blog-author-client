import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BlogListItem from "./blogListItem";

const StyledMain = styled.main`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    align-items: center;
    padding: 12px;
    border-top: 2px ridge slategray;
    border-bottom: 2px ridge slategray;

    & h2 {
        font-size: 2rem;
    }

    & .blog-posts-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    & .blog-posts-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
    }

    & .post-menu {
        display: flex;
        padding: 3px;
        background-color: slategray;
        justify-content: space-between;
    }

    & .edit-menu {
        display: flex;
        width: 100%;
        justify-content: flex-end;
    }

    & .main-child-section {
        width: 100%;
        max-width: 55ch;
    }

    & input[id="title"] {
        font-size: 2rem;
    }

    & textarea {
        width: 100%;
        line-height: 1.3rem;
        padding: 3px;
        resize: vertical;
    }

    @media (min-width: 850px) {
        & h2 {
            font-size: 2.5rem;
        }

        & .blog-posts-list {
            display: grid;
            grid-template-columns: repeat( auto-fit, minmax(450px, 1fr));
        }
    }
`

const MainView = ({ posts, viewingPost, updateViewingPost, getPosts}) => {
    const [editingPost, setEditingPost] = useState(false);
    const [title, setTitle] = useState(viewingPost ? viewingPost.title : "");
    const [summary, setSummary] = useState(viewingPost ? viewingPost.summary : "");
    const [content, setContent] = useState(viewingPost ? viewingPost.content : "");

    useEffect(() => {
        if (viewingPost) {
            setTitle(viewingPost.title);
            setSummary(viewingPost.summary);
            setContent(viewingPost.content);
        }
    }, [viewingPost]);

    async function handleSavePost(event) {
        event.preventDefault();

        const token = localStorage.getItem("token")
        const usernameData = localStorage.getItem("user")
        const published = viewingPost.published;
        if (usernameData) {
            const parsedUsernameData = JSON.parse(usernameData);
            await fetch(`http://localhost:3000/users/${parsedUsernameData.username}/posts/${viewingPost.id}`, {
                mode: 'cors',
                method: "PUT",
                headers: {
                    "Content-type": 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title, summary, content, published })
            }).then(() => {
                setEditingPost(false);
                getPosts(parsedUsernameData.username);
                updateViewingPost(null)
            }).catch(error => console.error(error.message));
        }
    }

    return (
        <StyledMain>
            {viewingPost ? (
                editingPost ? (
                    <>
                    <form onSubmit={handleSavePost} className="main-child-section">
                    <div className="edit-menu">
                        <button type="submit"><i className="fa-solid fa-floppy-disk"></i> Save</button>
                        <button onClick={() => setEditingPost(!editingPost)}><i className="fa-solid fa-xmark"></i> Cancel</button>
                    </div>
                        <label hidden htmlFor="title"></label>
                        <input type="text" id="title" name="title" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>
                        <h3>Summary</h3>
                        <label hidden htmlFor="summary"></label>
                        <textarea id="summary" name="summary" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)}/>
                        <span className="post-menu" ><div>By {viewingPost.author}</div></span>
                        <h3>Content</h3>
                        <label hidden htmlFor="content"></label>
                        <textarea id="content" name="content" rows={3} value={content} onChange={(e) => setContent(e.target.value)}/>
                   </form>
                   <hr />
                   </>       
                ) : (
                    <>
                    <section className="main-child-section">
                    <div className="edit-menu"><button onClick={() => setEditingPost(!editingPost)}><i className="fa-solid fa-pencil"></i> Edit</button></div>
                       <h2>{viewingPost.title}</h2>
                       <h3>Summary</h3>
                       <p>{viewingPost.summary}</p>
                       <span className="post-menu" ><div>By {viewingPost.author}</div></span>
                       <h3>Content</h3>
                       <p className="post-content">{viewingPost.content}</p>
                   </section>
                   <hr />
                   </>   
                )
            ) : (
                <section className="blog-posts-section">
                    <ul className="blog-posts-list">
                        {posts.map((post) => (
                            <BlogListItem key={post.id} post={post} updateViewingPost={updateViewingPost} getPosts={getPosts} />
                        ))}
                    </ul>
                </section>
            )}
        </StyledMain>
    );
}

export default MainView;