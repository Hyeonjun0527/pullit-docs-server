// Redoc 페이지 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refresh-btn');
    const statusSpan = document.getElementById('status');
    const autoRefreshBtn = document.getElementById('auto-refresh-btn');
    const fabToggle = document.getElementById('fab-toggle');
    const fabMenu = document.getElementById('fab-menu');
    let isRefreshing = false;
    let autoRefreshInterval = null;
    let isFabExpanded = false;
    let currentETag = null;
    let isAutoRefreshEnabled = false;

    // FAB toggle functionality
    fabToggle.addEventListener('click', () => {
        isFabExpanded = !isFabExpanded;
        fabMenu.classList.toggle('show', isFabExpanded);
        fabToggle.classList.toggle('expanded', isFabExpanded);
    });

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    const SPEC_URL = '/api-docs.yaml';

    function loadDocs() {
        if (isRefreshing) return;
        isRefreshing = true;
        refreshBtn.disabled = true;
        statusSpan.textContent = '페이지 새로고침 중...';
        
        // 페이지를 완전히 새로고침하여 Redoc을 다시 로드합니다.
        window.location.reload();
    }

    // 초기 로드는 Redoc.init을 직접 호출합니다.
    async function initialLoad() {
        statusSpan.textContent = '문서 로딩 중...';

        try {
            const response = await fetch(SPEC_URL);
            if (!response.ok) {
                throw new Error(`API 명세 로드 실패: ${response.statusText}`);
            }
            currentETag = response.headers.get('ETag');
            console.log(`초기 ETag: ${currentETag}`);
        } catch (error) {
            console.error(error);
            statusSpan.textContent = '문서 로드 실패';
            return;
        }

        const redocContainer = document.getElementById('redoc');
        
        Redoc.init(
            SPEC_URL,
            {
                scrollYOffset: 50,
                theme: {
                    colors: {
                        primary: {
                            main: '#7fcdcd',
                            light: '#a8e6cf',
                            dark: '#5fb3b3',
                        },
                    },
                },
            },
            redocContainer,
            () => { // Callback on success
                const now = new Date();
                statusSpan.textContent = `갱신 완료 (${now.toLocaleTimeString()})`;
                
                // Re-initialize Lucide icons after Redoc loads
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        );
    }
    
    async function checkForUpdates() {
        if (!currentETag) return;

        statusSpan.textContent = '변경 사항 확인 중...';
        try {
            const response = await fetch(SPEC_URL, {
                headers: {
                    'If-None-Match': currentETag
                }
            });

            if (response.status === 200) {
                statusSpan.textContent = '새로운 버전 발견! 페이지를 새로고칩니다...';
                window.location.reload();
            } else if (response.status === 304) {
                const now = new Date();
                statusSpan.textContent = `변경 없음 (${now.toLocaleTimeString()})`;
            }
        } catch (error) {
            console.error('업데이트 확인 중 오류:', error);
            statusSpan.textContent = '업데이트 확인 실패';
        }
    }

    refreshBtn.addEventListener('click', loadDocs);

    autoRefreshBtn.addEventListener('click', () => {
        isAutoRefreshEnabled = !isAutoRefreshEnabled; // 상태 토글
        autoRefreshBtn.classList.toggle('active', isAutoRefreshEnabled);

        if (isAutoRefreshEnabled) {
            if (autoRefreshInterval) clearInterval(autoRefreshInterval);
            autoRefreshInterval = setInterval(checkForUpdates, 10000);
            statusSpan.textContent = '자동 갱신 활성화됨';
            checkForUpdates(); // 활성화 시 즉시 확인
        } else {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
            statusSpan.textContent = '자동 갱신 비활성화됨';
        }
    });

    // Initial load
    initialLoad();
});
