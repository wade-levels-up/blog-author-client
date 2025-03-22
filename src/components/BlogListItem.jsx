import React from "react";
import styled from "styled-components";
import { format } from "date-fns";

const StyledBlogListItem = styled.li`
   display: flex;
   flex-direction: column;
   border-radius: 16px;
   width: 100%;
   height: 100%;
   max-width: 650px;
   cursor: pointer;

   &:hover {
    filter: drop-shadow(5px 3px 2px black);
   }

   & h2 {
    flex: 1;
    padding: 12px 8px;
    background-color: slategray;
    border-radius: 16px 16px 0px 0px;
    display: flex;
    align-items: center;
    gap: 18px;
   }

   & .summary {
    background-color: slategray;
    padding: 8px;
    text-wrap: pretty;
    hyphens: auto;
    border-top: 1px dotted black;
    border-bottom: 1px dotted black;
   }

   & .date {
    display: flex;
    justify-content: flex-end;
    background-color: slategray;
    padding: 0px 8px;
   }

   & span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #7f91a3;
    border-radius: 0px 0px 16px 16px;
   }

   .blogli-menu-1 {
    display: flex;
   }

   .blogli-menu-1 button {
    border: none;
    border-right: 2px ridge slategray;
    background-color: transparent;
   }

   .blogli-menu-2 button {
    border: none;
    border-left: 2px ridge slategray;
    background-color: transparent;
   }

   .delete-button {
    border-radius: 0px 0px 16px 0px;
   }

   .status {
    padding: 0px 8px;
    border-radius: 0px 0px 0px 16px;
   }

`

const BlogListItem = ({post, updateViewingPost, getPosts}) => {

    async function handleUpdatePublished() {
        
        const usernameData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const { title, summary, content } = post;

        if (usernameData) {
            const parsedUsernameData = JSON.parse(usernameData);
            const published = post.published ? 'false' : 'true';
     
            fetch(`http://localhost:3000/users/${parsedUsernameData.username}/posts/${post.id}`, {
                mode: 'cors',
                method: 'PUT',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, summary, content, published })
                }).then(() => {
                getPosts(parsedUsernameData.username);
                })
                .catch(error => console.error(error.message));
            }
        }


    async function deletePost(postId) {
        const usernameData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (usernameData) {
          const parsedUsernameData = JSON.parse(usernameData);
          fetch(`http://localhost:3000/users/${parsedUsernameData.username}/posts/${postId}`, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then(() => {
            getPosts(parsedUsernameData.username);
          })
          .catch(error => console.error(error.message));
        }
    }

    return   <StyledBlogListItem>
                <h2>{post.title}</h2>
                <p className="date">{format(post.created, 'PPPP')}</p>
                <p className="summary">{post.summary}</p>
                <span>
                    <div className="blogli-menu-1">
                        <p className="status" style={ post.published ? ({backgroundColor: 'paleturquoise'}) : ( {backgroundColor: 'orange'})}>{ post.published ? ( 'Published') : ( 'Draft')}</p>
                        { post.published && <button onClick={() => handleUpdatePublished()}>Unpublish</button> }
                        { !post.published && <button onClick={() => handleUpdatePublished()}>Publish</button> }
                    </div>
                    <div className="blogli-menu-2">
                        <button onClick={() => updateViewingPost(post)} title="Edit Post"><i className="fa-solid fa-pencil"></i></button>
                        <button onClick={() => deletePost(post.id)} className="delete-button" title="Delete Post"><i className="fa-solid fa-trash"></i></button>
                    </div>
                </span>
            </StyledBlogListItem>
}

export default BlogListItem;