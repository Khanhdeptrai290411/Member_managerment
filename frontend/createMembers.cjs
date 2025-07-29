const axios = require('axios');

const createMember = async (member) => {
  try {
    const response = await axios.post('http://localhost:8000/api/members', member);
    console.log(`✅ Created: ${response.data.name}`);
  } catch (error) {
    console.error(`❌ Failed to create ${member.name}:`, error.response?.data || error.message);
  }
};

const run = async () => {
  const members = [];

  for (let i = 21; i <= 40; i++) {
    members.push({
      name: `Tester${i}`,
      email: `tester${i}@hehe.com`,
      phone: `01234567${i.toString().padStart(2, '0')}`,
      birthday: '2004-05-23',
      country: 'Việt Nam',
      city: 'Hà Nội',
      district: 'Cầu Giấy',
      address: '123 Đường A'
    });
  }

  for (const member of members) {
    await createMember(member);
  }
};

run();
