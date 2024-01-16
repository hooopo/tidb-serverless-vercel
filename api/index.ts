import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { connect } from '@tidbcloud/serverless'
import { env } from 'hono/adapter'

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('/api')

app.get('/', async (c) => {
  return c.json({ hello: 'world' })
})

app.post('/', async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  const conn = connect({url: DATABASE_URL})

  const openai_conversation_id = c.req.header('openai-conversation-id') || '00000000-0000-0000-0000-000000000000';
  const db_name = "db" + openai_conversation_id.replace(/-/g, '');
  const db_config = new URL(DATABASE_URL.replace('mysql://', 'http://'));
  const tenant_id = db_config.username.split('.')[0];

  const guest_user = tenant_id + '.' + openai_conversation_id.split('-')[0];
  const guest_password = openai_conversation_id.split('-')[3];
  const json_data = await c.req.json()

  // setup guest user and database
  await conn.execute(`CREATE DATABASE IF NOT EXISTS ${db_name}`);
  await conn.execute(`CREATE USER IF NOT EXISTS '${guest_user}'@'%' IDENTIFIED BY '${guest_password}';`);
  await conn.execute(`GRANT ALL PRIVILEGES ON ${db_name}.* TO '${guest_user}'@'%';`);

  const guest_conn = connect({ url: DATABASE_URL, database:db_name, username:guest_user, password:guest_password })

  const query = json_data.query;

  const result = await guest_conn.execute(query);

  const headers: { [key: string]: string } = {}

  for (const [key, value] of c.req.raw.headers) {
    headers[key] = value
  }

  // Reading the payload/body
  let payload = null;
  try {
    payload = await c.req.text();
  } catch (error) {
    // Handle any error that occurred while reading the payload
  }

  // Returning headers and payload in the response
  const response = new Response(JSON.stringify(result), {
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    }
  })
  return response;
})

export default handle(app)