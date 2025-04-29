// Script để chạy seed câu hỏi
const { exec } = require('child_process');
const path = require('path');

// Đường dẫn tới file seed
const seedFilePath = path.join(__dirname, '../prisma/seed/new-questions.ts');

console.log('Bắt đầu thêm câu hỏi mới...');
console.log(`Sử dụng tệp: ${seedFilePath}`);

// Chạy file TypeScript seed sử dụng ts-node
exec(`npx ts-node ${seedFilePath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing seed: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  console.log(`Stdout: ${stdout}`);
  console.log('Đã thêm câu hỏi thành công!');
}); 