import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

export default function Home() {
  const posts = getAllPosts()
  
  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">我的笔记库</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link 
            key={post.slug}
            href={`/${post.slug}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{post.title || post.slug}</h2>
            {post.description && (
              <p className="mt-2 text-gray-600">{post.description}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}