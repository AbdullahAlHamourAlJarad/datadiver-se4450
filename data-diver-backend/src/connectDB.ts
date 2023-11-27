import * as sql from 'mssql';

// Configuring the connection pool example
async function connectToDatabase(serverUrl: string, database: string, dbUserName: string, dbPassword: string) {
  const config: sql.config = {
    user: dbUserName,
    password: dbPassword,
    server: serverUrl,
    database: database,
    options: {
      encrypt: true, // For Azure SQL Database, set to true
    },
  };

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

//function to initiate connection
export async function createNewDBConnection(serverUrl: string, database: string, dbUserName: string, dbPassword: string){
  const config: sql.config = {
    user: dbUserName,
    password: dbPassword,
    server: serverUrl,
    database: database,
    options: {
      encrypt: true, // For Azure SQL Database, set to true
    },
  };

  try {
    // Create a new instance of the connection pool
    const connection = await new sql.ConnectionPool(config).connect();

    return connection;
  } catch (err) {
    console.error('Error occurred connecting to database:', err);
  }
}

// Connect to the database example
//connectToDatabase('datadiverserver.database.windows.net', 'DataDiverDB', 'datadiveradmin', 'ouda2023!');