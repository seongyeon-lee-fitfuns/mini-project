import { Client } from '@heroiclabs/nakama-js';

class NakamaService {
  constructor() {
    // Nakama 서버 설정
    this.serverUrl = 'localhost'; // http:// 프로토콜 추가
    this.serverPort = '7350';
    this.serverKey = 'defaultkey';
    
    this.client = null;
    this.session = null;
    this.socket = null;
    this.currentUser = null;
    
    // 채널 관련 상태
    this.currentChannelId = null;
    this.currentChannelType = null;
    this.joinedChannels = {
      room: {},
      group: {},
      direct: {}
    };
    
    // 메시지 캐싱 커서 저장 (채널별)
    this.messagesCursors = {};
    
    // 콜백 이벤트
    this.onChannelMessage = null;
    this.onChannelPresence = null;
    this.onConnect = null;
    this.onDisconnect = null;
    
    this.initialize();
  }
  
  initialize() {
    this.client = new Client(this.serverKey, this.serverUrl, this.serverPort, false);
    this.client.timeout = 15000; // 15초 타임아웃 설정
    this.client.useHttps = false; // 개발 환경에서는 false, 프로덕션에서는 true로 설정
  }
  
  // 인증 및 연결 메서드
  async authenticateEmail(email, password, create = false) {
    try {
      this.session = await this.client.authenticateEmail(email, password, create);
      this.currentUser = {
        id: this.session.user_id,
        username: this.session.username,
        displayName: this.session.username
      };
      
      this.socket = await this.client.createSocket(false, false);
      console.log('token', this.session.token);
      await this.socket.connect(this.session, true);
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async authenticateDevice(deviceId) {
    try {
      this.session = await this.client.authenticateDevice(deviceId);
      this.currentUser = {
        id: this.session.user_id,
        username: this.session.username,
        displayName: this.session.username
      };
      
      await this.socket.connect(this.session, true);
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: error.message };
    }
  }
  
  
  logout() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.session = null;
    this.currentUser = null;
    this.currentChannelId = null;
    this.currentChannelType = null;
    this.joinedChannels = {
      room: {},
      group: {},
      direct: {}
    };
  }
  
  // 채널 관련 메서드
  
  // 룸 채팅 채널 생성 및 참여
  async createRoomChannel(roomName) {
    try {
      if (!this.session || !this.socket) {
        throw new Error('로그인이 필요합니다.');
      }
      const persistence = true;
      const hidden = false;
      console.log('createRoomChannel', roomName);
      // 1 = Room, 2 = Direct, 3 = Group
      const result = await this.socket.joinChat(
        roomName,
        1,
        persistence,
        hidden
      );
      console.log('New Connection', result);
      
      
      return { success: true, result };
    } catch (error) {
      console.error('Room channel creation error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async joinRoomChannel(roomId, roomName) {
    try {
      // Nakama 권장: 채널 타입은 1 (룸 채팅)
      const response = await this.socket.joinChat(roomId, 1, true, false);
      
      this.joinedChannels.room[response.id] = {
        id: response.id,
        name: roomName || roomId,
        roomId: roomId
      };
      
      return { success: true, channel: this.joinedChannels.room[response.id] };
    } catch (error) {
      console.error('Join room error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 그룹 채팅 채널 생성 및 참여
  async createGroup(groupName) {
    try {
      if (!this.session) {
        throw new Error('로그인이 필요합니다.');
      }
      
      const response = await this.client.createGroup(this.session, {
        name: groupName,
        open: true,
        max_count: 100
      });
      
      const groupId = response.id;
      await this.joinGroupChannel(groupId, groupName);
      
      return { success: true, groupId };
    } catch (error) {
      console.error('Group creation error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async joinGroupChannel(groupId, groupName) {
    try {
      // 먼저 그룹에 가입
      await this.client.joinGroup(this.session, groupId);
      
      // 그룹 채팅 채널에 참여 (권장 설정)
      const response = await this.socket.joinChat({
        target: groupId,
        type: 2, // 2: 그룹 채팅
        persistence: true, // 메시지 영구 저장
        hidden: false // 사용자를 채널 멤버 목록에 표시
      });
      
      this.joinedChannels.group[response.id] = {
        id: response.id,
        name: groupName || groupId,
        groupId: groupId
      };
      
      return { success: true, channel: this.joinedChannels.group[response.id] };
    } catch (error) {
      console.error('Join group error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 다이렉트 메시지 채널 생성
  async createDirectChannel(userId, username) {
    try {
      if (!this.session || !this.socket) {
        throw new Error('로그인이 필요합니다.');
      }
      
      // Nakama 권장: 다이렉트 메시지 설정
      const response = await this.socket.joinChat({
        target: userId,
        type: 3, // 3: 다이렉트 메시지
        persistence: true, // 메시지 영구 저장
        hidden: false // 숨김 여부
      });
      
      this.joinedChannels.direct[response.id] = {
        id: response.id,
        name: username || userId,
        userId: userId
      };
      
      return { success: true, channel: this.joinedChannels.direct[response.id] };
    } catch (error) {
      console.error('Direct channel creation error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 메시지 히스토리 가져오기 (캐싱 커서 활용)
  async getChannelMessages(channelId, limit = 20) {
    try {
      if (!this.session) {
        throw new Error('로그인이 필요합니다.');
      }
      
      // 캐싱 커서 사용 (권장)
      const cacheableCursor = this.messagesCursors[channelId];
      const forward = true; // 시간순 정렬
      
      const result = await this.socket.listChatMessages(channelId, limit, forward, cacheableCursor);
      
      // 다음 요청을 위해 커서 저장
      if (result.cacheableCursor) {
        this.messagesCursors[channelId] = result.cacheableCursor;
      }
      
      return { success: true, messages: result.messages };
    } catch (error) {
      console.error('Get messages error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 이전 메시지 전체 가져오기 (캐싱 커서 사용하지 않음)
  async getAllChannelMessages(channelId, limit = 20) {
    try {
      if (!this.session) {
        throw new Error('로그인이 필요합니다.');
      }
      
      const forward = true; // 시간순 정렬
      const result = await this.socket.listChatMessages(channelId, limit, forward);
      
      return { success: true, messages: result.messages };
    } catch (error) {
      console.error('Get all messages error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 채널 참가자 목록 가져오기 (권장)
  async getChannelPresence(channelId) {
    try {
      if (!this.socket) {
        throw new Error('소켓 연결이 필요합니다.');
      }
      
      const presence = await this.socket.listChannelPresences(channelId);
      return { 
        success: true, 
        users: presence.presences.map(p => ({
          userId: p.user_id,
          username: p.username,
          status: p.status
        }))
      };
    } catch (error) {
      console.error('Get channel presence error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 채널 메시지 보내기 (개선)
  async sendMessage(channelId, content) {
    try {
      if (!this.socket) {
        throw new Error('소켓 연결이 필요합니다.');
      }
      
      // 다양한 메시지 타입 지원
      let messageData;
      
      if (typeof content === 'string') {
        // 텍스트 메시지
        messageData = { message: content };
      } else {
        // 구조화된 메시지 (이미지, 파일 등)
        messageData = content;
      }
      
      const result = await this.socket.writeChatMessage(channelId, messageData);
      return { success: true, messageId: result.message_id };
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 채널 떠나기
  async leaveChannel(channelId) {
    try {
      if (!this.socket) {
        throw new Error('소켓 연결이 필요합니다.');
      }
      
      await this.socket.leaveChatChannel(channelId);
      
      // 채널 목록에서 제거
      Object.keys(this.joinedChannels).forEach(type => {
        if (this.joinedChannels[type][channelId]) {
          delete this.joinedChannels[type][channelId];
        }
      });
      
      if (this.currentChannelId === channelId) {
        this.currentChannelId = null;
        this.currentChannelType = null;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Leave channel error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 사용자 검색
  async searchUsers(query, limit = 20) {
    try {
      if (!this.session) {
        throw new Error('로그인이 필요합니다.');
      }
      
      const result = await this.client.listUsers(this.session, query, limit);
      return { success: true, users: result.users };
    } catch (error) {
      console.error('User search error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 현재 채널 설정
  setCurrentChannel(channelId, channelType) {
    this.currentChannelId = channelId;
    this.currentChannelType = channelType;
  }
  
  // 채널 목록 가져오기
  getJoinedChannels(type) {
    return Object.values(this.joinedChannels[type]);
  }
  
  // 사용자 정보 가져오기
  getCurrentUser() {
    return this.currentUser;
  }
  
  isAuthenticated() {
    return !!this.session;
  }
  
  // 서버 상태 확인 (권장)
  async getServerStatus() {
    try {
      const status = await this.client.getStatus();
      return { success: true, status };
    } catch (error) {
      console.error('Get server status error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // 현재 서버에 생성된 모든 룸 목록 가져오기
  async getAllRooms(limit = 20) {
    try {
      if (!this.socket) {
        throw new Error('소켓 연결이 필요합니다.');
      }
      
      // 매치 리스팅 API를 사용하여 현재 활성화된 모든 매치(룸) 가져오기
      console.log('getAllRooms');
      //TODO: rpc로 모든 룸 가져오기
      const matches = [{
        match_id: '1',
        metadata: {
          name: '룸1',
          description: '룸1 설명'
        },
        size: 2
      }]
      
      // 매치 데이터를 룸 형식으로 변환
      const rooms = matches.matches.map(match => ({
        id: match.match_id,
        name: match.metadata?.name || match.match_id,
        description: match.metadata?.description || '',
        size: match.size
      }));
      
      return { success: true, rooms };
    } catch (error) {
      console.error('Get all rooms error:', error);
      return { success: false, error: error.message };
    }
  }
}

// 싱글톤으로 내보내기
const nakamaService = new NakamaService();
export default nakamaService; 