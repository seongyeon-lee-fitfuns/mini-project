# Nakama 채팅 클라이언트

Heroic Labs의 Nakama 게임 서버를 활용한 멀티플랫폼 채팅 클라이언트입니다. 이 클라이언트는 룸 채팅, 그룹 채팅, 다이렉트 메시지 등 Nakama에서 지원하는 모든 채팅 타입을 지원합니다.

## 기능

- 사용자 인증 (이메일/비밀번호)
- 채팅 타입
  - 룸 채팅 (Room): 임시 채팅방
  - 그룹 채팅 (Group): 그룹 내의 채팅
  - 다이렉트 메시지 (Direct): 1:1 개인 메시지
- 채팅 기능
  - 메시지 전송 및 수신
  - 메시지 히스토리 조회
  - 실시간 참여/퇴장 알림
  - 채널 생성 및 참여
  - 사용자 검색

## 설치 및 실행

### 필수 요구사항

- Node.js (14.x 이상)
- npm 또는 yarn
- Nakama 서버 (로컬 또는 원격)

### 서버 설정

Nakama 서버가 필요합니다. Docker를 사용하여 로컬에서 실행하거나 클라우드 제공업체를 통해 호스팅된 Nakama 서버를 사용할 수 있습니다.

로컬에서 Docker로 Nakama 서버를 실행하는 방법:

```bash
docker-compose up
```

### 클라이언트 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/yourusername/nakama-chat-client.git
cd nakama-chat-client
```

2. 의존성 설치

```bash
npm install
```

3. 서버 설정 변경 (필요한 경우)

`src/services/nakamaService.js` 파일에서 서버 정보를 수정합니다:

```javascript
// Nakama 서버 설정
this.serverUrl = 'http://localhost'; // 실제 서버 URL로 변경
this.serverPort = '7350';
this.serverKey = 'defaultkey'; // 실제 서버 키로 변경
```

4. 개발 서버 실행

```bash
npm start
```

5. 브라우저로 접속

```
http://localhost:1234
```

## 사용법

1. 로그인 또는 회원가입
   - 이메일과 비밀번호를 입력하여 로그인
   - 계정이 없는 경우 자동으로 회원가입됨

2. 채팅 타입 선택
   - 룸 채팅: 임시 채팅방
   - 그룹 채팅: 영구적인 그룹 채팅
   - 다이렉트 메시지: 사용자 간 1:1 대화

3. 채팅방 생성/참여
   - 룸/그룹: 이름을 입력하고 생성 버튼 클릭
   - 다이렉트: 사용자 검색 후 선택

4. 메시지 전송
   - 하단 입력창에 메시지 입력 후 엔터 또는 전송 버튼 클릭

## 개발 정보

- 프론트엔드: 순수 JavaScript, HTML, CSS
- 번들러: Parcel
- Nakama 클라이언트: @heroiclabs/nakama-js
- WebSocket: @heroiclabs/nakama-js-protobuf

## 커스터마이징

서버 URL, 포트, 키 등의 설정은 `src/services/nakamaService.js` 파일에서 변경할 수 있습니다.

## 라이선스

MIT 라이선스 