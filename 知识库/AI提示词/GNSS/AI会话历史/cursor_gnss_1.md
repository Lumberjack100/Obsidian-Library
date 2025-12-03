# Discussion about untitled document
_Exported on 2025/12/3 at GMT+8 17:01:38 from Cursor (2.1.46)_

---

**User**

@Untitled-1 (1-7) 

---

**Cursor**

让我先查看一下您之前的网页制作提示词，了解您期望的网页风格。

我已了解您的需求。您想要一个关于GNSS卫星星空图的可视化教学网页，帮助您理解和分析设备问题。让我为您创建一个详细的计划。

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GNSS卫星星空图 - 可视化分析工具</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'gps': '#22c55e',
                        'beidou': '#ef4444',
                        'glonass': '#3b82f6',
                        'galileo': '#f97316',
                        'dark-bg': '#0d1117',
                        'dark-card': '#161b22',
                        'dark-border': '#30363d',
                    },
                    fontFamily: {
                        'sans': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <style>
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse-soft {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        
        .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .dark .card-hover:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        
        .satellite-dot {
            animation: pulse-soft 2s ease-in-out infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 4px;
        }
        
        .dark ::-webkit-scrollbar-thumb {
            background: #374151;
        }
        
        /* Gradient text */
        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .dark .gradient-text {
            background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* Table hover effect */
        .table-row-hover {
            transition: background-color 0.2s ease;
        }
        
        .table-row-hover:hover {
            background-color: rgba(99, 102, 241, 0.08);
        }
        
        .dark .table-row-hover:hover {
            background-color: rgba(99, 102, 241, 0.15);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <i class="fas fa-satellite text-white text-lg"></i>
                    </div>
                    <div>
                        <h1 class="text-lg font-semibold">GNSS 卫星星空图</h1>
                        <p class="text-xs text-gray-500 dark:text-gray-400">可视化分析工具</p>
                    </div>
                </div>
                <button id="themeToggle" class="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <i class="fas fa-sun text-amber-500 dark:hidden"></i>
                    <i class="fas fa-moon text-indigo-400 hidden dark:block"></i>
                </button>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Hero Section -->
        <section class="text-center mb-12 opacity-0 animate-fade-in-up">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4">
                <span class="gradient-text">理解卫星定位</span>，分析设备问题
            </h2>
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                通过可视化的卫星星空图，帮助您快速诊断GNSS设备在项目现场遇到的问题
            </p>
        </section>

        <!-- Concepts Section -->
        <section class="mb-12 opacity-0 animate-fade-in-up animate-delay-100">
            <div class="flex items-center gap-2 mb-6">
                <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <i class="fas fa-book-open text-indigo-600 dark:text-indigo-400"></i>
                </div>
                <h3 class="text-xl font-semibold">核心概念</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- GNSS Card -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                            <i class="fas fa-globe text-white"></i>
                        </div>
                        <h4 class="font-semibold text-lg">GNSS</h4>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        <strong>全球导航卫星系统</strong>的英文缩写。想象天上有四个"卫星网络公司"同时为您提供定位服务：
                    </p>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-gps"></span>
                            <span>GPS（美国）- 31颗卫星</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-beidou"></span>
                            <span>北斗（中国）- 46颗卫星</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-glonass"></span>
                            <span>GLONASS（俄罗斯）- 24颗卫星</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-galileo"></span>
                            <span>Galileo（欧洲）- 28颗卫星</span>
                        </div>
                    </div>
                </div>

                <!-- RTK Card -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                            <i class="fas fa-crosshairs text-white"></i>
                        </div>
                        <h4 class="font-semibold text-lg">RTK</h4>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        <strong>实时动态差分技术</strong>。普通GPS精度约3-5米，而RTK可达到<strong class="text-purple-600 dark:text-purple-400">厘米级</strong>精度。
                    </p>
                    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-sm">
                        <p class="text-gray-700 dark:text-gray-300">
                            <i class="fas fa-lightbulb text-amber-500 mr-2"></i>
                            <strong>原理比喻：</strong>就像有一个"校准站"帮您修正误差，让定位更精准。
                        </p>
                    </div>
                </div>

                <!-- 仰角/方位角 Card -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <i class="fas fa-compass text-white"></i>
                        </div>
                        <h4 class="font-semibold text-lg">仰角 & 方位角</h4>
                    </div>
                    <div class="space-y-4 text-sm">
                        <div>
                            <p class="font-medium text-gray-700 dark:text-gray-300 mb-1">仰角 (Elevation)</p>
                            <p class="text-gray-600 dark:text-gray-400">
                                卫星在天空中的"高度"。0°表示在地平线，90°表示在正头顶。
                                <span class="text-amber-600 dark:text-amber-400">仰角越高，信号通常越好。</span>
                            </p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-700 dark:text-gray-300 mb-1">方位角 (Azimuth)</p>
                            <p class="text-gray-600 dark:text-gray-400">
                                卫星在哪个方向。0°/360°是正北，90°是正东，180°是正南，270°是正西。
                            </p>
                        </div>
                    </div>
                </div>

                <!-- L1/L2/L3 Card -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                            <i class="fas fa-wave-square text-white"></i>
                        </div>
                        <h4 class="font-semibold text-lg">L1/L2/L3 频段</h4>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        卫星发射信号的不同"频道"，每个频段有不同特性：
                    </p>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                            <span class="font-medium">L1</span>
                            <span class="text-gray-500 dark:text-gray-400">1575.42 MHz · 民用主频</span>
                        </div>
                        <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                            <span class="font-medium">L2</span>
                            <span class="text-gray-500 dark:text-gray-400">1227.60 MHz · 抗干扰强</span>
                        </div>
                        <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                            <span class="font-medium">L3/L5</span>
                            <span class="text-gray-500 dark:text-gray-400">1176.45 MHz · 高精度</span>
                        </div>
                    </div>
                </div>

                <!-- SNR Card -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                            <i class="fas fa-signal text-white"></i>
                        </div>
                        <h4 class="font-semibold text-lg">信噪比 (SNR)</h4>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        信号强度的衡量指标，单位是 <strong>dB-Hz</strong>。数值越大，信号越清晰稳定。
                    </p>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <div class="flex-1 h-2 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>< 30 dB-Hz<br/>弱信号</span>
                            <span class="text-center">30-40 dB-Hz<br/>一般</span>
                            <span class="text-right">> 40 dB-Hz<br/>良好</span>
                        </div>
                    </div>
                </div>

                <!-- 多路径效应 Card -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-gray-600 flex items-center justify-center">
                            <i class="fas fa-building text-white"></i>
                        </div>
                        <h4 class="font-semibold text-lg">多路径效应</h4>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        卫星信号被建筑物、地面等反射后到达接收器，造成定位误差。
                    </p>
                    <div class="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm">
                        <p class="text-gray-700 dark:text-gray-300">
                            <i class="fas fa-exclamation-triangle text-amber-500 mr-2"></i>
                            <strong>低仰角卫星</strong>（< 15°）更容易受多路径影响，通常会被设备过滤。
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Skyplot Section -->
        <section class="mb-12 opacity-0 animate-fade-in-up animate-delay-200">
            <div class="flex items-center gap-2 mb-6">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <i class="fas fa-chart-pie text-emerald-600 dark:text-emerald-400"></i>
                </div>
                <h3 class="text-xl font-semibold">卫星星空图</h3>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Skyplot Canvas -->
                <div class="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-medium text-gray-700 dark:text-gray-300">实时星空图</h4>
                        <div class="flex gap-2">
                            <button id="refreshBtn" class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                <i class="fas fa-sync-alt mr-1"></i>刷新
                            </button>
                        </div>
                    </div>
                    <div class="relative aspect-square max-w-md mx-auto">
                        <canvas id="skyplotCanvas" class="w-full h-full"></canvas>
                    </div>
                    <!-- Legend -->
                    <div class="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-gps"></span>
                            <span>GPS</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-beidou"></span>
                            <span>北斗</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-glonass"></span>
                            <span>GLONASS</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-4 h-4 rounded-full bg-galileo"></span>
                            <span>Galileo</span>
                        </div>
                    </div>
                </div>

                <!-- Signal Strength Chart -->
                <div class="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-4">信号强度分布</h4>
                    <div id="signalBars" class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        <!-- Dynamic content -->
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                        <div class="grid grid-cols-3 gap-4 text-center text-sm">
                            <div>
                                <p class="text-2xl font-bold text-emerald-500" id="goodSignalCount">0</p>
                                <p class="text-gray-500 dark:text-gray-400">良好</p>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-amber-500" id="mediumSignalCount">0</p>
                                <p class="text-gray-500 dark:text-gray-400">一般</p>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-red-500" id="weakSignalCount">0</p>
                                <p class="text-gray-500 dark:text-gray-400">弱信号</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Data Table Section -->
        <section class="mb-12 opacity-0 animate-fade-in-up animate-delay-300">
            <div class="flex items-center gap-2 mb-6">
                <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <i class="fas fa-table text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 class="text-xl font-semibold">卫星数据详情</h3>
            </div>

            <div class="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-dark-border">
                                <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">卫星编号</th>
                                <th class="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">系统</th>
                                <th class="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-400">仰角</th>
                                <th class="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-400">方位角</th>
                                <th class="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-400">L1强度</th>
                                <th class="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-400">L2强度</th>
                                <th class="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-400">L3强度</th>
                                <th class="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-400">状态</th>
                            </tr>
                        </thead>
                        <tbody id="satelliteTableBody">
                            <!-- Dynamic content -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Problem Analysis Section -->
        <section class="mb-12 opacity-0 animate-fade-in-up animate-delay-400">
            <div class="flex items-center gap-2 mb-6">
                <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <i class="fas fa-search-plus text-rose-600 dark:text-rose-400"></i>
                </div>
                <h3 class="text-xl font-semibold">问题分析指南</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Signal Blocking -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-ban text-red-500 text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">信号遮挡问题</h4>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                某个方向的卫星完全看不到，星空图上出现明显的"空白区域"。
                            </p>
                            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-sm">
                                <p class="font-medium text-red-700 dark:text-red-300 mb-1">判断方法：</p>
                                <ul class="text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                                    <li>星空图某方向持续无卫星</li>
                                    <li>对应方向可能有高大建筑或山体</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Multipath Effect -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-random text-amber-500 text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">多路径效应</h4>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                低仰角卫星信号异常，或同一颗卫星的信号强度波动剧烈。
                            </p>
                            <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-sm">
                                <p class="font-medium text-amber-700 dark:text-amber-300 mb-1">判断方法：</p>
                                <ul class="text-amber-600 dark:text-amber-400 space-y-1 list-disc list-inside">
                                    <li>仰角 < 15° 的卫星信号不稳定</li>
                                    <li>周围有大面积反光物体（水面、玻璃幕墙）</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Device Fault -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-exclamation-circle text-purple-500 text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">设备故障</h4>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                所有卫星信号普遍偏弱，无论仰角高低，信噪比都很低。
                            </p>
                            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-sm">
                                <p class="font-medium text-purple-700 dark:text-purple-300 mb-1">判断方法：</p>
                                <ul class="text-purple-600 dark:text-purple-400 space-y-1 list-disc list-inside">
                                    <li>高仰角卫星（> 60°）信号也很弱</li>
                                    <li>多个频段信号同时偏低</li>
                                    <li>检查天线连接和设备状态</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Environmental Interference -->
                <div class="card-hover bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-dark-border">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-bolt text-cyan-500 text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">环境干扰</h4>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                信号强度大幅波动，时好时坏，没有规律可循。
                            </p>
                            <div class="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 text-sm">
                                <p class="font-medium text-cyan-700 dark:text-cyan-300 mb-1">判断方法：</p>
                                <ul class="text-cyan-600 dark:text-cyan-400 space-y-1 list-disc list-inside">
                                    <li>信号强度短时间内剧烈变化</li>
                                    <li>附近可能有电磁干扰源</li>
                                    <li>尝试更换设备位置测试</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Diagnosis Tips -->
            <div class="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-lightbulb text-2xl"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg mb-2">快速诊断小技巧</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
                            <div class="flex items-start gap-2">
                                <i class="fas fa-check-circle mt-0.5"></i>
                                <span>理想状态下，应能看到 8-12 颗以上卫星</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <i class="fas fa-check-circle mt-0.5"></i>
                                <span>高仰角卫星（> 45°）信号应 > 40 dB-Hz</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <i class="fas fa-check-circle mt-0.5"></i>
                                <span>卫星分布应尽量均匀，避免集中在一侧</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <i class="fas fa-check-circle mt-0.5"></i>
                                <span>RTK固定解需要至少 5 颗共视卫星</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <i class="fas fa-satellite text-white text-sm"></i>
                    </div>
                    <span class="font-medium">GNSS卫星星空图</span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>作者: 伐木</span>
                    <a href="http://t.cn/A6BbJgnN" target="_blank" class="hover:text-indigo-500 transition-colors">
                        <i class="fab fa-twitter mr-1"></i>Twitter/X
                    </a>
                </div>
                <p class="text-sm text-gray-400 dark:text-gray-500">
                    © 2025 All Rights Reserved
                </p>
            </div>
        </div>
    </footer>

    <script>
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Check system preference and saved preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
        }
        
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
        });

        // Satellite Data (Simulated)
        const satelliteData = [
            { prn: 'G01', system: 'GPS', elevation: 72, azimuth: 45, l1: 48, l2: 44, l3: 42, used: true },
            { prn: 'G03', system: 'GPS', elevation: 55, azimuth: 120, l1: 45, l2: 41, l3: 39, used: true },
            { prn: 'G07', system: 'GPS', elevation: 38, azimuth: 200, l1: 42, l2: 38, l3: 35, used: true },
            { prn: 'G08', system: 'GPS', elevation: 25, azimuth: 280, l1: 38, l2: 34, l3: 30, used: true },
            { prn: 'G10', system: 'GPS', elevation: 12, azimuth: 330, l1: 28, l2: 24, l3: 0, used: false },
            { prn: 'C01', system: '北斗', elevation: 85, azimuth: 180, l1: 50, l2: 47, l3: 45, used: true },
            { prn: 'C03', system: '北斗', elevation: 62, azimuth: 95, l1: 46, l2: 43, l3: 41, used: true },
            { prn: 'C06', system: '北斗', elevation: 45, azimuth: 255, l1: 43, l2: 40, l3: 38, used: true },
            { prn: 'C11', system: '北斗', elevation: 28, azimuth: 15, l1: 39, l2: 35, l3: 32, used: true },
            { prn: 'C14', system: '北斗', elevation: 8, azimuth: 160, l1: 25, l2: 20, l3: 0, used: false },
            { prn: 'R02', system: 'GLONASS', elevation: 68, azimuth: 310, l1: 47, l2: 43, l3: 40, used: true },
            { prn: 'R05', system: 'GLONASS', elevation: 42, azimuth: 75, l1: 41, l2: 37, l3: 34, used: true },
            { prn: 'R07', system: 'GLONASS', elevation: 18, azimuth: 225, l1: 32, l2: 28, l3: 0, used: false },
            { prn: 'E02', system: 'Galileo', elevation: 58, azimuth: 140, l1: 44, l2: 41, l3: 38, used: true },
            { prn: 'E05', system: 'Galileo', elevation: 35, azimuth: 290, l1: 40, l2: 36, l3: 33, used: true },
            { prn: 'E08', system: 'Galileo', elevation: 15, azimuth: 50, l1: 30, l2: 26, l3: 0, used: false },
        ];

        const systemColors = {
            'GPS': '#22c55e',
            '北斗': '#ef4444',
            'GLONASS': '#3b82f6',
            'Galileo': '#f97316'
        };

        // Draw Skyplot
        function drawSkyplot() {
            const canvas = document.getElementById('skyplotCanvas');
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            
            // Set canvas size
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            
            const size = Math.min(rect.width, rect.height);
            const center = size / 2;
            const radius = center - 40;
            
            // Clear canvas
            ctx.clearRect(0, 0, size, size);
            
            // Get theme
            const isDark = document.documentElement.classList.contains('dark');
            const textColor = isDark ? '#9ca3af' : '#6b7280';
            const gridColor = isDark ? '#374151' : '#e5e7eb';
            const bgColor = isDark ? '#1f2937' : '#f9fafb';
            
            // Draw background
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fillStyle = bgColor;
            ctx.fill();
            
            // Draw elevation circles
            const elevations = [0, 30, 60, 90];
            elevations.forEach((elev, i) => {
                const r = radius * (1 - elev / 90);
                ctx.beginPath();
                ctx.arc(center, center, r, 0, Math.PI * 2);
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = elev === 0 ? 2 : 1;
                ctx.stroke();
                
                if (elev > 0 && elev < 90) {
                    ctx.fillStyle = textColor;
                    ctx.font = '11px system-ui';
                    ctx.textAlign = 'center';
                    ctx.fillText(elev + '°', center, center - r + 12);
                }
            });
            
            // Draw azimuth lines
            const directions = [
                { angle: 0, label: 'N' },
                { angle: 90, label: 'E' },
                { angle: 180, label: 'S' },
                { angle: 270, label: 'W' }
            ];
            
            directions.forEach(dir => {
                const radians = (dir.angle - 90) * Math.PI / 180;
                const x1 = center;
                const y1 = center;
                const x2 = center + radius * Math.cos(radians);
                const y2 = center + radius * Math.sin(radians);
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Draw direction labels
                const labelRadius = radius + 18;
                const labelX = center + labelRadius * Math.cos(radians);
                const labelY = center + labelRadius * Math.sin(radians);
                ctx.fillStyle = textColor;
                ctx.font = 'bold 13px system-ui';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(dir.label, labelX, labelY);
            });
            
            // Draw satellites
            satelliteData.forEach(sat => {
                const r = radius * (1 - sat.elevation / 90);
                const radians = (sat.azimuth - 90) * Math.PI / 180;
                const x = center + r * Math.cos(radians);
                const y = center + r * Math.sin(radians);
                
                const color = systemColors[sat.system];
                const dotRadius = sat.used ? 8 : 5;
                const opacity = sat.used ? 1 : 0.5;
                
                // Draw satellite dot
                ctx.beginPath();
                ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
                
                // Draw PRN label
                ctx.fillStyle = isDark ? '#fff' : '#1f2937';
                ctx.font = '10px system-ui';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(sat.prn, x, y - dotRadius - 3);
            });
        }

        // Render Signal Bars
        function renderSignalBars() {
            const container = document.getElementById('signalBars');
            container.innerHTML = satelliteData.map(sat => {
                const color = systemColors[sat.system];
                const maxSignal = Math.max(sat.l1, sat.l2, sat.l3);
                const signalClass = maxSignal >= 40 ? 'bg-emerald-500' : (maxSignal >= 30 ? 'bg-amber-500' : 'bg-red-500');
                
                return `
                    <div class="flex items-center gap-3">
                        <div class="w-12 flex items-center gap-1">
                            <span class="w-3 h-3 rounded-full" style="background-color: ${color}"></span>
                            <span class="text-xs font-medium">${sat.prn}</span>
                        </div>
                        <div class="flex-1">
                            <div class="flex gap-1 h-5">
                                <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                    <div class="h-full ${signalClass} transition-all duration-500" style="width: ${sat.l1 * 2}%"></div>
                                </div>
                                <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                    <div class="h-full ${signalClass} transition-all duration-500" style="width: ${sat.l2 * 2}%"></div>
                                </div>
                                <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                    <div class="h-full ${signalClass} transition-all duration-500" style="width: ${sat.l3 * 2}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 w-20 text-right">
                            ${sat.l1}/${sat.l2}/${sat.l3}
                        </div>
                    </div>
                `;
            }).join('');

            // Update counts
            let good = 0, medium = 0, weak = 0;
            satelliteData.forEach(sat => {
                const max = Math.max(sat.l1, sat.l2, sat.l3);
                if (max >= 40) good++;
                else if (max >= 30) medium++;
                else weak++;
            });
            document.getElementById('goodSignalCount').textContent = good;
            document.getElementById('mediumSignalCount').textContent = medium;
            document.getElementById('weakSignalCount').textContent = weak;
        }

        // Render Table
        function renderTable() {
            const tbody = document.getElementById('satelliteTableBody');
            tbody.innerHTML = satelliteData.map(sat => {
                const color = systemColors[sat.system];
                const getSignalBadge = (value) => {
                    if (value === 0) return '<span class="text-gray-400">-</span>';
                    const colorClass = value >= 40 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                      value >= 30 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                    return `<span class="px-2 py-0.5 rounded text-xs font-medium ${colorClass}">${value}</span>`;
                };
                
                return `
                    <tr class="table-row-hover border-b border-gray-100 dark:border-gray-800">
                        <td class="px-4 py-3 font-medium">${sat.prn}</td>
                        <td class="px-4 py-3">
                            <span class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full" style="background-color: ${color}"></span>
                                ${sat.system}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-center">${sat.elevation}°</td>
                        <td class="px-4 py-3 text-center">${sat.azimuth}°</td>
                        <td class="px-4 py-3 text-center">${getSignalBadge(sat.l1)}</td>
                        <td class="px-4 py-3 text-center">${getSignalBadge(sat.l2)}</td>
                        <td class="px-4 py-3 text-center">${getSignalBadge(sat.l3)}</td>
                        <td class="px-4 py-3 text-center">
                            ${sat.used ? 
                                '<span class="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">使用中</span>' :
                                '<span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">未使用</span>'
                            }
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Refresh with random variations
        function refreshData() {
            satelliteData.forEach(sat => {
                // Add small random variations
                sat.elevation = Math.max(5, Math.min(90, sat.elevation + (Math.random() - 0.5) * 5));
                sat.azimuth = (sat.azimuth + Math.random() * 3) % 360;
                sat.l1 = Math.max(20, Math.min(52, sat.l1 + (Math.random() - 0.5) * 4));
                sat.l2 = Math.max(18, Math.min(50, sat.l2 + (Math.random() - 0.5) * 4));
                if (sat.l3 > 0) {
                    sat.l3 = Math.max(15, Math.min(48, sat.l3 + (Math.random() - 0.5) * 4));
                }
            });
            
            drawSkyplot();
            renderSignalBars();
            renderTable();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            drawSkyplot();
            renderSignalBars();
            renderTable();
            
            // Trigger animations
            document.querySelectorAll('.opacity-0').forEach(el => {
                el.classList.remove('opacity-0');
            });
        });

        // Handle resize
        window.addEventListener('resize', drawSkyplot);
        
        // Theme change redraw
        const observer = new MutationObserver(() => {
            drawSkyplot();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            const btn = document.getElementById('refreshBtn');
            btn.querySelector('i').classList.add('animate-spin');
            setTimeout(() => {
                refreshData();
                btn.querySelector('i').classList.remove('animate-spin');
            }, 500);
        });
    </script>
</body>
</html>

```

已完成 GNSS 卫星星空图可视化网页的创建！文件位于 `/Users/gonghe/Documents/Obsidian-Library/gnss-skyplot.html`

## 网页功能概览

### 1. 核心概念解释区
- **GNSS**: 四大卫星系统的通俗介绍（GPS、北斗、GLONASS、Galileo）
- **RTK**: 实时动态差分技术的原理比喻
- **仰角/方位角**: 用生活化语言解释卫星位置参数
- **L1/L2/L3 频段**: 不同频率的特性说明
- **信噪比（SNR）**: 信号强度的衡量标准
- **多路径效应**: 反射信号造成的误差问题

### 2. 交互式卫星星空图
- 使用 Canvas 绘制的极坐标图
- 同心圆表示不同仰角（0°/30°/60°/90°）
- 四个方位标注（N/E/S/W）
- 四种颜色区分卫星系统
- 支持刷新按钮模拟数据变化
- 深色/浅色模式自适应

### 3. 信号强度可视化
- 柱状图展示每颗卫星的 L1/L2/L3 信号强度
- 颜色编码：绿色(良好) / 黄色(一般) / 红色(弱信号)
- 统计卡片显示各类信号数量

### 4. 卫星数据表格
- 展示 16 颗模拟卫星的详细数据
- 包含 PRN、系统、仰角、方位角、各频段信号强度、使用状态

### 5. 问题分析指南
- **信号遮挡问题**: 判断方法和现象
- **多路径效应**: 低仰角卫星异常的识别
- **设备故障**: 全频段信号偏弱的诊断
- **环境干扰**: 信号波动问题的分析
- **快速诊断小技巧**: 实用经验总结

### 技术特性
- 单一 HTML 文件，直接打开即可使用
- TailwindCSS 3.0+ 现代化设计
- 深色/浅色模式切换，默认跟随系统
- 响应式布局，适配手机/平板/桌面
- 平滑动画和微交互效果

您可以直接在浏览器中打开这个文件查看效果！

---

**User**

@Untitled-1 (1-9) 

---

**Cursor**

让我先查看现有的 HTML 文件结构，然后向您确认一些关于 RTCM 数据的问题。

我已经查看了现有的 HTML 文件。在实现 RTCM 数据解析功能之前，我需要向您确认一些关键信息：

感谢您的回复！您提到会提供样本文件，这对我分析数据结构很有帮助。在此之前，让我先创建一个实现计划：

---

**User**

 .bin 样本文件在 `/知识库/AI提示词/GNSS/测站数据` 下

---

**Cursor**

让我查看样本文件目录并分析文件结构。

---

**User**

我在`/知识库/AI提示词/GNSS/基站数据` 下添加了基站样本数据， 如果基站中的数据能提供对于测站的空间位置补充的话，可以变更需求，支持同时导入测站与基站的数据，并进行空间位置补充。如果没有任何帮助，请忽略。

---

**Cursor**

让我查看基站数据目录和分析其内容。

根据我对两个样本文件的分析，我发现：

**分析结果：**

1. **测站数据** 和 **基站数据** 都主要包含 **MSM4 观测消息**：
   - GPS MSM4 (1074)
   - GLONASS MSM4 (1084)  
   - BDS/北斗 MSM4 (1124)

2. **MSM4 消息包含的数据**：
   - 卫星 PRN 编号
   - 信号强度 (CNR/载噪比，单位 dB-Hz)
   - 伪距和载波相位测量值

3. **MSM4 消息不直接包含**：
   - 卫星仰角 (Elevation)
   - 卫星方位角 (Azimuth)

**结论**：基站数据无法直接提供卫星空间位置的补充。卫星的仰角/方位角需要通过星历数据（卫星轨道参数）结合接收机位置和时间进行复杂的天文计算。

让我更新实现计划：

---

**User**

@GNSS卫星星空图教学网页.md (59-63) 

---

**Cursor**

明白了！根据数据分析结果和您的指示，我来更新计划：

---

**User**

我的意思是根据上传的 .bin 格式的 RTCM 数据文件，判断是否包含卫星的仰角/方位角等信息，如果包含，就实现一个精确版的星空图，如果不包含，就实现一个简化版的星空图。

---

**Cursor**

明白了！您希望根据上传文件的内容**自动判断**并动态选择展示方式。让我更新计划：

