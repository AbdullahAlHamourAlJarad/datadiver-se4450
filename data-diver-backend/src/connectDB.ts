import * as sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

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
  } catch (error: any) {
    console.error('Error occurred connecting to database:', error);
    if(error?.code === 'ELOGIN' && error.originalError)
      throw new Error(error.originalError)
    else 
      throw new Error("Failed to retrieve information from the given database")
  }
}

export async function createDataDiverDBConnection() {
  return createNewDBConnection(
    process.env.DB_URL as string, 
    process.env.DB_NAME as string, 
    process.env.DB_USER as string, 
    process.env.DB_PASSWORD as string
  );
}

// Connect to the database example
//connectToDatabase('datadiverserver.database.windows.net', 'DataDiverDB', 'datadiveradmin', 'ouda2023!');