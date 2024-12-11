const fs = require('fs');
const path = require('path');

// 配置选项
const config = {
  rootDir: path.join(__dirname, '知识库'),
  sidebarFile: path.join(__dirname, '_sidebar.md'),
  excludeDirs: ['.git', '.obsidian', 'node_modules'],  // 要排除的目录
  excludeFiles: ['.DS_Store'],  // 要排除的文件
  maxDepth: 3,  // 最大目录深度
  defaultReadme: '# 目录简介\n\n这是默认的README文件。',  // 默认README内容
};

/**
 * 检查路径是否应该被排除
 * @param {string} itemPath - 文件或目录路径
 * @returns {boolean} - 是否应该排除
 */
function shouldExclude(itemPath) {
  const basename = path.basename(itemPath);
  return (
    basename.startsWith('.') ||
    basename.startsWith('_') ||
    config.excludeDirs.includes(basename) ||
    config.excludeFiles.includes(basename)
  );
}

/**
 * 确保目录存在README.md文件
 * @param {string} dirPath - 目录路径
 */
function ensureReadmeExists(dirPath) {
  const readmePath = path.join(dirPath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    try {
      fs.writeFileSync(readmePath, config.defaultReadme);
      console.log(`Created README.md in ${dirPath}`);
    } catch (error) {
      console.warn(`Warning: Could not create README.md in ${dirPath}:`, error.message);
    }
  }
}

/**
 * 生成侧边栏内容
 * @param {string} dir - 当前处理的目录
 * @param {number} depth - 当前目录深度
 * @returns {string} - 生成的侧边栏内容
 */
function generateSidebarContent(dir, depth = 0) {
  if (depth >= config.maxDepth) {
    return '';
  }

  let content = '';

  try {
    const items = fs.readdirSync(dir);

    // 获取所有目录
    const directories = items
      .filter(item => {
        const fullPath = path.join(dir, item);
        return (
          fs.existsSync(fullPath) &&
          fs.statSync(fullPath).isDirectory() &&
          !shouldExclude(fullPath)
        );
      })
      .sort(); // 目录按字母顺序排序

    // 获取所有文件
    const files = items
      .filter(item => {
        const fullPath = path.join(dir, item);
        return (
          fs.existsSync(fullPath) &&
          fs.statSync(fullPath).isFile() &&
          item.endsWith('.md') &&
          item !== 'README.md' &&
          !shouldExclude(fullPath)
        );
      })
      .sort(); // 文件按字母顺序排序

    // 处理目录
    directories.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path
        .normalize(fullPath.replace(__dirname, ''))
        .replace(/\\/g, '/');

      ensureReadmeExists(fullPath);

      // 添加目录标题
      content += `${'  '.repeat(depth)}- [${item}](${relativePath}/README.md)\n`;

      // 递归处理子目录
      const subContent = generateSidebarContent(fullPath, depth + 1);
      if (subContent) {
        content += subContent;
      }
    });

    // 处理文件
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path
        .normalize(fullPath.replace(__dirname, ''))
        .replace(/\\/g, '/');
      const displayName = file.replace('.md', '');

      content += `${'  '.repeat(depth)}- [${displayName}](${relativePath})\n`;
    });

  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
    return '';
  }

  return content;
}

/**
 * 监听文件变化并更新侧边栏
 */
function watchForChanges() {
  try {
    fs.watch(config.rootDir, { recursive: true }, (eventType, filename) => {
      if (filename) {
        console.log(`Detected ${eventType} in ${filename}`);
        updateSidebar();
      }
    });
    console.log('Watching for changes...');
  } catch (error) {
    console.warn('Warning: File watching not supported on this system:', error.message);
  }
}

/**
 * 更新侧边栏文件
 */
function updateSidebar() {
  try {
    // 确保根目录存在
    if (!fs.existsSync(config.rootDir)) {
      throw new Error(`Root directory ${config.rootDir} does not exist`);
    }

    // 生成侧边栏内容
    const sidebarContent = generateSidebarContent(config.rootDir);

    // 确保父目录存在
    const sidebarDir = path.dirname(config.sidebarFile);
    if (!fs.existsSync(sidebarDir)) {
      fs.mkdirSync(sidebarDir, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(config.sidebarFile, sidebarContent, 'utf8');
    console.log('Successfully updated _sidebar.md');
  } catch (error) {
    console.error('Error updating sidebar:', error.message);
    process.exit(1);
  }
}

// 主函数
function main() {
  console.log('Starting sidebar generation...');
  updateSidebar();

  // 如果设置了 WATCH 环境变量，启动文件监听
  if (process.env.WATCH === 'true') {
    watchForChanges();
  }
}

// 运行主函数
main();