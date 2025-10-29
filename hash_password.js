const bcrypt = require('bcryptjs');

const plainPassword = '123'; 

const salt = 8; 

const hashedPassword = bcrypt.hashSync(plainPassword, salt);

console.log("Mật khẩu đã mã hóa (hashed password):");
console.log(hashedPassword);