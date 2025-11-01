document.addEventListener('DOMContentLoaded', () => {
    const app = Vue.createApp({
        data() {
            return {
                activeSection: 'introduction',
                isDropdownOpen: {},
                isFabExpanded: false,
                isMobileSidebarOpen: false,
                isSidebarCollapsed: false,
                collapsedSections: {},
                navigation: [],
                sections: {}
            }
        },
        methods: {
            async initializeApp() {
                try {
                    const response = await fetch('/navigation.json');
                    if (!response.ok) throw new Error('Navigation config not found');
                    this.navigation = await response.json();
                    
                    this.generateSectionsFromNavigation();

                    const hash = window.location.hash.substring(1);
                    if (this.sections[hash]) {
                        this.showSection(hash, false);
                    } else {
                        this.showSection('introduction', false);
                    }
                } catch (error) {
                    console.error("Failed to initialize the app:", error);
                }
            },
            generateSectionsFromNavigation() {
                const sections = {};
                this.navigation.forEach(menu => {
                    menu.items.forEach(item => {
                        sections[item.id] = {
                            title: item.title,
                            markdownUrl: `/content/${menu.category}/${item.id}.md`,
                            markdown: '',
                            loaded: false
                        };
                    });
                });

                sections['maintainers'] = {
                    title: 'Maintainers',
                    html: `
                        <style>
                            .maintainer-grid {
                                display: grid;
                                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                                gap: 24px;
                                text-align: center;
                            }
                            .maintainer-card {
                                background: #f9fafb;
                                border-radius: 12px;
                                padding: 20px;
                                transition: transform 0.2s ease, box-shadow 0.2s ease;
                            }
                            .maintainer-card:hover {
                                transform: translateY(-5px);
                                box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                            }
                            .maintainer-avatar {
                                width: 100px;
                                height: 100px;
                                border-radius: 50%;
                                margin-bottom: 12px;
                                border: 3px solid #fff;
                                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                            }
                            .maintainer-name {
                                font-weight: 600;
                                font-size: 1.1em;
                                color: #111827;
                            }
                            .maintainer-role {
                                font-size: 0.9em;
                                color: #6b7280;
                                margin-top: 4px;
                            }
                            .maintainer-name-link {
                                text-decoration: none;
                            }
                            .maintainer-link {
                                display: inline-block;
                                margin-top: 8px;
                                text-decoration: none;
                            }
                            .maintainer-section-title {
                                font-size: 1.5em;
                                font-weight: bold;
                                color: #374151;
                                margin-bottom: 20px;
                                padding-bottom: 10px;
                                border-bottom: 2px solid #e5e7eb;
                            }
                        </style>
                        
                        <h4 class="maintainer-section-title">Backend Maintainers</h4>
                        <div class="maintainer-grid">
                            <div class="maintainer-card">
                                <a href="https://github.com/xqqldir" target="_blank">
                                    <img src="https://github.com/xqqldir.png" alt="xqqldir avatar" class="maintainer-avatar">
                                </a>
                                <a href="https://github.com/xqqldir" target="_blank" class="maintainer-name-link">
                                    <div class="maintainer-name">xqqldir</div>
                                </a>
                                <a href="https://github.com/xqqldir" target="_blank" class="maintainer-link">
                                    <img src="https://img.shields.io/badge/GitHub-Profile-blue?logo=github" alt="GitHub Profile"/>
                                </a>
                            </div>
                            <div class="maintainer-card">
                                <a href="https://github.com/Hyeonjun0527" target="_blank">
                                    <img src="https://github.com/Hyeonjun0527.png" alt="Hyeonjun0527 avatar" class="maintainer-avatar">
                                </a>
                                <a href="https://github.com/Hyeonjun0527" target="_blank" class="maintainer-name-link">
                                    <div class="maintainer-name">Hyeonjun0527</div>
                                </a>
                                <div class="maintainer-role">Team Leader</div>
                                <a href="https://github.com/Hyeonjun0527" target="_blank" class="maintainer-link">
                                    <img src="https://img.shields.io/badge/GitHub-Profile-green?logo=github" alt="GitHub Profile"/>
                                </a>
                            </div>
                            <div class="maintainer-card">
                                <a href="https://github.com/flareseek" target="_blank">
                                    <img src="https://github.com/flareseek.png" alt="flareseek avatar" class="maintainer-avatar">
                                </a>
                                <a href="https://github.com/flareseek" target="_blank" class="maintainer-name-link">
                                    <div class="maintainer-name">flareseek</div>
                                </a>
                                <div class="maintainer-role">Backend Leader</div>
                                <a href="https://github.com/flareseek" target="_blank" class="maintainer-link">
                                    <img src="https://img.shields.io/badge/GitHub-Profile-orange?logo=github" alt="GitHub Profile"/>
                                </a>
                            </div>
                        </div>

                        <br/><br/>

                        <h4 class="maintainer-section-title">Frontend Maintainers</h4>
                        <div class="maintainer-grid">
                            <div class="maintainer-card">
                                <a href="https://github.com/anseonghyeon" target="_blank">
                                    <img src="https://github.com/anseonghyeon.png" alt="anseonghyeon avatar" class="maintainer-avatar">
                                </a>
                                <a href="https://github.com/anseonghyeon" target="_blank" class="maintainer-name-link">
                                    <div class="maintainer-name">anseonghyeon</div>
                                </a>
                                <a href="https://github.com/anseonghyeon" target="_blank" class="maintainer-link">
                                    <img src="https://img.shields.io/badge/GitHub-Profile-purple?logo=github" alt="GitHub Profile"/>
                                </a>
                            </div>
                            <div class="maintainer-card">
                                <a href="https://github.com/Changhee-Cho" target="_blank">
                                    <img src="https://github.com/Changhee-Cho.png" alt="Changhee-Cho avatar" class="maintainer-avatar">
                                </a>
                                <a href="https://github.com/Changhee-Cho" target="_blank" class="maintainer-name-link">
                                    <div class="maintainer-name">Changhee-Cho</div>
                                </a>
                                <div class="maintainer-role">Frontend Leader</div>
                                <a href="https://github.com/Changhee-Cho" target="_blank" class="maintainer-link">
                                    <img src="https://img.shields.io/badge/GitHub-Profile-red?logo=github" alt="GitHub Profile"/>
                                </a>
                            </div>
                        </div>
                    `
                };
                
                this.sections = sections;
            },
            async showSection(sectionId, updateHash = true) {
                const section = this.sections[sectionId];
                if (section && section.markdownUrl && !section.loaded) {
                    try {
                        const response = await fetch(section.markdownUrl);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        section.markdown = await response.text();
                        section.loaded = true;
                    } catch (error) {
                        console.error('Error fetching markdown:', error);
                        section.markdown = '콘텐츠를 불러오는 데 실패했습니다.';
                    }
                }

                this.activeSection = sectionId;
                if(updateHash) {
                    window.location.hash = sectionId;
                }
                this.closeAllDropdowns();
                
                this.$nextTick(() => {
                    // 마크다운 렌더링 후 머메이드 다이어그램 처리
                    setTimeout(() => {
                        this.initializeMermaid();
                    }, 200);
                    
                    // Re-initialize Lucide icons after content change
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                });
            },
            initializeMermaid() {
                if (window.mermaid) {
                    const mermaidElements = this.$el.parentElement.querySelectorAll('.main-content .mermaid');
                    
                    window.mermaid.run({
                        nodes: mermaidElements
                    });

                    mermaidElements.forEach(el => {
                        el.ondblclick = () => {
                            const svg = el.querySelector('svg');
                            if (svg) {
                                sessionStorage.setItem('mermaidSVG', svg.outerHTML);
                                window.open('/diagram-viewer.html', '_blank');
                            }
                        };
                        el.style.cursor = 'pointer';
                    });
                }
            },
            
            renderMarkdown(markdown) {
                if (!markdown) return '';
                
                // marked.js 옵션 설정
                const renderer = new marked.Renderer();

                // Mermaid 코드 블록을 그대로 유지 (HTML 변환 방지)
                renderer.code = (code, language) => {
                    if (language === 'mermaid') {
                        const encodedCode = encodeURIComponent(code);
                        return `<div class="mermaid" data-mermaid-code="${encodedCode}">${code}</div>`;
                    }
                    return `<pre><code class="language-${language}">${code}</code></pre>`;
                };
                
                return marked.parse(markdown, { renderer });
            },
            toggleDropdown(menuName) {
                this.isDropdownOpen[menuName] = !this.isDropdownOpen[menuName];
            },
            closeAllDropdowns() {
                for (const key in this.isDropdownOpen) {
                    this.isDropdownOpen[key] = false;
                }
            },
            toggleFab() {
                this.isFabExpanded = !this.isFabExpanded;
            },
            toggleMobileSidebar() {
                this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
            },
            closeMobileSidebar() {
                this.isMobileSidebarOpen = false;
            },
            toggleSidebar() {
                this.isSidebarCollapsed = !this.isSidebarCollapsed;
            },
            handleSectionClick(sectionName) {
                if (this.isSidebarCollapsed) {
                    this.isSidebarCollapsed = false;
                    // 사이드바가 펼쳐지는 애니메이션이 시작된 후
                    // 해당 섹션이 열리도록 nextTick을 사용합니다.
                    this.$nextTick(() => {
                        this.collapsedSections[sectionName] = false;
                    });
                } else {
                    this.collapsedSections[sectionName] = !this.isSectionCollapsed(sectionName);
                }
            },
            isSectionCollapsed(sectionName) {
                return this.collapsedSections[sectionName] || false;
            }
        },
        async mounted() {
            await this.initializeApp();
            
            this.$nextTick(() => {
                // 머메이드 초기화
                setTimeout(() => {
                    this.initializeMermaid();
                }, 500);
                
                // Initialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Attach event listeners after the DOM is fully rendered
                window.addEventListener('click', (event) => {
                    const navMenu = this.$el.parentElement.querySelector('.nav-menu');
                    const fabContainer = this.$el.parentElement.querySelector('.fab-container');

                    if (navMenu && !navMenu.contains(event.target)) {
                        this.closeAllDropdowns();
                    }
                    
                    if (fabContainer && !fabContainer.contains(event.target)) {
                        this.isFabExpanded = false;
                    }
                });
            });
        }
    });

    app.mount('#app');
});
