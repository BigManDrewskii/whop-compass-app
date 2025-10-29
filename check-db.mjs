import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

try {
  console.log('Checking database structure...\n');
  
  // Check existing tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  
  console.log('Existing tables:');
  tables.forEach(t => console.log(`  - ${t.table_name}`));
  
  // Check users table if it exists
  if (tables.some(t => t.table_name === 'users')) {
    console.log('\nUsers table columns:');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    columns.forEach(c => {
      console.log(`  - ${c.column_name}: ${c.data_type} (nullable: ${c.is_nullable})`);
    });
  }
  
  await sql.end();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
