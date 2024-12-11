const fs = require('fs');
const path = require('path');

// 配置目录
const rootDir = './知识库';
const sidebarFile = path.join(rootDir, '_sidebar.md');
const navbarFile = path.join(rootDir, '_navbar.md');

//递归读取目录结构, 自动生成 _sidebar.md
function generateSidebar(dir, parentPath = '') {
  const items = fs.readdirSync(dir).filter((item) => !item.startsWith('_'));// 排除 _ 开头的文件
  let sidebarContent = '';

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(parentPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      sidebarContent += `- ${item}\n`;
      sidebarContent += generateSidebar(fullPath, relativePath);
    } else if (stat.isFile() && path.extname(item) === '.md') {
      const displayName = item.replace('.md', '');
      sidebarContent += `  - [${displayName}](${relativePath.replace(/\\/g, '/')})\n`;
    }
  });

  return sidebarContent;
}

// 自动生成 _navbar.md
function generateNavbar() {
  const navbarItems = [
    { name: '首页', link: '/' },
    { name: '关于', link: '/about.md' },
    { name: '分类', link: '/指令文档/' }
  ];

  let navbarContent = '';
  navbarItems.forEach((item) => {
    navbarContent += `- [${item.name}](${item.link})\n`;
  });

  return navbarContent;
}

// 生成并写入文件
fs.writeFileSync(sidebarFile, generateSidebar(rootDir));
fs.writeFileSync(navbarFile, generateNavbar());

console.log('_sidebar.md 和 _navbar.md 已生成');