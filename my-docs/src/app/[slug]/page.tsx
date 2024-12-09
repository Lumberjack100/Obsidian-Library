import { getPostBySlug } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

// 使用 Next.js 的标准类型
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Post({ params, searchParams }: Props) {
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

// 可选：生成静态参数
export async function generateStaticParams() {
  return []
}