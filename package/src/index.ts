import query from "./services/database";

// ここで開発したコントラクトをテストする

console.log("> start application");
query("SHOW TABLES", ...[]).then(e => {
  console.log("-".repeat(5), "show tables", "-".repeat(5));
  console.log(e);
})


query(
  "INSERT INTO quest (transaction_hash,title,description,reward,requester_public_key,worker_public_key,status,created) VALUES(?,?,?,?,?,?,?,now())",
  "x000000000", "title test", "description test", 100, "pkey_test", "pkey_test", "COMPLETED"
).then(() => {
  console.log("-".repeat(5), "SELECT * FROM quest", "-".repeat(5));
  query("SELECT * FROM quest", ...[]).then(console.log)
})


