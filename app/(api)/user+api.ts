import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    // Ensure the DATABASE_URL is correctly formatted and passed to neon
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(databaseUrl);
    const { name, email, clerkId } = await request.json();

    // Validate the request body
    if (!name || !email || !clerkId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Perform the SQL INSERT operation
    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
     );`;

    // Return the response
    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
