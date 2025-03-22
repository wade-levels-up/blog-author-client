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
    padding: 2px 8px;
   }

`

const BlogListItem = ({post, updateViewingPost }) => {

    return   <StyledBlogListItem onClick={() => updateViewingPost(post)}>
                <h2>{post.title}</h2>
                <p className="date">{format(post.created, 'PPPP')}</p>
                <p className="summary">{post.summary}</p>
                <span>
                    <div>By {post.author}</div>
                </span>
            </StyledBlogListItem>
}

export default BlogListItem;