const fs = require('fs');
const path = require('path');

// 配置目录
const rootDir = path.join(__dirname, '知识库');
const sidebarFile = path.join(__dirname, '_sidebar.md');
const navbarFile = path.join(__dirname, '_navbar.md');

// 递归读取目录结构，自动生成 _sidebar.md
function generateSidebar(dir, parentPath = '') {  // 移除默认的 /知识库 前缀
  const items = fs.readdirSync(dir)
    .filter((item) => {
      if (item.startsWith('_') || item.startsWith('.')) return false;
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) return true;
      return path.extname(item) === '.md';
    })
    .sort((a, b) => {
      const aPath = path.join(dir, a);
      const bPath = path.join(dir, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

  let sidebarContent = '';

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      sidebarContent += `- ${item}\n`;
      const subContent = generateSidebar(fullPath, path.join(parentPath, item));
      // 确保子项正确缩进
      sidebarContent += subContent.split('\n').map(line =>
        line ? '  ' + line : line
      ).join('\n');
    } else if (stat.isFile()) {
      const displayName = item.replace('.md', '');
      // 构建相对路径，移除开头的斜杠
      const relativePath = path.join(parentPath, item)
        .replace(/\\/g, '/')
        .replace(/^\//, '');
      sidebarContent += `- [${displayName}](${relativePath})\n`;
    }
  });

  return sidebarContent;
}


//生成导航栏项目
function generateNavbar(rootDir) {
  let navbarContent = '- [首页](/)\n';  // 保留首页链接

  // 读取根目录下的文件和文件夹
  const items = fs.readdirSync(rootDir).filter(item => {
    // 排除特殊文件和非目录项
    if (item.startsWith('_') || item.startsWith('.')) return false;
    const fullPath = path.join(rootDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  items.forEach(item => {
    const relativePath = `/知识库/${item}/`;  // 添加知识库前缀
    navbarContent += `- [${item}](${relativePath})\n`;
  });

  return navbarContent;
}

// 写入文件
try {
  fs.writeFileSync(sidebarFile, generateSidebar(rootDir));
  fs.writeFileSync(navbarFile, generateNavbar(rootDir));
  console.log('_sidebar.md 和 _navbar.md 已生成');
} catch (error) {
  console.error('生成文件时出错：', error);
  process.exit(1);
}