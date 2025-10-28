새로운 Ubuntu EC2 인스턴스를 생성한 후, 아래의 스크립트를 실행하여 개발 및 배포에 필요한 기본 환경을 자동으로 구성합니다. 이 스크립트는 Zsh, Oh My Zsh, Docker, Docker Compose 등을 설치하고 기본 설정을 완료합니다.

## Ubuntu (EC2) 자동 설치/설정 스크립트

```bash
# ==== Ubuntu (EC2) 자동 설치/설정 스크립트 ====
set -euxo pipefail

# 0) 기본 패키지
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates curl zsh git htop maven

# ... (스크립트 내용 생략) ...

exec zsh -l
```
