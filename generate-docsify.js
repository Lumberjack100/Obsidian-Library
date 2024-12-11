const fs = require('fs');
const path = require('path');

// 配置目录
const rootDir = path.join(__dirname, '知识库');
const sidebarFile = path.join(rootDir, '_sidebar.md');
const navbarFile = path.join(rootDir, '_navbar.md');

// 递归读取目录结构，自动生成 _sidebar.md
function generateSidebar(dir, parentPath = '') {
  const items = fs.readdirSync(dir).filter((item) => {
    // 排除特殊文件
    if (item.startsWith('_') || item.startsWith('.')) return false;
    // 如果是目录，保留
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) return true;
    // 如果是文件，只保留 .md 文件
    return path.extname(item) === '.md';
  });

  let sidebarContent = '';

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(parentPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      sidebarContent += `- ${item}\n`;
      sidebarContent += generateSidebar(fullPath, relativePath);
    } else if (stat.isFile()) {
      const displayName = item.replace('.md', '');
      sidebarContent += `  - [${displayName}](${relativePath.replace(/\\/g, '/')})\n`;
    }
  });

  return sidebarContent;
}

// 获取一级目录作为导航栏项目
function generateNavbar(rootDir) {
  let navbarContent = '- [首页](/)\n';  // 保留首页链接
  
  // 读取根目录下的文件和文件夹
  const items = fs.readdirSync(rootDir).filter(item => {
    // 排除特殊文件和非目录项
    if (item.startsWith('_') || item.startsWith('.')) return false;
    const fullPath = path.join(rootDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  // 将一级目录添加到导航栏
  items.forEach(item => {
    const relativePath = `/${item}/`;
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