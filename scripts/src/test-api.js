// Script để test API endpoints
async function testAPI() {
  try {
    console.log('Testing API endpoints with MongoDB...');
    
    // Test 1: Lấy danh sách loại tính cách
    console.log('\n1. Fetching personality types...');
    const typesResponse = await fetch('http://localhost:3000/api/personality-types');
    const types = await typesResponse.json();
    console.log(`Found ${types.length} personality types`);
    console.log('Sample:', types[0]);
    
    // Test 2: Lấy chi tiết một loại tính cách
    console.log('\n2. Fetching details for INTJ...');
    const detailResponse = await fetch('http://localhost:3000/api/personality-types/INTJ');
    const detail = await detailResponse.json();
    console.log('INTJ details:', detail);
    
    // Test 3: Lấy danh sách câu hỏi
    console.log('\n3. Fetching test questions...');
    const questionsResponse = await fetch('http://localhost:3000/api/test/questions');
    const questionsData = await questionsResponse.json();
    console.log(`Found ${questionsData.questions.length} questions`);
    console.log('Sample question:', questionsData.questions[0]);
    
    // Test 4: Gửi kết quả test
    console.log('\n4. Submitting test results...');
    const testData = {
      answers: {
        q1_e: 4, q2_i: 2, q3_e: 5, q4_i: 1, q5_s: 3,
        q6_n: 4, q7_s: 2, q8_n: 5, q9_t: 4, q10_f: 2,
        q11_t: 5, q12_f: 1, q13_j: 2, q14_p: 4, q15_j: 1,
        q16_p: 5, q17_e: 4, q18_i: 2, q19_s: 3, q20_n: 4
      }
    };
    
    const submitResponse = await fetch('http://localhost:3000/api/test/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await submitResponse.json();
    console.log('Test result:', result);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Chạy các test
testAPI(); 