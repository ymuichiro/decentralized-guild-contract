import query from "./services/database";
import { User } from './models/User';
import { signUp } from './contracts/signUp';
import { login } from './frontend';

// ここで開発したコントラクトをテストする
console.log("> start application");

login();

/*
const user: User = {
  name: "Bob",
  address: "NBQIOW4GBPZ3R73EBJ55AVDPJQ457ZJEJ73K7KI",
  publicKey: "20131B4B0BC5239B7D2EF65B1D31630E7347A90CD65DE347168208B815F3EE77",
};

signUp(user);
*/

/*
query("SHOW TABLES", ...[]).then(e => {
  console.log("-".repeat(5), "show tables", "-".repeat(5));
  console.log(e);
})
*/

/*
query(
  "INSERT INTO quest (transaction_hash,title,description,reward,requester_public_key,worker_public_key,status,created) VALUES(?,?,?,?,?,?,?,now())",
  "x000000000", "title test", "description test", 100, "pkey_test", "pkey_test", "COMPLETED"
).then(() => {
  console.log("-".repeat(5), "SELECT * FROM quest", "-".repeat(5));
  query("SELECT * FROM quest", ...[]).then(console.log)
})
*/