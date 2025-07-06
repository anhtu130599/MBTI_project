import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import { verifyAdminAuth } from '@/shared/utils/auth';

interface OptionInput {
  text: string;
  value: string;
}

export async function GET() {
  await dbConnect();
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Lỗi khi tải câu hỏi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    
    // Transform options to match the schema
    const transformedData = {
      ...data,
      options: data.options.map((option: OptionInput, index: number) => ({
        id: `option_${index + 1}`,
        text: option.text,
        value: option.value
      }))
    };

    // Validate required fields
    if (!transformedData.text || !transformedData.category || !transformedData.options || transformedData.options.length < 2) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 });
    }

    // Validate options
    for (const option of transformedData.options) {
      if (!option.text || !option.value) {
        return NextResponse.json({ error: 'Vui lòng nhập đầy đủ nội dung và giá trị cho tất cả đáp án' }, { status: 400 });
      }
    }

    // Check for duplicate question
    const existingQuestion = await Question.findOne({ 
      text: { $regex: new RegExp(`^${transformedData.text.trim()}$`, 'i') }
    });
    
    if (existingQuestion) {
      return NextResponse.json({ 
        error: 'Câu hỏi này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc sử dụng câu hỏi khác.' 
      }, { status: 409 });
    }

    const question = await Question.create(transformedData);
    return NextResponse.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Lỗi khi tạo câu hỏi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json({ error: 'Thiếu ID câu hỏi' }, { status: 400 });
    }

    // Transform options to match the schema
    const transformedData = {
      ...updateData,
      options: updateData.options.map((option: OptionInput, index: number) => ({
        id: `option_${index + 1}`,
        text: option.text,
        value: option.value
      }))
    };

    const question = await Question.findByIdAndUpdate(_id, transformedData, { new: true });
    
    if (!question) {
      return NextResponse.json({ error: 'Không tìm thấy câu hỏi' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật câu hỏi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    await dbConnect();
    const { _id } = await request.json();

    if (!_id) {
      return NextResponse.json({ error: 'Thiếu ID câu hỏi' }, { status: 400 });
    }

    const question = await Question.findByIdAndDelete(_id);
    
    if (!question) {
      return NextResponse.json({ error: 'Không tìm thấy câu hỏi' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa câu hỏi' }, { status: 500 });
  }
} 
