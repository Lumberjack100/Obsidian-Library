import { getPostBySlug } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

// 使用 Next.js 的内置类型
export default async function Post({
  params,
}: {
  params: { slug: string }
}) {
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

// 添加元数据
export const dynamic = 'force-dynamic'
export const dynamicParams = true