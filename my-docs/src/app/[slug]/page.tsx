import { getPostBySlug } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

// 正确的类型定义
interface PageProps {
  params: {
    slug: string
  }
}

export default async function Post({ params }: PageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <div className="prose prose-lg">
        <h1>{post.title || post.slug}</h1>
        <MDXRemote source={post.content} />
      </div>
    </article>
  )
}