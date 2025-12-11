import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Settings, Plus, Search, MessageSquareDashed, ChevronRight, ChevronDown,
  X, History, Clock, 
  Sun, Info, MessageSquare, HelpCircle, Globe,
  Bell, LogOut, User as UserIcon, Check
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = JSON.parse(__firebase_config || '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function App() {
  // 側邊欄收合狀態 (預設 false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 設定選單開啟狀態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // 語言選單開啟狀態
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  // 主題選單開啟狀態
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  
  // 目前語言: 'zh-TW' | 'en-US'
  const [language, setLanguage] = useState('zh-TW');
  // 目前主題: 'default' | 'business' | 'cyberpunk'
  const [theme, setTheme] = useState('default');

  // 預設打開就看到 NodeX
  const [activePage, setActivePage] = useState('nodex');
  
  // 使用者狀態
  const [user, setUser] = useState(null);

  // 翻譯字典
  const translations = {
    'zh-TW': {
      newChat: '開啟新對話',
      tempChat: '臨時對話',
      settings: '設定',
      activity: '活動紀錄',
      scheduled: '排定的動作',
      theme: '主題',
      themeDefault: '深夜',
      themeBusiness: '商務',
      themeCyberpunk: '霓虹', 
      language: '語言',
      manageSub: '管理訂閱項目',
      upgradeMaster: '升級至 Master',
      feedback: '提供意見',
      help: '說明',
      login: '登入帳號',
      logout: '登出',
      pulse: 'Pulse',
      space: 'Space',
      nodex: 'NodeX'
    },
    'en-US': {
      newChat: 'New Chat',
      tempChat: 'Temporary Chat',
      settings: 'Settings',
      activity: 'Activity',
      scheduled: 'Scheduled Actions',
      theme: 'Theme',
      themeDefault: 'Dark',
      themeBusiness: 'Business ',
      themeCyberpunk: 'Neon',
      language: 'Language',
      manageSub: 'Manage Subscription',
      upgradeMaster: 'Upgrade to Master',
      feedback: 'Send Feedback',
      help: 'Help',
      login: 'Sign In',
      logout: 'Log Out',
      pulse: 'Pulse',
      space: 'Space',
      nodex: 'NodeX'
    }
  };

  const t = translations[language];

  // 主題樣式定義
  const themeStyles = {
    default: {
      appBg: 'bg-[#131314]',
      sidebarBg: 'bg-[#1E1F20]',
      textPrimary: 'text-gray-200',
      textSecondary: 'text-gray-400',
      textHover: 'hover:text-white',
      iconColor: 'text-gray-400',
      buttonHover: 'hover:bg-[#333537]',
      primaryBtnBg: 'bg-[#1A1A1C]',
      primaryBtnHover: 'hover:bg-[#28292C]',
      gridBtnBgOpen: 'bg-[#28292C]/40',
      popupBg: 'bg-[#2B2C2E]',
      popupBorder: 'border-[#444]',
      separator: 'bg-[#444]',
      userBlockBg: 'bg-[#28292C]/50',
      userBlockBorder: 'border-[#333]',
      activeItemBg: 'bg-[#28292C]',
      loginBorder: 'border-gray-700 hover:border-gray-500',
      logoText: 'text-[#C4C7C5] font-bold tracking-tight', // 增加 tracking-tight 讓文字更緊湊高級
      // 專案按鈕顏色
      spaceColor: 'text-blue-400',
      spaceHoverBorder: 'group-hover:border-blue-500/30',
      spaceHoverShadow: 'group-hover:shadow-blue-900/20',
      spaceBg: 'bg-gradient-to-br from-blue-900/10 to-transparent',
      pulseColor: 'text-rose-400',
      pulseHoverBorder: 'group-hover:border-rose-500/30',
      pulseHoverShadow: 'group-hover:shadow-rose-900/20',
      pulseBg: 'bg-gradient-to-br from-rose-900/10 to-transparent',
      nodexColor: 'text-emerald-400',
      nodexHoverBorder: 'group-hover:border-emerald-500/30',
      nodexHoverShadow: 'group-hover:shadow-emerald-900/20',
      nodexBg: 'bg-gradient-to-br from-emerald-900/10 to-transparent',
    },
    business: {
      appBg: 'bg-[#f0f2f5]',
      sidebarBg: 'bg-white',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-500',
      textHover: 'hover:text-black',
      iconColor: 'text-gray-600',
      buttonHover: 'hover:bg-gray-100',
      primaryBtnBg: 'bg-gray-100',
      primaryBtnHover: 'hover:bg-gray-200',
      gridBtnBgOpen: 'bg-gray-50',
      popupBg: 'bg-white',
      popupBorder: 'border-gray-200',
      separator: 'bg-gray-200',
      userBlockBg: 'bg-gray-50',
      userBlockBorder: 'border-gray-200',
      activeItemBg: 'bg-gray-100',
      loginBorder: 'border-gray-300 hover:border-gray-400',
      logoText: 'text-gray-800 font-bold tracking-tight',
      // 商務模式下調整專案按鈕顏色以增加對比度
      spaceColor: 'text-blue-600',
      spaceHoverBorder: 'group-hover:border-blue-200',
      spaceHoverShadow: 'group-hover:shadow-blue-200',
      spaceBg: 'bg-blue-50',
      pulseColor: 'text-rose-600',
      pulseHoverBorder: 'group-hover:border-rose-200',
      pulseHoverShadow: 'group-hover:shadow-rose-200',
      pulseBg: 'bg-rose-50',
      nodexColor: 'text-emerald-600',
      nodexHoverBorder: 'group-hover:border-emerald-200',
      nodexHoverShadow: 'group-hover:shadow-emerald-200',
      nodexBg: 'bg-emerald-50',
    },
    cyberpunk: {
      appBg: 'bg-black', // 純黑背景增加對比
      sidebarBg: 'bg-[#050505] border-r border-[#ff00ff]/30 shadow-[4px_0_20px_-5px_rgba(255,0,255,0.2)]', // 微發光的邊框
      textPrimary: 'text-[#ff00ff] drop-shadow-[0_0_2px_rgba(255,0,255,0.8)]', // 霓虹粉文字帶光暈
      textSecondary: 'text-[#00ffff] drop-shadow-[0_0_1px_rgba(0,255,255,0.5)]', // 霓虹青文字
      textHover: 'hover:text-[#ffffff] hover:drop-shadow-[0_0_5px_rgba(255,255,255,1)]',
      iconColor: 'text-[#ff00ff] drop-shadow-[0_0_3px_#ff00ff]', // 圖示發光
      buttonHover: 'hover:bg-[#111] hover:shadow-[inset_0_0_10px_#ff00ff] hover:border hover:border-[#ff00ff]', // 按鈕內發光
      primaryBtnBg: 'bg-[#000] border border-[#00ffff] shadow-[0_0_5px_#00ffff]', // 霓虹青邊框按鈕
      primaryBtnHover: 'hover:bg-[#111] hover:shadow-[0_0_15px_#00ffff]',
      gridBtnBgOpen: 'bg-[#000] border border-[#ff00ff] shadow-[0_0_5px_#ff00ff]',
      popupBg: 'bg-black',
      popupBorder: 'border-[#00ffff] shadow-[0_0_15px_#00ffff]', // 強烈的青色光暈選單
      separator: 'bg-[#00ffff] shadow-[0_0_5px_#00ffff]',
      userBlockBg: 'bg-[#000]',
      userBlockBorder: 'border-[#ff00ff] shadow-[0_0_8px_#ff00ff]', // 粉色光暈邊框
      activeItemBg: 'bg-[#1a1a1a] border-l-2 border-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.3)]',
      loginBorder: 'border-[#00ffff] shadow-[0_0_5px_#00ffff] hover:border-[#ffffff] hover:shadow-[0_0_10px_#ffffff]',
      logoText: 'text-[#00ffff] font-bold tracking-widest drop-shadow-[0_0_5px_#00ffff] font-mono', // 賽博龐克風格 Logo
      
      // 霓虹專案按鈕
      spaceColor: 'text-[#00ffff] drop-shadow-[0_0_3px_#00ffff]', // Neon Cyan
      spaceHoverBorder: 'group-hover:border-[#00ffff]',
      spaceHoverShadow: 'group-hover:shadow-[0_0_20px_#00ffff]',
      spaceBg: 'bg-black',
      
      pulseColor: 'text-[#ff00ff] drop-shadow-[0_0_3px_#ff00ff]', // Neon Pink
      pulseHoverBorder: 'group-hover:border-[#ff00ff]',
      pulseHoverShadow: 'group-hover:shadow-[0_0_20px_#ff00ff]',
      pulseBg: 'bg-black',
      
      nodexColor: 'text-[#00ff00] drop-shadow-[0_0_3px_#00ff00]', // Neon Lime/Green
      nodexHoverBorder: 'group-hover:border-[#00ff00]',
      nodexHoverShadow: 'group-hover:shadow-[0_0_20px_#00ff00]',
      nodexBg: 'bg-black',
    }
  };

  const currentStyle = themeStyles[theme];

  // 監聽登入狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 處理 Google 登入
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // 處理登出
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  
  // 點擊外部關閉設定選單
  const settingsRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
        setIsLangMenuOpen(false); 
        setIsThemeMenuOpen(false); // 重置主題選單
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef]);

  // 自定義 SVG 圖示組件
  const CustomIcons = {
    Workspace: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
    PulseStreet: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    NodeX: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
    MasterStar: () => (
       <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-yellow-400">
         <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
       </svg>
    )
  };

  const projectButtons = [
    { 
      id: 'pulsestreet', 
      label: t.pulse, 
      icon: CustomIcons.PulseStreet, 
      color: currentStyle.pulseColor,
      hoverBorder: currentStyle.pulseHoverBorder,
      hoverShadow: currentStyle.pulseHoverShadow,
      bg: currentStyle.pulseBg
    },
    { 
      id: 'workspace', 
      label: t.space, 
      icon: CustomIcons.Workspace, 
      color: currentStyle.spaceColor, 
      hoverBorder: currentStyle.spaceHoverBorder,
      hoverShadow: currentStyle.spaceHoverShadow,
      bg: currentStyle.spaceBg
    },
    { 
      id: 'nodex', 
      label: t.nodex, 
      icon: CustomIcons.NodeX, 
      color: currentStyle.nodexColor,
      hoverBorder: currentStyle.nodexHoverBorder,
      hoverShadow: currentStyle.nodexHoverShadow,
      bg: currentStyle.nodexBg
    },
  ];

  // 設定選單項目
  const settingsMenuItems = [
    { id: 'activity', icon: History, label: t.activity, separator: true },
    { id: 'scheduled', icon: Clock, label: t.scheduled },
    { id: 'theme', icon: Sun, label: t.theme, isThemeTrigger: true }, // 標記主題觸發器
    { id: 'language', icon: Globe, label: t.language, isLangTrigger: true }, 
    { id: 'manageSub', icon: Info, label: t.manageSub },
    { id: 'upgrade', icon: CustomIcons.MasterStar, label: t.upgradeMaster, special: true },
    { id: 'feedback', icon: MessageSquare, label: t.feedback },
    { id: 'help', icon: HelpCircle, label: t.help, hasSubmenu: true },
  ];

  // 右側主內容：簡易「前端路由」
  const renderMainContent = () => {
    if (activePage === 'pulsestreet') {
      return (
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{t.pulse}</h1>
              <p className="text-xs opacity-70 mt-1">
                市場情緒與討論的 PulseStreet 社群牆（之後可以接你的貼文 feed）。
              </p>
            </div>
            <button
              className={`
                flex items-center gap-2 rounded-full px-3 py-1.5 text-xs
                border border-white/10 hover:border-white/30 hover:bg-white/5
                transition
              `}
            >
              <Plus size={14} />
              <span>發佈貼文</span>
            </button>
          </header>

          <div className="flex-1 overflow-auto px-6 py-4 space-y-4 scrollbar-hide">
            <div className={`rounded-xl border ${currentStyle.popupBorder} ${currentStyle.popupBg} p-4`}>
              <div className="text-xs opacity-60 mb-1">系統訊息</div>
              <div className="text-sm">
                這裡未來可以載入 Firestore 中的 PulseStreet 貼文列表、熱門話題、標籤篩選等元件。
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activePage === 'workspace') {
      return (
        <div className="flex-1 flex flex-col px-6 pt-6 pb-4 overflow-auto scrollbar-hide">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{t.space}</h1>
              <p className="text-xs opacity-70 mt-1">
                Workspace 可以當作畫布／桌面，之後放你的 tools、nodes、layout 控制。
              </p>
            </div>
          </div>

          <div className={`flex-1 min-h-0 rounded-xl border ${currentStyle.popupBorder} ${currentStyle.popupBg} p-4`}>
            <div className="h-full w-full border border-dashed border-white/10 rounded-lg flex items-center justify-center text-xs opacity-70">
              這裡目前是 Workspace 佔位區。未來可以嵌入你原本的 Workspace HTML / React 元件。
            </div>
          </div>
        </div>
      );
    }

    // activePage === 'nodex'
    return (
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{t.nodex}</h1>
            <p className="text-xs opacity-70 mt-1">
               LLM Gateway（NodeX）。
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs opacity-70">
            <span className="hidden sm:inline">Route:</span>
            <span className="px-2 py-1 rounded-full border border-white/10 text-[11px] uppercase tracking-wide">
              Auto · Multi-LLM
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 px-6 py-4 overflow-hidden">
          {/* 左側：聊天區 */}
          <div className={`flex-1 flex flex-col rounded-xl border ${currentStyle.popupBorder} ${currentStyle.popupBg} overflow-hidden`}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px]">
                  NX
                </div>
                <span className="font-medium">NodeX Session</span>
              </div>
              <span className="opacity-60 text-[11px]">status: ready</span>
            </div>

            <div className="flex-1 overflow-auto px-4 py-3 space-y-3 scrollbar-hide text-sm">
              <div className="opacity-70 text-xs mb-2">
                這裡之後可以替換成你原本 `NodeX.html` / React NodeX chat 的渲染區。
              </div>

              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-500/80 flex items-center justify-center text-[10px] font-bold">
                  AI
                </div>
                <div className="rounded-2xl px-3 py-2 text-xs bg-black/20">
                  嗨，我是 NodeX。你可以問我關於金融市場、演算法、SaaS 產品設計⋯⋯之後這裡會接上真正的串流回應。
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center text-[10px] font-bold">
                  U
                </div>
                <div className="rounded-2xl px-3 py-2 text-xs border border-dashed border-white/20 opacity-60">
                  （使用者訊息佔位區）
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 px-4 py-3 flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full bg-black/20">
                <Search size={14} className="opacity-60" />
                <input
                  className="bg-transparent outline-none text-xs flex-1 placeholder:opacity-40"
                  placeholder="問 NodeX 任何金融 / AI / 演算法問題..."
                />
              </div>
              <button
                className="rounded-full px-3 py-2 text-xs border border-white/20 hover:border-white hover:bg-white/10 transition"
              >
                送出
              </button>
            </div>
          </div>

          {/* 右側：模型 / 工具欄 */}
          <div className={`w-full lg:w-80 xl:w-96 rounded-xl border ${currentStyle.popupBorder} ${currentStyle.popupBg} p-4 space-y-3`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Models / Tools</span>
              <span className="opacity-60 text-[11px]">即將支援</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-dashed border-white/15">
                <span className="opacity-80">Gemini 2.5 Pro</span>
                <span className="text-[10px] opacity-60">primary</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-dashed border-white/15">
                <span className="opacity-80">Llama 3 8B</span>
                <span className="text-[10px] opacity-60">fallback</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-dashed border-white/15">
                <span className="opacity-80">Qwen 32B</span>
                <span className="text-[10px] opacity-60">tools</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] opacity-70 leading-relaxed">
              之後你可以把這一整塊換成：
              <br />
              · 真正的 Model Selector
              <br />
              · Agent / Tool Cards
              <br />
              · RouteLLM 配置等設定 UI。
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen ${currentStyle.appBg} ${currentStyle.textPrimary} font-outfit overflow-hidden transition-colors duration-300`}>
      
      {/* 側邊欄 Sidebar */}
      <aside 
        className={`
          flex flex-col
          ${currentStyle.sidebarBg} 
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-[300px]' : 'w-[72px]'}
          border-r border-transparent
          relative
          z-50
        `}
      >
        {/* 頂部區域 */}
        <div className="p-4 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            {/* 漢堡選單按鈕 */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-full ${currentStyle.buttonHover} ${currentStyle.textSecondary} ${currentStyle.textHover} transition-colors`}
            >
              <Menu size={24} />
            </button>

            {/* 公司 Logo (brooklyn-terminal) - 僅在展開時顯示 */}
            {isSidebarOpen && (
              <span className={`text-lg animate-in fade-in duration-300 ${currentStyle.logoText}`}>
                brooklyn-terminal
              </span>
            )}
          </div>

          {/* 新增對話與臨時交談按鈕區域 */}
          <div className={`flex items-center gap-2 transition-all duration-300 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <button 
              className={`
                flex items-center gap-3 
                ${currentStyle.primaryBtnBg} ${currentStyle.primaryBtnHover} 
                ${currentStyle.textSecondary} ${currentStyle.textHover}
                rounded-full p-3 
                transition-all duration-300
                ${isSidebarOpen ? 'flex-1 pl-4' : 'w-10 h-10 justify-center p-0 bg-transparent ' + currentStyle.buttonHover}
              `}
              title={t.newChat}
            >
              <Plus size={20} className={currentStyle.iconColor} />
              {isSidebarOpen && <span className="text-sm font-medium truncate">{t.newChat}</span>}
            </button>

            {isSidebarOpen && (
              <button 
                className={`
                  flex items-center justify-center
                  w-12 h-11
                  rounded-full
                  ${currentStyle.buttonHover}
                  ${currentStyle.textSecondary} ${currentStyle.textHover}
                  transition-colors
                `}
                title={t.tempChat}
              >
                <MessageSquareDashed size={20} />
              </button>
            )}
          </div>

          {/* 三個圓角正方形按鈕區塊 (Grid 佈局) */}
          <div className={`
            transition-all duration-300
            ${isSidebarOpen 
              ? 'grid grid-cols-3 gap-2 w-full' 
              : 'flex flex-col gap-2 items-center mt-2'
            }
          `}>
            {projectButtons.map((btn) => {
              const isActive = activePage === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setActivePage(btn.id)}
                  className={`
                    relative group
                    flex flex-col 
                    rounded-2xl
                    border border-transparent 
                    transition-all duration-300 ease-out
                    ${isSidebarOpen 
                      ? `w-full aspect-square p-2.5 justify-between ${btn.bg} ${currentStyle.gridBtnBgOpen}` 
                      : `w-10 h-10 items-center justify-center p-0 bg-transparent ${currentStyle.buttonHover}`
                    }
                    /* 高級 Hover 效果 */
                    ${isSidebarOpen ? `
                      hover:-translate-y-1 
                      hover:shadow-lg ${btn.hoverShadow}
                      ${btn.hoverBorder}
                      ${currentStyle.buttonHover}
                    ` : ''}
                    ${isActive ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-transparent' : ''}
                  `}
                  title={btn.label}
                >
                  {/* 文字標籤 */}
                  {isSidebarOpen && (
                    <span className={`text-[10px] font-bold tracking-wider ${currentStyle.textSecondary} ${currentStyle.textHover} text-left uppercase transition-colors break-words leading-tight`}>
                      {btn.label}
                    </span>
                  )}

                  {/* 圖示 */}
                  <div className={`
                    transition-all duration-300
                    ${isSidebarOpen ? `self-end ${btn.color} opacity-80 group-hover:opacity-100 group-hover:scale-110` : `${currentStyle.textSecondary} group-hover:${btn.color}`}
                  `}>
                    <btn.icon />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 底部區域：使用者資訊 & 設定 */}
        <div className="mt-auto relative" ref={settingsRef}>
          
          {/* 設定選單 Popup */}
          {isSettingsOpen && (
            <div 
                className={`
                    absolute bottom-full left-12 mb-3 
                    w-[280px] ${currentStyle.popupBg} 
                    rounded-xl shadow-2xl border ${currentStyle.popupBorder}
                    overflow-hidden
                    z-50
                    flex flex-col
                    animate-in fade-in zoom-in-95 duration-200
                `}
            >
                <div className="py-2">
                    {settingsMenuItems.map((item, index) => (
                        <div key={index}>
                            <button 
                              onClick={() => {
                                if (item.isLangTrigger) {
                                  setIsLangMenuOpen(!isLangMenuOpen);
                                  setIsThemeMenuOpen(false);
                                } else if (item.isThemeTrigger) {
                                  setIsThemeMenuOpen(!isThemeMenuOpen);
                                  setIsLangMenuOpen(false);
                                }
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 ${currentStyle.buttonHover} transition-colors text-left group`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={item.special ? "text-yellow-400" : `${currentStyle.textSecondary} ${currentStyle.textHover}`} />
                                    <span className={`text-[13px] ${item.special ? `${currentStyle.textPrimary} font-medium` : `${currentStyle.textPrimary} ${currentStyle.textHover}`}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {(item.isLangTrigger || item.isThemeTrigger) ? (
                                  (item.isLangTrigger && isLangMenuOpen) || (item.isThemeTrigger && isThemeMenuOpen) ? 
                                    <ChevronDown size={14} className={currentStyle.textSecondary} /> : 
                                    <ChevronRight size={14} className={currentStyle.textSecondary} />
                                ) : (
                                  item.hasSubmenu && <ChevronRight size={14} className={currentStyle.textSecondary} />
                                )}
                            </button>
                            
                            {/* 語言子選單 */}
                            {item.isLangTrigger && isLangMenuOpen && (
                              <div className={`${currentStyle.activeItemBg} bg-opacity-50`}>
                                <button 
                                  onClick={() => setLanguage('zh-TW')}
                                  className={`w-full flex items-center justify-between px-4 py-2 pl-12 ${currentStyle.buttonHover} transition-colors text-left`}
                                >
                                  <span className={`text-[13px] ${language === 'zh-TW' ? 'text-blue-400' : currentStyle.textSecondary}`}>中文</span>
                                  {language === 'zh-TW' && <Check size={14} className="text-blue-400" />}
                                </button>
                                <button 
                                  onClick={() => setLanguage('en-US')}
                                  className={`w-full flex items-center justify-between px-4 py-2 pl-12 ${currentStyle.buttonHover} transition-colors text-left`}
                                >
                                  <span className={`text-[13px] ${language === 'en-US' ? 'text-blue-400' : currentStyle.textSecondary}`}>English</span>
                                  {language === 'en-US' && <Check size={14} className="text-blue-400" />}
                                </button>
                              </div>
                            )}

                            {/* 主題子選單 */}
                            {item.isThemeTrigger && isThemeMenuOpen && (
                              <div className={`${currentStyle.activeItemBg} bg-opacity-50`}>
                                <button 
                                  onClick={() => setTheme('default')}
                                  className={`w-full flex items-center justify-between px-4 py-2 pl-12 ${currentStyle.buttonHover} transition-colors text-left`}
                                >
                                  <span className={`text-[13px] ${theme === 'default' ? 'text-blue-400' : currentStyle.textSecondary}`}>{t.themeDefault}</span>
                                  {theme === 'default' && <Check size={14} className="text-blue-400" />}
                                </button>
                                <button 
                                  onClick={() => setTheme('business')}
                                  className={`w-full flex items-center justify-between px-4 py-2 pl-12 ${currentStyle.buttonHover} transition-colors text-left`}
                                >
                                  <span className={`text-[13px] ${theme === 'business' ? 'text-blue-400' : currentStyle.textSecondary}`}>{t.themeBusiness}</span>
                                  {theme === 'business' && <Check size={14} className="text-blue-400" />}
                                </button>
                                <button 
                                  onClick={() => setTheme('cyberpunk')}
                                  className={`w-full flex items-center justify-between px-4 py-2 pl-12 ${currentStyle.buttonHover} transition-colors text-left`}
                                >
                                  <span className={`text-[13px] ${theme === 'cyberpunk' ? 'text-blue-400' : currentStyle.textSecondary}`}>{t.themeCyberpunk}</span>
                                  {theme === 'cyberpunk' && <Check size={14} className="text-blue-400" />}
                                </button>
                              </div>
                            )}

                            {item.separator && <div className={`h-[1px] ${currentStyle.separator} mx-0 my-1`}></div>}
                        </div>
                    ))}
                    
                    {/* 登出按鈕 */}
                    {user && (
                      <>
                        <div className={`h-[1px] ${currentStyle.separator} mx-0 my-1`}></div>
                        <button 
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-4 py-3 ${currentStyle.buttonHover} transition-colors text-left group text-red-400`}
                        >
                          <LogOut size={18} />
                          <span className="text-[13px] font-medium">{t.logout}</span>
                        </button>
                      </>
                    )}
                </div>
            </div>
          )}

          {/* Google 帳號顯示區塊 */}
          <div className="p-3 pb-0">
            {user ? (
              // 已登入狀態
              <div 
                className={`
                  flex items-center gap-2 
                  ${isSidebarOpen ? `justify-between px-2 py-2 ${currentStyle.userBlockBg} rounded-lg border ${currentStyle.userBlockBorder}` : 'justify-center'}
                  transition-all duration-300
                `}
              >
                {/* 左側：頭像與名稱 */}
                <div className={`flex items-center gap-3 overflow-hidden ${isSidebarOpen ? 'flex-1' : ''}`}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className={`w-6 h-6 rounded-full border ${currentStyle.popupBorder}`} />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {user.displayName ? user.displayName[0] : 'U'}
                    </div>
                  )}
                  
                  {isSidebarOpen && (
                    <div className="flex flex-col overflow-hidden">
                      <span className={`text-xs font-medium ${currentStyle.textPrimary} truncate`}>{user.displayName}</span>
                      <span className={`text-[10px] ${currentStyle.textSecondary} truncate`}>{user.email}</span>
                    </div>
                  )}
                </div>

                {/* 右側：SVG 通知按鈕 */}
                {isSidebarOpen && (
                  <button 
                    className={`p-1.5 rounded-full ${currentStyle.textSecondary} ${currentStyle.textHover} ${currentStyle.buttonHover} transition-colors relative`}
                    title="通知"
                  >
                    <Bell size={16} />
                    <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#28292C]"></span>
                  </button>
                )}
              </div>
            ) : (
              // 未登入狀態
              <button 
                onClick={handleGoogleLogin}
                className={`
                  flex items-center gap-3 w-full p-2 rounded-md
                  ${currentStyle.buttonHover} group
                  text-left transition-colors border border-dashed ${currentStyle.loginBorder}
                  ${isSidebarOpen ? 'justify-start' : 'justify-center'}
                `}
                title={t.login}
              >
                <div className={`w-6 h-6 flex items-center justify-center ${currentStyle.activeItemBg} rounded-full`}>
                  <UserIcon size={14} className={`${currentStyle.textSecondary} ${currentStyle.textHover}`} />
                </div>
                {isSidebarOpen && <span className={`text-sm ${currentStyle.textSecondary} ${currentStyle.textHover}`}>{t.login}</span>}
              </button>
            )}
          </div>

          {/* 設定按鈕 */}
          <div className="p-3 border-t border-transparent">
            <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`
                flex items-center gap-3 w-full p-3 rounded-md
                ${currentStyle.buttonHover} group
                text-left transition-colors
                ${isSidebarOpen ? 'justify-start' : 'justify-center'}
                ${isSettingsOpen ? `${currentStyle.activeItemBg} ${currentStyle.textPrimary}` : ''}
                `}
            >
                <Settings size={20} className={`${currentStyle.textSecondary} ${isSettingsOpen ? currentStyle.textPrimary : ''}`} />
                {isSidebarOpen && <span className={`text-sm ${currentStyle.textSecondary} ${currentStyle.textHover}`}>{t.settings}</span>}
            </button>
          </div>
        </div>
        
      </aside>

      {/* 主內容區域（前端路由顯示區） */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {renderMainContent()}
      </main>

      {/* Global Styles & Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .font-outfit {
          font-family: 'Outfit', sans-serif;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
