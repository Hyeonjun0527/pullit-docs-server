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
                navigation: [
                    {
                        name: '개요',
                        icon: 'rocket',
                        items: [
                            { id: 'introduction', title: '문서 개요', icon: 'book-open' },
                            { id: 'philosophy', title: '개발 철학', icon: 'lightbulb' },
                            { id: 'maintainers', title: 'Maintainers', icon: 'users' }
                        ]
                    },
                    {
                        name: '개발 프로세스',
                        icon: 'settings',
                        items: [
                            { id: 'git-convention', title: 'Git 컨벤션', icon: 'git-branch' },
                            { id: 'api-design', title: 'API 설계', icon: 'code' }
                        ]
                    },
                    {
                        name: '배포 프로세스',
                        icon: 'upload',
                        items: [
                            { id: 'deploy-overview', title: '배포 개요', icon: 'info' },
                            { id: 'deploy-ec2-setup', title: '1. EC2 서버 설정', icon: 'server' },
                            { id: 'deploy-docker-build', title: '2. Docker 빌드 전략', icon: 'package' },
                            { id: 'deploy-docker-compose', title: '3. EC2 컨테이너 실행', icon: 'play' },
                            { id: 'deploy-dns', title: '4. DNS 및 도메인 연결', icon: 'globe' },
                            { id: 'deploy-nginx', title: '5. Nginx 리버스 프록시', icon: 'shield' },
                            { id: 'deploy-https', title: '6. HTTPS 적용', icon: 'lock' }
                        ]
                    },
                    {
                        name: '기술 표준',
                        icon: 'file-text',
                        items: [
                            { id: 'code-convention', title: '코딩 컨벤션', icon: 'code-2' },
                            { id: 'environment-setup', title: '개발 환경 설정', icon: 'monitor' }
                        ]
                    },
                    {
                        name: '팀 리소스',
                        icon: 'folder',
                        items: [
                            { id: 'team-resources', title: '팀 프로젝트 페이지', icon: 'external-link' }
                        ]
                    }
                ],
                sections: {
                    introduction: {
                        title: '👋 환영합니다!',
                        markdownUrl: '/content/introduction.md',
                        markdown: '',
                        loaded: false
                    },
                    philosophy: {
                        title: '개발 철학: 모든 행위에는 의도가 있어야 한다',
                        markdownUrl: '/content/philosophy.md',
                        markdown: '',
                        loaded: false
                    },
                    maintainers: {
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
                    },
                    'git-convention': {
                        title: 'Git 컨벤션',
                        markdownUrl: '/content/git-convention.md',
                        markdown: '',
                        loaded: false
                    },
                    'api-design': {
                        title: 'API 설계',
                        markdownUrl: '/content/api-design.md',
                        markdown: '',
                        loaded: false
                    },
                    'deploy-overview': {
                        title: '배포 개요: EC2 무빌드 배포 시스템',
                        markdownUrl: '/content/deploy-overview.md',
                        markdown: '',
                        loaded: false
                    },
                    'deploy-ec2-setup': {
                        title: '1. EC2 서버 초기 설정',
                        markdownUrl: '/content/deploy-ec2-setup.md',
                        markdown: '',
                        loaded: false
                    },
                    'deploy-docker-build': {
                        title: '2. Docker 빌드 전략',
                        markdown: `(내용 추가 예정)`
                    },
                    'deploy-docker-compose': {
                        title: '3. EC2 컨테이너 실행',
                        markdown: `(내용 추가 예정)`
                    },
                    'deploy-dns': {
                        title: '4. DNS 및 도메인 연결',
                        markdown: `(내용 추가 예정)`
                    },
                    'deploy-nginx': {
                        title: '5. Nginx 리버스 프록시',
                        markdown: `(내용 추가 예정)`
                    },
                    'deploy-https': {
                        title: '6. HTTPS 적용',
                        markdown: `(내용 추가 예정)`
                    },
                    'code-convention': {
                        title: '코딩 컨벤션',
                        markdownUrl: '/content/code-convention.md',
                        markdown: '',
                        loaded: false
                    },
                     'environment-setup': {
                        title: '개발 환경 설정 (IntelliJ 기준)',
                        markdownUrl: '/content/environment-setup.md',
                        markdown: '',
                        loaded: false
                    },
                    'team-resources': {
                        title: '팀 프로젝트 페이지',
                        markdownUrl: '/content/team-resources.md',
                        markdown: '',
                        loaded: false
                    }
                }
            }
        },
        methods: {
            async showSection(sectionId) {
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
                window.location.hash = sectionId;
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
                if (typeof mermaid !== 'undefined') {
                    // 머메이드 다이어그램이 있는지 확인
                    const mermaidElements = document.querySelectorAll('.mermaid');
                    if (mermaidElements.length > 0) {
                        console.log('Found mermaid elements:', mermaidElements.length);
                        mermaid.run();
                    } else {
                        console.log('No mermaid elements found');
                    }
                } else {
                    console.log('Mermaid library not loaded');
                }
            },
            renderMarkdown(markdown) {
                if (typeof marked !== 'undefined') {
                    // 머메이드 코드 블록을 div.mermaid로 변환
                    const processedMarkdown = markdown.replace(/```mermaid\n([\s\S]*?)\n```/g, '<div class="mermaid">$1</div>');
                    return marked.parse(processedMarkdown);
                }
                return markdown; // fallback if marked is not available
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
        mounted() {
            const hash = window.location.hash.substring(1);
            if (this.sections[hash]) {
                this.showSection(hash);
            } else {
                this.showSection('introduction');
            }
            
            this.$nextTick(() => {
                // 머메이드 초기화
                setTimeout(() => {
                    this.initializeMermaid();
                }, 500);
                
                // Initialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });

            window.addEventListener('click', (event) => {
                if (!this.$el.querySelector('.nav-menu').contains(event.target)) {
                    this.closeAllDropdowns();
                }
                
                // Close FAB when clicking outside
                if (!this.$el.querySelector('.fab-container').contains(event.target)) {
                    this.isFabExpanded = false;
                }
            });
        }
    });

    app.mount('#app');
});
