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
            
            gameStatus.innerHTML = `<pre>${JSON.stringify(account, null, 2)}</pre>`;

            // token 복사하기 쉽게
            const token = session.token;
            // 토큰 표시 영역 생성
            const tokenDisplay = document.createElement('div');
            tokenDisplay.style.marginTop = '20px';
            tokenDisplay.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="text" 
                           value="Authorization: Bearer ${token}" 
                           readonly 
                           style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                    >
                    <button onclick="(async () => { 
                            await navigator.clipboard.writeText('Authorization: Bearer ${token}');
                            this.textContent = '복사됨!';
                            this.style.background = '#1C1000';
                            setTimeout(() => {
                                this.textContent = '복사';
                                this.style.background = '#4CAF50';
                            }, 1000);
                        })()"
                            style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s;"
                    >
                        복사
                    </button>
                </div>
            `;
            gameStatus.appendChild(tokenDisplay);
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