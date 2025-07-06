import dbConnect from '@/lib/mongodb';
import PersonalityDetailInfo from '@/core/infrastructure/database/models/PersonalityDetailInfo';
import { ApiResponseUtil } from '@/shared/utils/apiResponse';

export async function GET(
  _request: Request,
  { params }: { params: { typeId: string } }
) {
  try {
    await dbConnect();
    
    // Lấy thông tin từ database trước
    const personalityType = await PersonalityDetailInfo.findOne({ type: params.typeId }).lean();
    
    if (!personalityType) {
      return ApiResponseUtil.notFound(`Personality type '${params.typeId}' not found`);
    }
    
    return ApiResponseUtil.success(personalityType);
  } catch (error: unknown) {
    console.error('Error fetching personality type:', error);
    return ApiResponseUtil.internalServerError('Failed to fetch personality type details');
  }
} 