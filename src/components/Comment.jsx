import React from "react";
import styled from "styled-components";
import { format } from "date-fns"

const StyledLi = styled.li`
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    width: 100%;

    & span {
        display: flex;
        background-color: slategray;
        justify-content: space-between;
        padding: 3px;
    }

    & p {
        max-width: 100%;
        word-break: break-all;
        text-wrap: pretty;
        hyphens: auto;
    }

    & span div:nth-child(2) {
        display: flex;
        gap: 6px;
    }

    & button {
        padding: 2px 6px;
    }

    & form {
        width: 100%;
    }

    & form div {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    & form div button {
        width: fit-content;
    }

    & form textarea {
        padding: 2px;
        width: 100%;
        background-color: aliceblue;
        font-family: inherit;
        font-size: 16px;
        box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
    }
`

const Comment = ({comment, getComments}) => {

    async function deleteComment(commentId) {
        const usernameData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (usernameData) {
          const parsedUsernameData = JSON.parse(usernameData);
          fetch(`http://localhost:3000/users/${parsedUsernameData.username}/comments/${commentId}`, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then(() => {
            getComments();
          })
          .catch(error => console.error(error.message));
        }
    }

    return (
        <StyledLi>
            <span>
                <div>{comment.username}</div>
                <div>
                    <p>{format(comment.created, 'dd.M.yy')}</p>
                    <button title="Delete Comment" onClick={() => {deleteComment(comment.id)}}><i className="fa-solid fa-trash"></i></button>
                </div>   
            </span>
            <p>{comment.content}</p>
        </StyledLi>
    )
}

export default Comment;