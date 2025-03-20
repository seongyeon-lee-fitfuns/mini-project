import nakamaService from './services/nakamaService';

// DOM 요소
const elements = {
  // 로그인 관련
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  loginBtn: document.getElementById('login-btn'),
  registerBtn: document.getElementById('register-btn'),
  logoutBtn: document.getElementById('logout-btn'),
  userInfo: document.getElementById('user-info'),
  loggedUser: document.getElementById('logged-user'),
  currentUser: document.getElementById('current-user'),
  chatContainer: document.querySelector('.chat-container'),
  
  // 채팅 탭
  roomTab: document.getElementById('room-tab'),
  groupTab: document.getElementById('group-tab'),
  directTab: document.getElementById('direct-tab'),
  
  // 채팅 섹션
  roomSection: document.getElementById('room-section'),
  groupSection: document.getElementById('group-section'),
  directSection: document.getElementById('direct-section'),
  
  // 룸 채팅
  roomName: document.getElementById('room-name'),
  createRoomBtn: document.getElementById('create-room-btn'),
  roomList: document.getElementById('room-list'),
  
  // 그룹 채팅
  groupName: document.getElementById('group-name'),
  createGroupBtn: document.getElementById('create-group-btn'),
  groupList: document.getElementById('group-list'),
  
  // 다이렉트 채팅
  userSearch: document.getElementById('user-search'),
  searchUserBtn: document.getElementById('search-user-btn'),
  userList: document.getElementById('user-list'),
  
  // 채팅 콘텐츠
  chatHeader: document.getElementById('chat-header'),
  currentChannel: document.getElementById('current-channel'),
  leaveChannelBtn: document.getElementById('leave-channel-btn'),
  messages: document.getElementById('messages'),
  messageInput: document.getElementById('message'),
  sendBtn: document.getElementById('send-btn'),
  
  // 방 불러오기 버튼
  loadRoomsBtn: document.getElementById('load-rooms-btn'),
};

// 현재 채팅 상태
let currentState = {
  channelId: null,
  channelType: null,
  channelName: null
};

// 초기화
function init() {
  // 이벤트 리스너 등록
  addEventListeners();
  
  // Nakama 이벤트 콜백 등록
  setupNakamaCallbacks();
  
  // 자동 로그인 시도 (세션 복원 기능이 필요할 경우)
  // 예: attemptSessionRestore();
}

// 이벤트 리스너 등록
function addEventListeners() {
  // 인증 관련
  elements.loginBtn.addEventListener('click', handleLogin);
  elements.registerBtn.addEventListener('click', handleRegister);
  elements.logoutBtn.addEventListener('click', handleLogout);
  
  // 채팅 탭 전환
  elements.roomTab.addEventListener('click', () => switchChatSection('room'));
  elements.groupTab.addEventListener('click', () => switchChatSection('group'));
  elements.directTab.addEventListener('click', () => switchChatSection('direct'));
  
  // 채널 생성 버튼
  elements.createRoomBtn.addEventListener('click', createRoom);
  elements.createGroupBtn.addEventListener('click', createGroup);
  elements.searchUserBtn.addEventListener('click', searchUsers);
  
  // 메시지 전송
  elements.sendBtn.addEventListener('click', sendMessage);
  elements.messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // 채널 나가기
  elements.leaveChannelBtn.addEventListener('click', leaveCurrentChannel);
  
  // 방 불러오기 버튼
  elements.loadRoomsBtn.addEventListener('click', loadAllRooms);
}

// Nakama 이벤트 콜백 설정
function setupNakamaCallbacks() {
  nakamaService.onChannelMessage = handleChannelMessage;
  nakamaService.onChannelPresence = handleChannelPresence;
  nakamaService.onConnect = () => {
    console.log('WebSocket connected');
    loadAllChannels();
  };
  nakamaService.onDisconnect = () => {
    console.log('WebSocket disconnected');
    showSystemMessage('서버와의 연결이 끊어졌습니다.');
  };
}

// 인증 관련 함수

async function handleLogin() {
  const email = elements.username.value.trim();
  const password = elements.password.value.trim();
  
  if (!email || !password) {
    alert('이메일과 비밀번호를 입력하세요.');
    return;
  }
  
  // 이메일 형식이 아니면 이메일 형식으로 변환 (테스트 용도)
  const emailToUse = email.includes('@') ? email : `${email}@example.com`;
  
  const result = await nakamaService.authenticateEmail(emailToUse, password);
  
  if (result.success) {
    showAuthenticatedUI(result.user);
  } else {
    alert(`로그인 실패: ${result.error}`);
  }
}

async function handleRegister() {
  const email = elements.username.value.trim();
  const password = elements.password.value.trim();
  
  if (!email || !password) {
    alert('이메일과 비밀번호를 입력하세요.');
    return;
  }
  
  // 이메일 형식이 아니면 이메일 형식으로 변환 (테스트 용도)
  const emailToUse = email.includes('@') ? email : `${email}@example.com`;
  
  const result = await nakamaService.authenticateEmail(emailToUse, password, true);
  
  if (result.success) {
    showAuthenticatedUI(result.user);
  } else {
    alert(`회원가입 실패: ${result.error}`);
  }
}

function handleLogout() {
  nakamaService.logout();
  showUnauthenticatedUI();
}

// UI 갱신 함수

function showAuthenticatedUI(user) {
  elements.userInfo.querySelector('input').style.display = 'none';
  elements.userInfo.querySelector('input[type="password"]').style.display = 'none';
  elements.loginBtn.style.display = 'none';
  elements.registerBtn.style.display = 'none';
  elements.loggedUser.style.display = 'inline-block';
  elements.currentUser.textContent = user.username;
  elements.chatContainer.style.display = 'flex';
  
  // 기본 탭은 룸 채팅
  switchChatSection('room');
  
  // 채널 로드
  loadAllChannels();
}

function showUnauthenticatedUI() {
  elements.userInfo.querySelector('input').style.display = 'inline-block';
  elements.userInfo.querySelector('input[type="password"]').style.display = 'inline-block';
  elements.loginBtn.style.display = 'inline-block';
  elements.registerBtn.style.display = 'inline-block';
  elements.loggedUser.style.display = 'none';
  elements.chatContainer.style.display = 'none';
  
  // 상태 초기화
  currentState = {
    channelId: null,
    channelType: null,
    channelName: null
  };
  
  // 입력 필드 초기화
  elements.username.value = '';
  elements.password.value = '';
  elements.messageInput.value = '';
  elements.messages.innerHTML = '';
}

// 채팅 섹션 전환
function switchChatSection(type) {
  // 모든 탭 비활성화
  elements.roomTab.classList.remove('active');
  elements.groupTab.classList.remove('active');
  elements.directTab.classList.remove('active');
  
  // 모든 섹션 숨기기
  elements.roomSection.style.display = 'none';
  elements.groupSection.style.display = 'none';
  elements.directSection.style.display = 'none';
  
  // 선택한 탭 활성화 및 섹션 표시
  switch (type) {
    case 'room':
      elements.roomTab.classList.add('active');
      elements.roomSection.style.display = 'flex';
      break;
    case 'group':
      elements.groupTab.classList.add('active');
      elements.groupSection.style.display = 'flex';
      break;
    case 'direct':
      elements.directTab.classList.add('active');
      elements.directSection.style.display = 'flex';
      break;
  }
}

// 채널 관련 함수

// 모든 채널 목록 로드
function loadAllChannels() {
  loadRooms();
  loadGroups();
  loadDirectChannels();
}

// 룸 채팅방 목록 로드
function loadRooms() {
  const rooms = nakamaService.getJoinedChannels('room');
  renderChannelList(rooms, elements.roomList, 'room');
}

// 그룹 채팅방 목록 로드
function loadGroups() {
  const groups = nakamaService.getJoinedChannels('group');
  renderChannelList(groups, elements.groupList, 'group');
}

// 다이렉트 채팅방 목록 로드
function loadDirectChannels() {
  const directs = nakamaService.getJoinedChannels('direct');
  renderChannelList(directs, elements.userList, 'direct');
}

// 채널 목록 렌더링
function renderChannelList(channels, listElement, type) {
  listElement.innerHTML = '';
  
  if (channels.length === 0) {
    const emptyItem = document.createElement('div');
    emptyItem.className = 'channel-item empty';
    
    switch (type) {
      case 'room':
        emptyItem.textContent = '참여 중인 채팅방이 없습니다.';
        break;
      case 'group':
        emptyItem.textContent = '참여 중인 그룹이 없습니다.';
        break;
      case 'direct':
        emptyItem.textContent = '다이렉트 메시지가 없습니다.';
        break;
    }
    
    listElement.appendChild(emptyItem);
    return;
  }
  
  channels.forEach(channel => {
    const channelItem = document.createElement('div');
    channelItem.className = 'channel-item';
    channelItem.textContent = channel.name;
    
    // 현재 선택된 채널이면 활성화 표시
    if (currentState.channelId === channel.id) {
      channelItem.classList.add('active');
    }
    
    // 채널 선택 이벤트
    channelItem.addEventListener('click', () => {
      selectChannel(channel.id, type, channel.name);
    });
    
    listElement.appendChild(channelItem);
  });
}

// 채널 선택
async function selectChannel(channelId, type, name) {
  // 이전에 선택한 채널과 같으면 아무것도 하지 않음
  if (currentState.channelId === channelId) return;
  
  // 현재 채널 상태 업데이트
  currentState.channelId = channelId;
  currentState.channelType = type;
  currentState.channelName = name;
  
  // Nakama 서비스의 현재 채널 업데이트
  nakamaService.setCurrentChannel(channelId, type);
  
  // UI 업데이트
  elements.currentChannel.textContent = name;
  elements.leaveChannelBtn.style.display = 'inline-block';
  elements.messageInput.disabled = false;
  elements.sendBtn.disabled = false;
  
  // 채널 목록 UI 업데이트
  loadAllChannels();
  
  // 메시지 히스토리 로드
  await loadChannelMessages(channelId);
}

// 채널 메시지 로드
async function loadChannelMessages(channelId) {
  elements.messages.innerHTML = '';
  
  const result = await nakamaService.getChannelMessages(channelId);
  
  if (result.success) {
    // 최신 메시지가 아래에 표시되도록 역순 정렬
    const messages = result.messages.reverse();
    
    messages.forEach(message => {
      renderMessage(message);
    });
    
    // 스크롤을 맨 아래로 이동
    elements.messages.scrollTop = elements.messages.scrollHeight;
  } else {
    showSystemMessage(`메시지를 가져오는 중 오류 발생: ${result.error}`);
  }
}

// 룸 채팅방 생성
async function createRoom() {
  console.log('createRoom');
  const roomName = elements.roomName.value.trim();
  
  if (!roomName) {
    alert('방 이름을 입력하세요.');
    return;
  }
  
  const result = await nakamaService.createRoomChannel(roomName);
  
  if (result.success) {
    elements.roomName.value = '';
    loadRooms();
  } else {
    alert(`방 생성 실패: ${result.error}`);
  }
}

// 그룹 생성
async function createGroup() {
  const groupName = elements.groupName.value.trim();
  
  if (!groupName) {
    alert('그룹 이름을 입력하세요.');
    return;
  }
  
  const result = await nakamaService.createGroup(groupName);
  
  if (result.success) {
    elements.groupName.value = '';
    loadGroups();
  } else {
    alert(`그룹 생성 실패: ${result.error}`);
  }
}

// 사용자 검색
async function searchUsers() {
  const query = elements.userSearch.value.trim();
  
  if (!query) {
    alert('검색할 사용자 이름을 입력하세요.');
    return;
  }
  
  const result = await nakamaService.searchUsers(query);
  
  if (result.success) {
    elements.userList.innerHTML = '';
    
    if (result.users.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'channel-item empty';
      emptyItem.textContent = '검색 결과가 없습니다.';
      elements.userList.appendChild(emptyItem);
      return;
    }
    
    result.users.forEach(user => {
      // 자기 자신은 제외
      if (user.id === nakamaService.getCurrentUser().id) return;
      
      const userItem = document.createElement('div');
      userItem.className = 'channel-item';
      userItem.textContent = user.username;
      
      userItem.addEventListener('click', () => {
        createDirectChat(user.id, user.username);
      });
      
      elements.userList.appendChild(userItem);
    });
  } else {
    alert(`사용자 검색 실패: ${result.error}`);
  }
}

// 다이렉트 채팅 생성
async function createDirectChat(userId, username) {
  const result = await nakamaService.createDirectChannel(userId, username);
  
  if (result.success) {
    loadDirectChannels();
    selectChannel(result.channel.id, 'direct', result.channel.name);
  } else {
    alert(`다이렉트 채팅 생성 실패: ${result.error}`);
  }
}

// 현재 채널 나가기
async function leaveCurrentChannel() {
  if (!currentState.channelId) return;
  
  const result = await nakamaService.leaveChannel(currentState.channelId);
  
  if (result.success) {
    // UI 초기화
    elements.currentChannel.textContent = '채널을 선택하세요';
    elements.leaveChannelBtn.style.display = 'none';
    elements.messageInput.disabled = true;
    elements.sendBtn.disabled = true;
    elements.messages.innerHTML = '';
    
    // 상태 초기화
    currentState.channelId = null;
    currentState.channelType = null;
    currentState.channelName = null;
    
    // 채널 목록 다시 로드
    loadAllChannels();
  } else {
    alert(`채널 나가기 실패: ${result.error}`);
  }
}

// 메시지 전송
async function sendMessage() {
  const content = elements.messageInput.value.trim();
  
  if (!content || !currentState.channelId) return;
  
  const result = await nakamaService.sendMessage(currentState.channelId, content);
  
  if (result.success) {
    elements.messageInput.value = '';
  } else {
    alert(`메시지 전송 실패: ${result.error}`);
  }
}

// 메시지 수신 처리
function handleChannelMessage(message) {
  // 현재 보고 있는 채널의 메시지만 표시
  if (message.channel_id === currentState.channelId) {
    renderMessage(message);
    // 스크롤을 맨 아래로 이동
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }
}

// 채널 참여/퇴장 이벤트 처리
function handleChannelPresence(presence) {
  if (presence.channel_id !== currentState.channelId) return;
  
  // 참여 이벤트
  presence.joins.forEach(user => {
    showSystemMessage(`${user.username || user.user_id}님이 입장했습니다.`);
  });
  
  // 퇴장 이벤트
  presence.leaves.forEach(user => {
    showSystemMessage(`${user.username || user.user_id}님이 퇴장했습니다.`);
  });
}

// 메시지 렌더링
function renderMessage(message) {
  const messageElem = document.createElement('div');
  const currentUser = nakamaService.getCurrentUser();
  
  // 자신의 메시지인지 확인
  const isSelf = message.sender_id === currentUser.id;
  
  messageElem.className = `message ${isSelf ? 'message-self' : 'message-other'}`;
  
  // 메시지 내용이 JSON 형식인 경우 처리
  let content = '';
  try {
    const parsed = JSON.parse(message.content);
    content = parsed.message || message.content;
  } catch (e) {
    content = message.content;
  }
  
  // 메시지 정보 (보낸 사람, 시간)
  if (!isSelf) {
    const infoElem = document.createElement('div');
    infoElem.className = 'message-info';
    infoElem.textContent = message.username || message.sender_id;
    messageElem.appendChild(infoElem);
  }
  
  // 메시지 내용
  const contentElem = document.createElement('div');
  contentElem.className = 'message-content';
  contentElem.textContent = content;
  messageElem.appendChild(contentElem);
  
  // 메시지 시간
  const timeElem = document.createElement('div');
  timeElem.className = 'message-time';
  const messageDate = new Date(message.create_time);
  timeElem.textContent = messageDate.toLocaleTimeString();
  messageElem.appendChild(timeElem);
  
  elements.messages.appendChild(messageElem);
}

// 시스템 메시지 표시
function showSystemMessage(message) {
  const systemMessage = document.createElement('div');
  systemMessage.className = 'system-message';
  systemMessage.textContent = message;
  elements.messages.appendChild(systemMessage);
}

// 모든 방 불러오기 함수
async function loadAllRooms() {
  try {
    if (!nakamaService.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    // 버튼 상태 변경 (로딩 중 표시)
    elements.loadRoomsBtn.disabled = true;
    elements.loadRoomsBtn.textContent = '로딩 중...';
    
    // 서버에서 모든 방 목록 가져오기
    const result = await nakamaService.getAllRooms();
    
    if (result.success) {
      // 방 목록 표시
      renderPublicRooms(result.rooms);
    } else {
      alert(`방 목록을 불러오는데 실패했습니다: ${result.error}`);
    }
  } catch (error) {
    console.error('방 불러오기 오류:', error);
    alert('방 목록을 불러오는 중 오류가 발생했습니다.');
  } finally {
    // 버튼 상태 복원
    elements.loadRoomsBtn.disabled = false;
    elements.loadRoomsBtn.textContent = '방 불러오기';
  }
}

// 공개 방 목록 렌더링
function renderPublicRooms(rooms) {
  elements.roomList.innerHTML = '';
  
  if (rooms.length === 0) {
    const emptyItem = document.createElement('div');
    emptyItem.className = 'channel-item empty';
    emptyItem.textContent = '생성된 방이 없습니다.';
    elements.roomList.appendChild(emptyItem);
    return;
  }
  
  rooms.forEach(room => {
    const roomItem = document.createElement('div');
    roomItem.className = 'channel-item';
    
    const roomName = document.createElement('div');
    roomName.className = 'room-name';
    roomName.textContent = room.name;
    
    const roomInfo = document.createElement('div');
    roomInfo.className = 'room-info';
    roomInfo.textContent = `참여자: ${room.size}명`;
    
    roomItem.appendChild(roomName);
    roomItem.appendChild(roomInfo);
    
    // 방 클릭 시 참여
    roomItem.addEventListener('click', () => {
      joinRoom(room.id, room.name);
    });
    
    elements.roomList.appendChild(roomItem);
  });
}

// 방 참여 함수
async function joinRoom(roomId, roomName) {
  try {
    const result = await nakamaService.joinRoomChannel(roomId, roomName);
    if (result.success) {
      loadRooms(); // 내가 참여한 방 목록 다시 로드
      selectChannel(result.channel.id, 'room', result.channel.name);
    } else {
      alert(`방 참여 실패: ${result.error}`);
    }
  } catch (error) {
    console.error('방 참여 오류:', error);
    alert('방에 참여하는 중 오류가 발생했습니다.');
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init); 

