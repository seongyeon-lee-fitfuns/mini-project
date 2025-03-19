import { Client } from '@heroiclabs/nakama-js';

// Nakama 서버 설정
const client = new Client("defaultkey", "127.0.0.1", 7350);
client.ssl = false;

// DOM 요소
const loginBtn = document.getElementById('loginBtn');
const gameStatus = document.getElementById('gameStatus');

// 디바이스 ID 생성 함수
function generateDeviceId() {
    // 브라우저의 localStorage에서 기존 deviceId 확인
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        // 새로운 deviceId 생성 (예: timestamp + 랜덤 문자열)
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(7);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

// 로그인 처리
async function handleLogin() {
    try {
        const deviceId = generateDeviceId();
        
        // deviceId로 인증
        const session = await client.authenticateDevice(deviceId);
        
        if (session) {
            gameStatus.textContent = "로그인 성공!";
            gameStatus.style.color = "green";
            
            // 사용자 정보 가져오기
            const account = await client.getAccount(session);
            console.log("계정 정보:", account);
            
            // 사용자 정보를 화면에 표시
            const userInfo = `
                사용자 ID: ${account.user.id}
                사용자 이름: ${account.user.username || '미설정'}
                생성일: ${new Date(account.created_at).toLocaleString()}
            `;
            gameStatus.innerHTML = `<pre>${JSON.stringify(account, null, 2)}</pre>`;
            
            // 여기에 게임 로직 추가
        }
    } catch (error) {
        gameStatus.textContent = `로그인 실패: ${error.message}`;
        gameStatus.style.color = "red";
    }
}

// 이벤트 리스너 등록
loginBtn.addEventListener('click', handleLogin);

// Enter 키로도 로그인 가능하도록 설정
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
}); 