import mysql from 'mysql2';

export default async function query<T>(sql: string, ...values: (string | number)[]): Promise<T> {
  const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER_NAME,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_USER_PASS,
  });

  try {
    const result = new Promise<T>((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) reject(err);

        resolve(results as any | any[]);
      });
    });

    return result;
  } catch (e) {
    throw new Error((e as Error).stack);
  } finally {
    connection.end();
  }
}