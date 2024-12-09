import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 修改内容目录路径，指向上级目录的知识库文件夹
const contentDirectory = path.join(process.cwd(), '..', '知识库')

export function getAllPosts() {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const files = fs.readdirSync(contentDirectory)
  
  return files
    .filter(fileName => fileName.endsWith('.md')) // 只处理 .md 文件
    .map((fileName) => {
      const slug = fileName.replace('.md', '')
      const fullPath = path.join(contentDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      
      try {
        const { data, content } = matter(fileContents)
        return {
          slug,
          content,
          title: data.title || fileName.replace('.md', ''), // 如果没有标题就用文件名
          ...data,
        }
      } catch (e) {
        console.warn(`Error processing ${fileName}:`, e)
        return {
          slug,
          content: fileContents,
          title: fileName.replace('.md', ''),
        }
      }
    })
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(contentDirectory, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  
  try {
    const { data, content } = matter(fileContents)
    return {
      slug,
      content,
      title: data.title || slug, // 如果没有标题就用 slug
      ...data,
    }
  } catch (e) {
    console.warn(`Error processing ${slug}:`, e)
    return {
      slug,
      content: fileContents,
      title: slug,
    }
  }
}