import { TEST_DATA } from "./config";
import { AuthService } from "./services/AuthService";
import GuildService from "./services/GuildService";
import QuestService from "./services/QuestService";

// ここで開発したコントラクトをテストする
console.log("> start application");

console.log("-".repeat(10), "AuthService.login", "-".repeat(10));
AuthService.login(TEST_DATA.NETWORK).then(console.log);

console.log("-".repeat(10), "QuestService.receivedOrder", "-".repeat(10));
QuestService.receivedOrder(
  "contractId",
  TEST_DATA.REQUESTER.KEY.PUBLIC,
  TEST_DATA.FEE,
  TEST_DATA.NODE,
  TEST_DATA.NETWORK
);

console.log("-".repeat(10), "GuildService.establishGuild", "-".repeat(10));
GuildService.establishGuild(
  TEST_DATA.GUILD_OWNER.KEY.PUBLIC,
  "",
  "",
  1000,
  TEST_DATA.NETWORK
);

console.log("-".repeat(10), "GuildService.joinRequest", "-".repeat(10));
GuildService.joinRequest(
  TEST_DATA.GUILD_OWNER.KEY.PUBLIC,
  "guildMosaicId",
  TEST_DATA.NODE,
  TEST_DATA.NETWORK
);

// ---------------------- old --------------------------------

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
