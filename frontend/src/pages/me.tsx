import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { NextPage } from "next/types"
import { useEffect, useState } from "react"
import { useMe } from "../api/auth"
import { useMyPosts } from "../api/posts/my_posts"
import { useMyPostsLiked } from "../api/posts/my_posts_liked"
import { PostList } from "../components/posts/list"

/* TODO: add placeholders */

const UserPage: NextPage = () => {
  const router = useRouter()
  const { isLoading, isLoggedIn } = useMe()

  const [isRedirecting, setIsRedirecting] = useState(false) // Prevents duplicated redirects

  const tabs = [
    { title: "Your posts", component: <UserPosts /> },
    { title: "Your liked posts", component: <UserLikedPosts /> },
  ]
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !isRedirecting) {
      setIsRedirecting(true)
      router.push("/login")
    }
  }, [router, isLoggedIn, isRedirecting, isLoading])

  return (
    <>
      <Head>
        <title>{`Profile - Forum`}</title>
      </Head>
      <UserInfo />
      <Link href={"/create"} className={"text-2xl hover:opacity-50 mb-5 flex gap-1 max-w-fit"}>
        <span className={"my-auto"}>
          <svg
            xmlns={"http://www.w3.org/2000/svg"}
            fill={"none"}
            viewBox={"0 0 24 24"}
            strokeWidth={1.5}
            stroke={"currentColor"}
            className={"w-6 h-6 "}
          >
            <path
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              d={
                "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              }
            />
          </svg>
        </span>
        <span>Create a new post</span>
      </Link>

      <ul className={"flex flex-wrap gap-2 text-2xl mb-3"}>
        {tabs.map(({ title }, key) => (
          <li
            key={key}
            className={
              "cursor-pointer hover:opacity-60 p-1 " +
              (activeTab == key ? "border-b-2 border-b-blue-500" : "")
            }
            onClick={() => setActiveTab(key)}
          >
            {title}
          </li>
        ))}
      </ul>
      {tabs[activeTab].component}
    </>
  )
}

const UserInfo = () => {
  const { user } = useMe()

  return (
    <>
      <h1 className={"text-2xl font-thin mb-5"}>
        {"Hello, "}
        <span className={"text-3xl font-normal"}>{user?.name}</span>
      </h1>
      <p>
        {"Your email is "} <span className={"text-2xl"}> {user?.email} </span>
      </p>
      <hr className={"my-5"} />
    </>
  )
}

const UserPosts = () => {
  const { posts } = useMyPosts()

  if (posts == undefined) return null

  if (posts.length == 0) return <div>{"You haven't posted yet"}</div>

  return <PostList posts={posts.sort((a, b) => b.date.localeCompare(a.date))} />
}

const UserLikedPosts = () => {
  const { posts } = useMyPostsLiked()

  if (posts == undefined) return null

  if (posts.length == 0) return <div>{"You haven't liked any posts yet"}</div>

  return <PostList posts={posts.sort((a, b) => b.date.localeCompare(a.date))} />
}

export default UserPage
