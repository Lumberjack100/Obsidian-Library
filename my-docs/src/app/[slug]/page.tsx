import { getPostBySlug } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

type Props = {
  params: { slug: string }
}

export default async function Post({ params }: Props) {
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

export async function generateStaticParams() {
  return []
}