import query from "./services/database";
import { User } from './models/User';
import { signUp } from './contracts/signUp';

// ここで開発したコントラクトをテストする
console.log("> start application");
const user: User = {
  name: "Alice",
  address: "TAIVS4GFLTZQVJGHCQD232Y3L5BSP2F27XRDBFQ",
  publicKey: "A890D229FEBDADEDD5B7D1DBDF2B4BECD21CCDCD15C420FC986CE8BBC2C972E4",
};

//signUp(user);

/*
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
*/