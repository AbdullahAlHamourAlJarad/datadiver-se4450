import * as sql from 'mssql';

console.log('test')
// Configuring the connection pool
const config: sql.config = {
  user: 'datadiveradmin',
  password: 'ouda2023!',
  server: 'datadiverserver.database.windows.net',
  database: 'DataDiverDB',
  options: {
    encrypt: true, // For Azure SQL Database, set to true
  },
};

async function connectToDatabase() {
  try {
    // Create a new instance of the connection pool
    const pool = await new sql.ConnectionPool(config).connect();

    // Query example
    const result = await pool.request().query('SELECT * FROM dbo.Customer');

    console.dir(result);

    // Close the connection pool
    pool.close();
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

// Connect to the database
connectToDatabase();