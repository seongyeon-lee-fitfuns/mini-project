# Nakama Game Client

Nakama 서버와 통신하는 JavaScript 기반 게임 클라이언트입니다.

## 설치 방법

1. 프로젝트 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm start
```

3. 프로덕션 빌드:
```bash
npm run build
```

## 설정

- Nakama 서버 주소와 포트는 `src/index.js` 파일에서 설정할 수 있습니다.
- 기본 설정:
  - 서버 주소: 127.0.0.1
  - 포트: 7350
  - SSL: 비활성화

## 기능

- 사용자 인증 (이메일/비밀번호)
- 세션 관리
- 계정 정보 조회

## 주의사항

- Nakama 서버가 실행 중이어야 합니다.
- 실제 배포 시에는 SSL을 활성화하는 것이 좋습니다. 