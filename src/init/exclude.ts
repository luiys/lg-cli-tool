export const bdConn = `await createConnection({
	type: "postgres",
	port: <number><unknown>process.env.DB_PORT,
	host: <string>process.env.DB_HOST,
	username: <string>process.env.DB_USER,
	password: <string>process.env.DB_PASSWORD,
	database: <string>process.env.DB_NAME,
	synchronize: false,
	entities: [...Tables],
	migrations: [__dirname + "/migrations/*.ts"],
	cli: { "migrationsDir": "migration/" },
	cache: { duration: 30000 },
});`