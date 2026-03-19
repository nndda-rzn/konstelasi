const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SUPABASE_JWT_SECRET;
console.log('Using secret:', secret ? 'EXISTS' : 'MISSING');

const dummyToken = jwt.sign(
  {
    sub: '12345678-1234-1234-1234-123456789012',
    role: 'authenticated',
    email: 'test@example.com'
  },
  secret,
  { expiresIn: '1h' }
);

const query = `
  query {
    getNotes {
      id
    }
  }
`;

async function run() {
  const res = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${dummyToken}`
    },
    body: JSON.stringify({ query })
  });
  const text = await res.text();
  console.log('HTTP Status:', res.status);
  console.log('Response:', text);
}

run().catch(console.error);
