import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BlogListItem from "./blogListItem";
import Comment from "./Comment";

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

    & .post-content {
        white-space: pre-wrap;
    }

    & .edit-menu {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        gap: 6px;
        padding: 6px 0px;
    }

    & .main-child-section {
        width: 100%;
        max-width: 55ch;
    }

    & input[id="title"] {
        font-size: 2rem;
        width: 100%;
    }

    & textarea {
        width: 100%;
        line-height: 1.3rem;
        padding: 3px;
        resize: vertical;
    }

    & .comment-form {
        display: flex;
        flex-direction: column;
        gap: 6px;
        background-color: slategray;
        padding: 12px;
    }

    & .comment-form li {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    & .comment-form input {
        margin-left: 12px;
        margin-bottom: 12px;
        width: 100%;
    }

    & .comments-list {
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 850px) {
        & h2 {
            font-size: 2.5rem;
        }

        & .blog-posts-list {
            display: grid;
            grid-template-columns: repeat( auto-fit, minmax(450px, 1fr));
        }

        & .edit-menu {
        justify-content: flex-end;
    }
    }
`

const MainView = ({ posts, username, viewingPost, updateViewingPost, getPosts, creatingPost, toggleCreatingPost}) => {
    const [editingPost, setEditingPost] = useState(false);
    const [comments, setComments] = useState([]);
    const [viewingPostCommentCount, setViewingPostCommentCount] = useState(0);

    const [title, setTitle] = useState(viewingPost ? viewingPost.title : "");
    const [summary, setSummary] = useState(viewingPost ? viewingPost.summary : "");
    const [content, setContent] = useState(viewingPost ? viewingPost.content : "");

    const [newTitle, setNewTitle] = useState("");
    const [newSummary, setNewSummary] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newPublishedState, setNewPublishedState] = useState('false');

    useEffect(() => {
        if (viewingPost) {
            setTitle(viewingPost.title);
            setSummary(viewingPost.summary);
            setContent(viewingPost.content);
            getComments();
        }
    }, [viewingPost]);

    useEffect(() => {
        if (viewingPost) {
            let postComments = 0;
            comments.forEach((comment) => {
                if (comment.postId === viewingPost.id) {
                    postComments += 1;
                }
            });
            setViewingPostCommentCount(postComments);
        }
    }, [comments, viewingPost]);

    async function getComments() {
        fetch('http://localhost:3000/comments', {mode: 'cors'})
        .then((response) => {
          if (response.status >= 400) {
            const error = new Error("Server Error");
            error.status = response.status;
            throw error;
          }
          return response.json();
        })
        .then((data) => {
          setComments(data.comments);
        })
        .catch((error) => {
          console.error(error.message)
          setComments([])
        })
    }

    async function createNewPost(event) {
        event.preventDefault()
        
        const token = localStorage.getItem("token")
        const usernameData = localStorage.getItem("user")


        if (usernameData) {
            const parsedUsernameData = JSON.parse(usernameData);
            await fetch(`http://localhost:3000/users/${parsedUsernameData.username}/posts`, {
                mode: 'cors',
                method: "POST",
                headers: {
                    "Content-type": 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title: newTitle, summary: newSummary, content: newContent, published: newPublishedState })
            }).then(() => {
                getPosts(parsedUsernameData.username);
                toggleCreatingPost()
            }).catch(error => console.error(error.message));
        }
    }

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
                   <ul className="comments-list main-child-section">
                        <h4>{viewingPostCommentCount} Comment/s</h4>
                        {comments.map((comment) => {
                            if (comment.postId === viewingPost.id) {
                                return <Comment key={comment.id} username={username} comment={comment} getComments={getComments} />
                            } 
                        })}
                    </ul>
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
                   <ul className="comments-list main-child-section">
                        <h4>{viewingPostCommentCount} Comment/s</h4>
                        {comments.map((comment) => {
                            if (comment.postId === viewingPost.id) {
                                return <Comment key={comment.id} username={username} comment={comment} getComments={getComments} />
                            } 
                        })}
                    </ul>
                   </>   
                )
            ) : (
                creatingPost ? (
                    <>
                        <form onSubmit={createNewPost} className="main-child-section">
                        <div className="edit-menu">
                            <button onClick={() => setNewPublishedState('false')} type="submit"><i className="fa-solid fa-floppy-disk"></i> Save Draft</button>
                            <button onClick={() => setNewPublishedState('true')} type="submit"><i className="fa-solid fa-paper-plane"></i> Publish</button>
                        </div>
                            <label hidden htmlFor="title"></label>
                            <input type="text" id="title" name="title" value={newTitle} placeholder="Title" onChange={(e) => setNewTitle(e.target.value)}/>
                            <h3>Summary</h3>
                            <label hidden htmlFor="summary"></label>
                            <textarea id="summary" name="summary" rows={3} value={newSummary} onChange={(e) => setNewSummary(e.target.value)}/>
                            <span className="post-menu" ><div>By {username}</div></span>
                            <h3>Content</h3>
                            <label hidden htmlFor="content"></label>
                            <textarea id="content" name="content" rows={6} value={newContent} onChange={(e) => setNewContent(e.target.value)}/>
                        </form>
                   <hr />
                   </>    
                ) : (
                    <section className="blog-posts-section">
                        <ul className="blog-posts-list">
                            {posts.map((post) => (
                                <BlogListItem key={post.id} post={post} updateViewingPost={updateViewingPost} getPosts={getPosts} />
                            ))}
                        </ul>
                    </section>
                )
            )}
        </StyledMain>
    );
}

export default MainView;