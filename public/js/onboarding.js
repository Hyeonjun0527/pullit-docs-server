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
                        html: `
                        <blockquote>본 문서는 프로젝트의 모든 팀원이 공통으로 준수해야 할 핵심 개발 원칙과 협업 절차를 정의한다. 프론트엔드 및 백엔드 개발자는 각 파트의 상세 가이드를 추가로 숙지해야 한다.</blockquote>
                        <p>Pullit 팀에 오신 것을 환영합니다! 이 문서는 새로운 팀원들이 우리 팀의 문화, 개발 프로세스, 기술 표준을 빠르고 쉽게 이해할 수 있도록 돕기 위해 만들어졌습니다. 왼쪽 메뉴를 통해 Pullit의 일하는 방식을 알아보세요.</p>
                    `
                    },
                    philosophy: {
                        title: '개발 철학: 모든 행위에는 의도가 있어야 한다',
                        html: `
                        <p>우리 팀의 가장 중요한 개발 철학은 <strong>"모든 행위에 의도가 있어야 한다"</strong>는 것입니다.</p>
                        <p>이 철학은 특히 Git 커밋 전략에 직접적으로 적용됩니다. 우리는 <code>feat</code>, <code>fix</code>, <code>docs</code>와 같이 단순히 작업의 유형을 나타내는 커밋 메시지 컨벤션을 사용하지 않습니다. 왜냐하면 "나중에 feat 커밋만 모아보거나, fix 커밋만 따로 볼 일이 있을까?"라는 질문에 "아니오"라고 답했기 때문입니다.</p>
                        <p>대신, 우리의 모든 커밋은 <strong>추적 가능한 '요구사항'에 대한 결과물</strong>이어야 합니다. 과거의 코드를 다시 확인해야 할 때 중요한 것은 '기능 추가'라는 유형이 아니라, '어떤 요구사항을 해결하기 위한 코드였는가'입니다. 따라서 우리는 모든 커밋 메시지를 <code>btsk-요구사항번호</code>로 시작하여 그 의도를 명확히 드러냅니다.</p>
                    `
                    },
                    maintainers: {
                        title: 'Maintainers',
                        html: `
                        <p>
                            <a href="https://github.com/xqqldir"><img src="https://img.shields.io/badge/Github-xqqldir-yellow" alt="Static Badge"/></a>
                            <a href="https://github.com/Hyeonjun0527"><img src="https://img.shields.io/badge/Github-Hyeonjun0527-green" alt="Static Badge"/></a>
                            <a href="https://github.com/flareseek"><img src="https://img.shields.io/badge/Github-flareseek-orange" alt="Static Badge"/></a>
                        </p>
                    `
                    },
                    'git-convention': {
                        title: 'Git 컨벤션',
                        html: `
                        <h4>브랜치 전략</h4>
                        <p>우리 팀은 아래와 같은 GitFlow 기반의 브랜치 전략을 사용합니다.</p>
                        <pre><code class="mermaid">
                          gitGraph
                          commit id: "init"
                          branch develop
                          checkout develop
                          commit id: "dev init"
                          branch author/btsk-80/feat-login
                          commit id: "feat: login"
                          checkout develop
                          merge author/btsk-80/feat-login id: "btsk-80: 로그인 기능 구현"
                          branch release/yyyy-mm-dd
                          commit id: "snapshot"
                          checkout develop
                          commit id: "dev"
                          branch refactor
                          commit id: "refactor"
                          checkout develop
                          merge refactor id:"refactor merge"
                          checkout main
                          merge release/yyyy-mm-dd id:"release merge"
                          checkout develop
                        </code></pre>
                        
                        <h4>브랜치 종류</h4>
                        <ul>
                            <li><code>main</code>: 배포 이력을 관리하는 브랜치입니다. (태그/릴리스 전용)</li>
                            <li><code>develop</code>: 모든 기능 브랜치가 통합되고 검증되는 통합 브랜치입니다.</li>
                            <li><code>release/yyyy-mm-dd</code>: 배포를 위한 스냅샷 브랜치입니다. 카카오 테크 캠퍼스 정책에 따라 \`develop\`의 내용을 \`main\`으로 반영할 때 사용하지만, 실제 서버 배포는 \`develop\` 브랜치를 기준으로 진행됩니다.</li>
                            <li><code>refactor/*</code>: 코드 리팩토링 전용 브랜치입니다.</li>
                            <li><code>author/요구사항번호/타입-요약</code>: 핵심 기능 개발 브랜치입니다. 요구사항 번호(예: btsk-80)를 반드시 포함해야 합니다. (예: <code>flareseek/btsk-80/feat-social-login</code>)</li>
                        </ul>

                        <h4>커밋 메시지</h4>
                        <p>우리 팀의 커밋 메시지 규칙은 단순하지만 명확합니다. <strong><code>요구사항번호: 작업내용</code></strong> 형식을 따릅니다.</p>
                        <blockquote>
                            <p><strong>왜 이 방식을 고수하는가?</strong><br>
                            <code>btsk-</code>가 포함된 커밋은 '해당 요구사항이 반영된, 잘 작동하는 서버'임을 보증하는 단위입니다. 만약 수백 개의 <code>feat</code>, <code>docs</code>, <code>style</code> 커밋이 섞여 있다면, 문제가 발생했을 때 어느 지점으로 돌아가야 할지 판단하기 매우 어렵습니다. 하지만 요구사항 번호로 커밋이 정리되어 있으면, 특정 기능이 추가되기 전의 안정적인 상태로 즉시 <code>reset</code>하는 것이 가능해집니다. 모든 커밋에 '추적 가능한 의도'를 부여하는 것이 핵심입니다.</p>
                        </blockquote>
                        <ul>
                            <li>좋은 예: <code>btsk-80: 소셜 로그인 기능 구현</code></li>
                            <li>나쁜 예: <del><code>로그인 기능 구현</code></del>, <del><code>feat: 로그인 기능</code></del></li>
                        </ul>
                        
                        <h4>풀리퀘스트 (PR) 및 머지 방식</h4>
                        <p>모든 작업 브랜치는 <code>develop</code> 브랜치로 PR(Pull Request)을 통해 머지됩니다.</p>
                        <ul>
                            <li>PR 제목은 <code>요구사항번호: 작업내용</code> 형식으로 명확하게 작성합니다. (예: <code>btsk-80: 소셜 로그인 기능 구현</code>)</li>
                            <li>모든 PR은 최소 1명 이상의 팀원에게 리뷰 및 승인을 받아야 합니다.</li>
                            <li>PR을 머지할 때는 **Squash and Merge** 방식을 사용합니다. 이를 통해 작업 브랜치의 여러 커밋들이 PR 제목을 커밋 메시지로 하는 단일 커밋으로 합쳐져 <code>develop</code> 브랜치에 반영됩니다. 따라서 PR 제목을 컨벤션에 맞게 명확히 작성하는 것이 매우 중요합니다.</li>
                        </ul>
                    `
                    },
                    'api-design': {
                        title: 'API 설계',
                        html: `
                        <h4>API 설계 및 버전 관리</h4>
                        <p>API 엔드포인트는 RESTful 원칙을 따라 리소스 중심으로 설계하며, 명사는 복수형을 사용하고 동사 사용은 지양합니다.</p>
                        <ul>
                            <li>좋은 예: <code>GET /users/{id}</code>, <code>POST /posts</code></li>
                            <li>나쁜 예: <del><code>GET /getUserInfo</code></del>, <del><code>POST /createNewPost</code></del></li>
                        </ul>
                        <p>API 버전 관리는 URL 경로에 <code>v1</code>, <code>v2</code> 등을 포함하여 명시적으로 관리합니다. (예: <code>/api/v1/users</code>)</p>

                        <h4>API 응답 형식</h4>
                        <p>API 응답은 HTTP 상태 코드를 적극적으로 활용하여 요청의 결과를 나타냅니다.</p>
                        <ul>
                            <li><strong>성공 시 (2xx)</strong>: 요청이 성공적으로 처리되었을 경우, 응답 본문(Body)에는 순수한 데이터 객체(DTO)를 반환합니다. 별도의 래퍼(Wrapper) 객체로 감싸지 않습니다.</li>
                            <li><strong>실패 시 (4xx, 5xx)</strong>: 요청 처리 중 오류가 발생했을 경우, 명확한 HTTP 상태 코드와 함께 아래와 같이 일관된 형식의 에러 정보를 본문에 반환합니다.</li>
                        </ul>
                        <pre><code>
{
  "timestamp": "2025-08-20T10:30:00.123Z",
  "status": 404,
  "error": "Not Found",
  "code": "U001",
  "message": "해당 사용자를 찾을 수 없습니다.",
  "path": "/api/v1/users/999"
}
                        </code></pre>
                        
                        <h4>에러 코드 명세</h4>
                        <p>예측 가능한 비즈니스 예외 상황에 대해서는 별도의 에러 코드를 정의하여 사용합니다. 에러 코드는 도메인을 나타내는 알파벳과 숫자를 조합하여 <code>도메인코드+숫자</code> 형식으로 만듭니다. (예: U001 - User, P002 - Post)</p>
                    `
                    },
                    'deploy-overview': {
                        title: '배포 개요: EC2 무빌드 배포 시스템',
                        html: `
                        <p>우리 팀은 **"EC2에서는 빌드하지 않고, 실행만 한다"**는 원칙을 따르는 '무빌드(No-Build) 배포 시스템'을 구축했습니다. 이 방식은 EC2 서버의 리소스를 절약하고, 배포 속도를 획기적으로 향상시키며, 보안을 강화하는 이점이 있습니다.</p>
                        <h4>배포 흐름</h4>
                        <pre><code>
로컬 환경: 빌드 담당 (무거운 작업)
     ↓
Docker Hub: 빌드된 이미지 저장소
     ↓
EC2 서버: 이미지 PULL 후 실행만 담당 (가벼운 작업)
                        </code></pre>
                        <h4>핵심 이점</h4>
                         <ul>
                            <li><strong>EC2 리소스 절약</strong>: 서버 내에서 직접 코드를 빌드하지 않으므로 CPU와 메모리 사용량을 최소화할 수 있습니다.</li>
                            <li><strong>배포 속도 향상</strong>: 이미 빌드된 Docker 이미지를 가져와 실행하기만 하면 되므로 배포 과정이 매우 빠릅니다.</li>
                            <li><strong>보안성 강화</strong>: EC2 서버에 JDK, Gradle 등 빌드와 관련된 도구를 설치할 필요가 없어 공격 노출 지점을 줄일 수 있습니다.</li>
                        </ul>
                    `
                    },
                    'deploy-ec2-setup': {
                        title: '1. EC2 서버 초기 설정',
                        html: `
                        <p>새로운 Ubuntu EC2 인스턴스를 생성한 후, 아래의 스크립트를 실행하여 개발 및 배포에 필요한 기본 환경을 자동으로 구성합니다. 이 스크립트는 Zsh, Oh My Zsh, Docker, Docker Compose 등을 설치하고 기본 설정을 완료합니다.</p>
                        <h4>Ubuntu (EC2) 자동 설치/설정 스크립트</h4>
                        <pre><code class="language-bash">
# ==== Ubuntu (EC2) 자동 설치/설정 스크립트 ====
set -euxo pipefail

# 0) 기본 패키지
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \\
  ca-certificates curl zsh git htop maven

# ... (스크립트 내용 생략) ...

exec zsh -l
                        </code></pre>
                    `
                    },
                    'code-convention': {
                        title: '코딩 컨벤션',
                        html: `
                        <p>우리 팀의 모든 Java 코드는 <a href="https://google.github.io/styleguide/javaguide.html" target="_blank">Google Java Style Guide</a>를 따릅니다.</p>
                        <p>모든 팀원은 아래의 개발 환경 설정을 통해 코드 스타일이 자동으로 적용되도록 해야 합니다.</p>
                    `
                    },
                     'environment-setup': {
                        title: '개발 환경 설정 (IntelliJ 기준)',
                        html: `
                        <h4>Checkstyle</h4>
                        <ol>
                            <li>Marketplace에서 <code>Checkstyle-IDEA</code> 플러그인을 설치합니다.</li>
                            <li>Settings > Tools > Checkstyle 로 이동합니다.</li>
                            <li>Configuration File 항목에서 '+' 버튼을 클릭합니다.</li>
                            <li>'Use a local check configuration file'을 선택하고, 프로젝트 내 <code>config/checkstyle/google_checks.xml</code> 파일을 선택합니다.</li>
                            <li>Description에 'Google Style - custom'을 입력하고 설정을 완료합니다.</li>
                        </ol>

                        <h4>Google Java Format</h4>
                        <ol>
                            <li>Marketplace에서 <code>google-java-format</code> 플러그인을 설치합니다.</li>
                            <li><code>Help > Edit Custom VM Options</code> 메뉴를 엽니다.</li>
                            <li>기존 내용 하단에 아래 내용을 추가합니다.</li>
                        </ol>
                        <pre><code>
--add-exports=jdk.compiler/com.sun.tools.javac.api=ALL-UNANMED
--add-exports=jdk.compiler/com.sun.tools.javac.code=ALL-UNANMED
--add-exports=jdk.compiler/com.sun.tools.javac.file=ALL-UNANMED
--add-exports=jdk.compiler/com.sun.tools.javac.parser=ALL-UNANMED
--add-exports=jdk.compiler/com.sun.tools.javac.tree=ALL-UNANMED
--add-exports=jdk.compiler/com.sun.tools.javac.util=ALL-UNANMED
                        </code></pre>
                        <p><em>참조: <a href="https://github.com/google/google-java-format/blob/master/README.md#intellij-jre-config" target="_blank">Official Guide</a></em></p>
                    `
                    },
                    'team-resources': {
                        title: '팀 프로젝트 페이지',
                        html: `
                        <p>우리 팀의 모든 프로젝트 관리와 문서화는 아래 Notion 페이지를 중심으로 이루어집니다.</p>
                        <p><a href="https://www.notion.so/pullit/2-245c61d733498000a869fc6fb977d52e?p=255c61d733498052b394fe84e3dbc1e0&pm=s" target="_blank">강원대 2팀 프로젝트 페이지 바로가기</a></p>
                        <p>이 페이지에서는 다음의 정보들을 확인할 수 있습니다.</p>
                        <ul>
                            <li><strong>캘린더 및 칸반 보드</strong>: 팀의 전체 일정을 관리하고, 주차별 목표와 진행 상황을 시각적으로 파악할 수 있습니다.</li>
                            <li><strong>To-Do-List 및 목표</strong>: 스프린트별 상세 과제와 목표를 관리하는 공간입니다.</li>
                            <li><strong>설계 문서</strong>: 화면 설계, API 명세, 요구사항 정의서 등 프로젝트의 핵심 설계 자산이 모두 모여있습니다.</li>
                            <li><strong>스프린트 백로그</strong>: Jira와 유사한 형태로, 각 백엔드 작업(BTSK-XX)의 담당자, 상태, 진행 주차 등을 상세하게 추적하고 관리합니다.</li>
                            <li><strong>기술 블로그</strong>: 개발 과정에서 발생한 이슈 해결 경험, 새로운 기술 학습 내용 등 팀의 기술적 자산을 축적하는 공간입니다.</li>
                        </ul>
                    `
                    }
                }
            }
        },
        methods: {
            showSection(sectionId) {
                this.activeSection = sectionId;
                window.location.hash = sectionId;
                this.closeAllDropdowns();
                
                this.$nextTick(() => {
                    if (document.querySelector('.mermaid')) {
                        mermaid.run();
                    }
                    // Re-initialize Lucide icons after content change
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                });
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
                this.activeSection = hash;
            } else {
                this.activeSection = 'introduction';
            }
            
            this.$nextTick(() => {
                mermaid.run();
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
