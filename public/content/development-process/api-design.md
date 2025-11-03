# API 설계 및 버전 관리

API 엔드포인트는 RESTful 원칙을 따라 리소스 중심으로 설계하며, 명사는 복수형을 사용하고 동사 사용은 지양합니다.

- 좋은 예: `GET /users/{id}`, `POST /posts`
- 나쁜 예: `GET /getUserInfo`, `POST /createNewPost`

API 버전 관리는 URL 경로에 `v1`, `v2` 등을 포함하여 명시적으로 관리합니다. (예: `/api/v1/users`)

# API 응답 형식

API 응답은 HTTP 상태 코드를 적극적으로 활용하여 요청의 결과를 나타냅니다.

**성공 시 (2xx)**: 요청이 성공적으로 처리되었을 경우, 응답 본문(Body)에는 순수한 데이터 객체(DTO)를 반환합니다. 별도의 래퍼(Wrapper) 객체로 감싸지 않습니다.

**실패 시 (4xx, 5xx)**: 요청 처리 중 오류가 발생했을 경우, 명확한 HTTP 상태 코드와 함께 RFC 7807 표준을 따르는 `ProblemDetail` 형식의 에러 정보를 본문에 반환합니다. 우리 서비스의 실제 실패 응답 예시는 다음과 같습니다.

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "ID '999'에 해당하는 회원을 찾을 수 없습니다.",
  "instance": "/api/v1/members/999",
  "code": "MEM_001"
}
```

- `status`: HTTP 상태 코드입니다.
- `detail`: 에러에 대한 상세 메시지입니다.
- `instance`: 요청이 발생한 경로입니다.
- `code`: 우리가 정의한 별도의 비즈니스 에러 코드입니다.

# 에러 코드 명세

예측 가능한 비즈니스 예외 상황에 대해서는 별도의 에러 코드를 정의하여 사용합니다. 에러 코드는 도메인을 나타내는 **영문 대문자 접두사**, **언더스코어(\_)**, 그리고 **세 자리 숫자**를 조합하여 만듭니다.

실제 우리 서비스의 `Member` 도메인에서 사용 중인 `MemberErrorCode.java`의 일부입니다.

```java
// kr.it.pullit.modules.member.exception.MemberErrorCode.java
public enum MemberErrorCode implements ErrorCode {
  MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEM_001", "%s '%s'에 해당하는 회원을 찾을 수 없습니다.");
  // ...
}
```

이처럼 `MEM_001` 코드는 `Member` 도메인에서 발생한 첫 번째 에러 유형임을 명확히 나타냅니다.
