# 5. Nginx 리버스 프록시

Nginx를 웹 서버로 사용하여 외부 요청을 내부에서 실행 중인 애플리케이션 컨테이너로 전달하는 **리버스 프록시**를 설정합니다. 이를 통해 포트 번호 없이 깔끔한 도메인으로 서비스에 접속할 수 있게 됩니다.

## 1. Nginx 설치

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

## 2. 기본 Nginx 설정

- Nginx 설정 파일은 `/etc/nginx/sites-available/` 디렉터리에 위치합니다.
- 파일을 수정한 후에는 `sites-enabled` 디렉터리에 심볼릭 링크를 생성하여 설정을 활성화합니다.

```bash
# 새로운 설정 파일 생성 (예: myapp.conf)
sudo vi /etc/nginx/sites-available/myapp.conf

# sites-enabled에 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/myapp.conf /etc/nginx/sites-enabled/

# Nginx 기본 설정 파일 링크는 제거 (충돌 방지)
sudo rm /etc/nginx/sites-enabled/default
```

## 3. HTTP 요청 처리 및 리다이렉션

`http://api-qa.pull.it.kr` (80번 포트)로 들어온 요청을 실제 애플리케이션이 실행되고 있는 포트(예: 8080)로 전달하는 설정입니다.

- `listen 80`: 80번 포트(HTTP)로 들어오는 요청을 처리합니다.
- `server_name`: 요청을 처리할 도메인 이름을 지정합니다.
- `location /`: 해당 경로의 모든 요청을 `proxy_pass`에 지정된 주소로 전달합니다.

```nginx
# /etc/nginx/sites-available/myapp.conf

server {
    listen 80;
    server_name api-qa.pull.it.kr;

    location / {
        # 요청을 백엔드 애플리케이션으로 전달
        proxy_pass http://127.0.0.1:8080;

        # 프록시 관련 헤더 설정 (백엔드에서 클라이언트의 실제 IP 등을 알 수 있도록)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4. 설정 적용

설정 파일을 수정한 후에는 문법 오류가 없는지 확인하고 Nginx를 재시작하여 변경사항을 적용합니다.

```bash
# 설정 파일 문법 검사
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

이제 `http://api-qa.pull.it.kr`로 접속하면 Nginx가 요청을 받아 `http://localhost:8080`으로 실행되고 있는 애플리케이션으로 전달해줍니다. 다음 단계에서는 이 연결을 HTTPS로 암호화하는 방법을 알아봅니다.
