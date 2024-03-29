import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { getCategoriesLocal, getCategoryPostsLocal } from "../../api/posts/fetch"
import { PostList } from "../../components/posts/list"
import { Post } from "../../custom"

const CategoryPage: NextPage<{ category_name: string; posts: Post[] }> = ({
  category_name,
  posts,
}) => {
  return (
    <>
      <Head>
        <title>{`${category_name} - Forum`}</title>
        <meta name={"og:title"} content={`${category_name} - Forum`} />
        <meta name={"description"} content={`Posts in ${category_name} category`} />
        <meta name={"og:description"} content={`Posts in ${category_name} category`} />
      </Head>
      <h1 className={"text-3xl font-light mb-5"}>
        <span className={"font-normal"}>{category_name}</span> category
      </h1>
      <PostList posts={posts.sort((a, b) => b.date.localeCompare(a.date))} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths<{ name: string }> = async () => {
  const categories = await getCategoriesLocal()
  return {
    paths: categories.map((category) => {
      return { params: { name: category } }
    }),
    // TODO: maybe remove
    fallback: "blocking", // fallback tries to regenerate ArtistPage if Artist did not exist during building
  }
}

export const getStaticProps: GetStaticProps<{ posts: Post[] }, { name: string }> = async ({
  params,
}) => {
  if (params == undefined) return { notFound: true }

  let category_name = params.name.toLowerCase()

  const posts = await getCategoryPostsLocal(category_name)
  if (posts == undefined) return { notFound: true, revalidate: 1 }

  // capitalize
  category_name = category_name.charAt(0).toUpperCase() + category_name.slice(1)

  return {
    props: { posts: posts, category_name: category_name },
    revalidate: 1,
  }
}

export default CategoryPage
