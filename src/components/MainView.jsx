import React from "react";
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

    & .main-child-section {
        width: 100%;
        max-width: 55ch;
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

const MainView = ({ posts, viewingPost, updateViewingPost}) => {

    return (
        <StyledMain>
            {viewingPost ? (
                <>
                 <section className="main-child-section">
                    <h2>{viewingPost.title}</h2>
                    <span className="post-menu" ><div>By {viewingPost.author}</div></span>
                    <p className="post-content">{viewingPost.content}</p>
                </section>
                <hr />
                </>
            ) : (
                <section className="blog-posts-section">
                    <ul className="blog-posts-list">
                        {posts.map((post) => (
                            <BlogListItem key={post.id} post={post} updateViewingPost={updateViewingPost} />
                        ))}
                    </ul>
                </section>
            )}
        </StyledMain>
    );
}

export default MainView;