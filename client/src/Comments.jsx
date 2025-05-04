import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './modules/AuthContext'

import {Pagination} from 'react-bootstrap'

const Comments = (props) => {

    const [page, setPage] = useState(1)
    const [pagesCount, setPagesCount] = useState(1)

    const [commentsArr, setCommentsArr] = useState([])
    const [commentsShowed, setCommentsShowed] = useState([])

    useEffect(() => {
        console.log("coms", props.list)
        let arr = new Array(...props.list)
        setCommentsArr(arr)
        setPagesCount(Math.ceil(arr.length/5))

        let newArr = []
        let stop = 5 * page > arr.length ? arr.length : 5 * page
        for (let i = 5 * (page - 1); i < stop; i++) {
            newArr.push(arr[i])
        }
        setCommentsShowed(newArr)
      }, [page, props.list])

    return(
        <div className="commentsBlock">
            <div className="commentsCount">
                Комментарии ({commentsArr.length})
            </div>
            <div className="commentsDisplay">
                {commentsShowed.map((comment, i) => {
                    return(
                        <div className="comment" key={i}>
                            <div className="commentAuthor">{comment.authorName}</div>
                            <div className="commentText">{comment.commentText}</div>
                            <div className="commentDate">{props.dateFunc(comment.createdAt)}</div>
                        </div>
                    )
                })
                }
            </div>
            {commentsArr.length > 5 &&
            <div className="pagination">
                <Pagination>
                    {page > 3 && <Pagination.First onClick={() => setPage(1)} />}
                    {page > 1 && <Pagination.Prev onClick={() => setPage(page - 1)} />}
                    {page > 3 && 
                    <Pagination.Item onClick={() => setPage(1)}>{1}</Pagination.Item>
                    }
                    { page > 4 &&
                    <Pagination.Ellipsis disabled />}

                    { page > 2 && <Pagination.Item onClick={() => setPage(page - 2)}>{page - 2}</Pagination.Item>}
                    { page > 1 && <Pagination.Item onClick={() => setPage(page -1)}>{page - 1}</Pagination.Item>}
                    <Pagination.Item active>{page}</Pagination.Item>
                    { pagesCount - page > 0 && <Pagination.Item onClick={() => setPage(page+1)}>{page + 1}</Pagination.Item>}
                    { pagesCount - page > 1 && <Pagination.Item onClick={() => setPage(page + 2)}>{page + 2}</Pagination.Item>}

                    {pagesCount - page > 4 && <Pagination.Ellipsis disabled />}
                    {pagesCount - page > 3 &&
                    <Pagination.Item onClick={() => setPage(pagesCount)}>{pagesCount}</Pagination.Item>}
                    {page < pagesCount && <Pagination.Next onClick={() => setPage(page+1)} />}
                    {pagesCount - page > 3 && <Pagination.Last onClick={() => setPage(pagesCount)} />}
                </Pagination>
            </div>
            }
        </div>
    )
}

export default Comments;