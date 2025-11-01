# Insomnia 온보딩 가이드

Pullit 백엔드에 합류했다면, 먼저 팀이 관리하는 Insomnia 워크스페이스를 동기화하고 환경값을 세팅해 두는 것이 API 온보딩의 출발점입니다. 이 문서는 새 동료가 로컬·QA 백엔드를 오가며 요청을 검증할 때 필요한 설치, 환경 구성, 인증서 처리 과정을 순서대로 설명합니다. 프론트도 qa로 요청을 보내 값을 확인하고 테스트할 수 있습니다.

## 1. 왜 Insomnia인가?

| 온보딩 중 겪는 문제 | Insomnia 워크스페이스가 제공하는 해결책 |
| --- | --- |
| 수십 개의 엔드포인트를 직접 만들기 번거롭다 | 팀이 커밋한 워크스페이스를 Pull 하면 폴더 구조, 샘플 요청/응답이 그대로 내려옵니다. |
| 로컬·QA 호출을 번갈아 해야 한다 | Base Environment 안에서 환경별 설정을 한 번만 입력해 두면 드롭다운으로 즉시 전환할 수 있습니다. |
| 공통 헤더·토큰을 매번 붙이기 귀찮다 | 기본 헤더와 보안 토큰을 변수로 관리해 모든 요청에서 자동으로 참조합니다. |
| 신규 기능을 동료에게 빠르게 공유하고 싶다 | 워크스페이스를 업데이트하고 Pull 받도록 안내하면 동일한 테스트 시나리오를 재현할 수 있습니다. |

## 2. 첫 실행과 워크스페이스 동기화

1. Insomnia를 설치 후 실행합니다.
2. 좌측 하단 **Pull** 버튼을 눌러 저장소에 커밋된 공유 워크스페이스를 내려받습니다.
3. 주황색 배지가 보이면 업데이트가 있다는 뜻이므로, PR을 확인한 뒤 주기적으로 Pull 하여 최신 상태를 유지합니다.
4. 워크스페이스가 내려와도 환경값은 비어 있으니, 바로 다음 단계에서 Base Environment를 채워 주세요.

## 3. Base Environment 구조 이해하기

워크스페이스에는 로컬과 QA 환경 설정이 모두 **Base Environment** 안에 포함돼 있으며, 각 Collection은 해당 값을 참조만 합니다. `Manage Environments` 화면에서 아래와 유사한 구조를 확인할 수 있습니다.

```json
{
  "qa": {
    "domain": "https://qa.api.pull.it.kr",
    "auth": {
      "accessToken": "본인의 토큰 값",
      "refreshToken": "본인의 토큰 값"
    }
  },
  "local": {
    "domain": "https://localhost:8080",
    "auth": {
      "accessToken": "1",
      "refreshToken": "1"
    }
  }
}
```

- `domain`: 요청 URL을 구성할 기본 호스트입니다. 각 요청은 `{{ _.local.domain }}` 또는 `{{ _.qa.domain }}` 같은 참조를 사용합니다.
- `auth.accessToken`: Authorization 헤더에 주입되는 값입니다. QA 토큰은 만료 주기가 짧으므로, QA 검증을 시작할 때마다 최신 토큰으로 교체하세요.
- `auth.refreshToken`: QA 계정으로 재발급이 필요할 때 Insomnia 스크립트나 요청에서 사용합니다. 로컬 개발에서는 기본값(`1`)으로 대체 인증을 사용할 수 있습니다.

컬렉션 드롭다운에서 `local` 또는 `qa`를 선택하면, 해당 이름과 일치하는 Base Environment 하위 객체가 병합되어 최종 요청이 완성됩니다.

## 4. 새 동료가 반드시 수행할 초기 설정

1. **Base Environment 템플릿 받기**: 팀 위키나 보안 저장소에서 최신 `base-environment.json`을 다운로드한 뒤, `Manage Environments` > `Import`로 불러옵니다.
2. **로컬 토큰 등록**: 백엔드를 로컬에서 실행한 뒤 로그인하거나 `Authorization: Bearer 1` 우회 헤더를 활용해 토큰을 확보하고 `local.auth.accessToken` 값을 채웁니다.
3. **QA 토큰 주기적 갱신**: QA 계정으로 OAuth 로그인 후 발급받은 토큰을 `qa.auth.accessToken`에 붙여 넣습니다. QA 점검을 시작할 때마다 값이 최신인지 확인하세요.
4. **요청 변수 확인**: 주요 요청은 `{{ _.domain }}`와 `{{ _.auth.accessToken }}`을 참조합니다. 추가 파라미터가 필요하면 Base Environment에 새 속성을 추가하고 요청에서 `{{ _.변수명 }}` 형태로 사용하세요.

## 5. 로컬 HTTPS와 인증서 예외 처리

팀은 프런트엔드/백엔드 모두 `https://localhost`를 기본으로 사용합니다. mkcert로 생성한 자체 서명 인증서를 사용할 때는 Insomnia에서 다음 설정을 적용해 주세요.

1. 메뉴 **Application > Preferences**로 이동합니다.
2. **Request** 탭에서 *Validate certificates* 토글을 비활성화합니다.
3. 로컬 호출에만 예외 처리가 필요한 경우, QA 테스트를 시작하기 전에 다시 활성화해 보안 검증을 유지할 수 있습니다.

## 6. 자주 쓰는 팁

- **환경 전환**: 좌측 상단 드롭다운으로 `local` ↔ `qa`를 즉시 바꿀 수 있습니다.
- **워크스페이스 충돌 해결**: Pull 중 충돌이 나면 워크스페이스를 Export로 백업 후 `Workspace Settings > Reset Workspace`를 실행하고 다시 Pull 합니다.
- **새 엔드포인트 공유**: 요청을 추가한 뒤 PR 설명에 워크스페이스 변경 사실을 남기면, 동료가 Pull 하여 동일한 시나리오를 재현할 수 있습니다.
- **QA 토큰 만료 대응**: QA 토큰이 만료된 응답을 받으면 로그인 페이지에서 새 토큰을 발급받아 Base Environment에 덮어씁니다.
