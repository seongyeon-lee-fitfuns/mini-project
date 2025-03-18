import { ApiRequest, ApiResponse } from '@/types/api';

// 실제로는 여기서 API를 호출하지만, 지금은 모의 응답을 반환합니다
export async function callApi(request: ApiRequest): Promise<ApiResponse> {
  console.log('API 요청:', request);
  
  // 모의 응답 생성
  try {
    // 일부 오류 케이스 시뮬레이션
    if (!request.userId) {
      return {
        data: null,
        error: 'rpc error: code = NotFound desc = User account not found.'
      };
    }
    
    // 기본 응답 데이터
    return {
      data: {
        success: true,
        method: request.method,
        requestBody: request.body,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
} 