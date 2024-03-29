import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import { useMe } from "../../api/auth"
import {
  dislikeComment,
  likeComment,
  dislikePost,
  likePost,
  useReactions,
  useCommentReactions,
} from "../../api/posts/reactions"
import { Post, Comment } from "../../custom"

// TODO: add prefetching (useSWR fallback)

export const ReactionsButtons: FC<{ post: Post }> = ({ post }) => {
  const { isLoggedIn } = useMe()
  const router = useRouter()

  const { reaction, likes_count, dislikes_count, mutate: mutateReactions } = useReactions(post.id)

  useEffect(() => {
    mutateReactions()
    // mutate reactions if user logged out (to hide dislikes and reaction colors)
  }, [mutateReactions, isLoggedIn])

  return (
    <span className={"mx-2 my-auto flex"}>
      <span className={"mr-1 text-xl"}>
        {likes_count != undefined
          ? likes_count > 0
            ? likes_count
            : ""
          : post.likes_count > 0
          ? post.likes_count
          : ""}
      </span>
      <button
        title={"Like"}
        className={"mr-1 " + (reaction == 1 ? "text-blue-500" : "")}
        onClick={() => {
          if (!isLoggedIn) {
            router.push("/login")
            return
          }
          likePost(post.id).then(() => mutateReactions())
        }}
      >
        <motion.svg
          whileTap={{ scale: 0.8 }}
          xmlns={"http://www.w3.org/2000/svg"}
          fill={"none"}
          viewBox={"0 0 24 24"}
          strokeWidth={1.5}
          stroke={"currentColor"}
          className={post ? "w-6 h-6" : "w-7 h-7"}
        >
          <path
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            d={
              "M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            }
          />
        </motion.svg>
      </button>

      <span className={"mr-1 text-xl"}>
        {dislikes_count != undefined
          ? dislikes_count > 0
            ? dislikes_count
            : ""
          : post.dislikes_count > 0
          ? post.dislikes_count
          : ""}
      </span>

      <button
        title={"Dislike"}
        className={"mr-1 " + (reaction == -1 ? "text-blue-500" : "")}
        onClick={() => {
          if (!isLoggedIn) {
            router.push("/login")
            return
          }
          dislikePost(post.id).then(() => mutateReactions())
        }}
      >
        <motion.svg
          whileTap={{ scale: 0.5 }}
          xmlns={"http://www.w3.org/2000/svg"}
          fill={"none"}
          viewBox={"0 0 24 24"}
          strokeWidth={1.5}
          stroke={"currentColor"}
          className={post ? "w-6 h-6" : "w-7 h-7"}
        >
          <path
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            d={
              "M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
            }
          />
        </motion.svg>
      </button>
    </span>
  )
}

export const ReactionsCommentButtons: FC<{ post: Post; comment: Comment }> = ({
  post,
  comment,
}) => {
  const { isLoggedIn } = useMe()
  const router = useRouter()

  const {
    reaction,
    likes_count,
    dislikes_count,
    mutate: mutateCommentReactions,
  } = useCommentReactions(post.id, comment.id)

  return (
    <span className={"mx-2 my-auto flex"}>
      <span className={"mr-1"}>
        {likes_count != undefined
          ? likes_count > 0
            ? likes_count
            : ""
          : comment.likes_count > 0
          ? comment.likes_count
          : ""}
      </span>
      <button
        title={"Like"}
        className={"mr-1 " + (reaction == 1 ? "text-blue-500" : "")}
        onClick={() => {
          if (!isLoggedIn) {
            router.push("/login")
            return
          }
          likeComment(post.id, comment.id).then(() => mutateCommentReactions())
        }}
      >
        <motion.svg
          whileTap={{ scale: 0.8 }}
          xmlns={"http://www.w3.org/2000/svg"}
          fill={"none"}
          viewBox={"0 0 24 24"}
          strokeWidth={1.5}
          stroke={"currentColor"}
          className={comment ? "w-6 h-6" : "w-7 h-7"}
        >
          <path
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            d={
              "M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            }
          />
        </motion.svg>
      </button>

      <span className={"mr-1"}>
        {dislikes_count != undefined
          ? dislikes_count > 0
            ? dislikes_count
            : ""
          : comment.dislikes_count > 0
          ? comment.dislikes_count
          : ""}
      </span>

      <button
        title={"Dislike"}
        className={"mr-1 " + (reaction == -1 ? "text-blue-500" : "")}
        onClick={() => {
          if (!isLoggedIn) {
            router.push("/login")
            return
          }
          dislikeComment(post.id, comment.id).then(() => mutateCommentReactions())
        }}
      >
        <motion.svg
          whileTap={{ scale: 0.5 }}
          xmlns={"http://www.w3.org/2000/svg"}
          fill={"none"}
          viewBox={"0 0 24 24"}
          strokeWidth={1.5}
          stroke={"currentColor"}
          className={comment ? "w-6 h-6" : "w-7 h-7"}
        >
          <path
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            d={
              "M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
            }
          />
        </motion.svg>
      </button>
    </span>
  )
}

export const CommentsCount: FC<{ post: Post }> = ({ post }) => (
  <span className={"my-auto flex mr-2"}>
    <Link title={"Comments"} href={`/post/${post.id}`} className={"hover:opacity-50 my-auto flex"}>
      <span className={"mr-1 text-xl"}>{post.comments_count > 0 && post.comments_count}</span>
      <span className={"pt-1"}>
        <svg
          xmlns={"http://www.w3.org/2000/svg"}
          fill={"none"}
          viewBox={"0 0 24 24"}
          strokeWidth={1.5}
          stroke={"currentColor"}
          className={"w-6 h-6"}
        >
          <path
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            d={
              "M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            }
          />
        </svg>
      </span>
    </Link>
  </span>
)

export const Category: FC<{ post: Post }> = ({ post }) => {
  const categories = post.categories.split(",")
  return (
    <>
      {categories.map((category, key) => (
        // eslint-disable-next-line react/jsx-key
        <Link
          title={`Category ${category}`}
          key={key}
          href={`/category/${category}`}
          className={"hover:opacity-50 flex"}
        >
          <span className={"text-xl capitalize"}>{category}</span>
          <span className={"pt-1 mx-1"}>
            <svg
              xmlns={"http://www.w3.org/2000/svg"}
              fill={"none"}
              viewBox={"0 0 24 24"}
              strokeWidth={1.5}
              stroke={"currentColor"}
              className={"w-6 h-6"}
            >
              <path
                strokeLinecap={"round"}
                strokeLinejoin={"round"}
                d={
                  "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                }
              />
              <path strokeLinecap={"round"} strokeLinejoin={"round"} d={"M6 6h.008v.008H6V6z"} />
            </svg>
          </span>
        </Link>
      ))}
    </>
  )
}
