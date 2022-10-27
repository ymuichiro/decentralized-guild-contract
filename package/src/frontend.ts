import { getActiveAccountToken, getActivePublicKey, setTransaction, requestSign } from 'sss-module';
import { verifierPublicKey, networkType, generationHash, establisherPublicKey, establisherPrivateKey} from './config';
import { auth } from './services/login';
import { establishGuildTransaction } from './services/establishGuild';
import { createJoinGuildAggregateTransaction } from './services/joinGuild';
import { createRecievedOrderAggregateTransaction } from './services/receivedOrder'
import { announceAggregateBonded, createJoinHashLockTransaction } from './services/utils';
import { User } from './models/User';
import { Account } from 'symbol-sdk';

export const login = async function () {
  try {
    // 本番フロント用
    const token = await getActiveAccountToken(verifierPublicKey);
    const publicKey = getActivePublicKey();

    // テスト用
    // const publicKey = "60E9BC67EC32C5785BA58F0D2D7B0322C606DE1610425D876DE2C6637629BC45";
    // const token = "4C3F3CD26FA13027C8AA4CAB11277ACCB0C4A34F680C16BDD8AD4CFDB84765E0D871A8F3D736472333F255332137BB2DA7E53019B0A45C2EF7B1325992A641A2FA5B95244161F492F72B103F89C109389326A82F4E19698CC2B07D219CADE47C92B16EC86C9257782210E093B2D54F364207BB438FFAB96867D4210304BEAE79B66A732B263EDADF5762D4E320747AEC154CE5B16AA0815DB2FE169FE08A7D47759415AE84AEA45FAFF00FB5C58BE3AD4E38BD1ECB"

    const verified = await auth(publicKey, token);

    // 署名は正しいです
    console.log(verified)
    // とりあえず画像の①だけですが、DB触ると時間かかりそうなので一旦ここまでｗ
    // ②についてはRDBを確認するのか、ブロックチェーンを確認するのかが分からず

  } catch {
    // 署名は正しくありませんでした
  }
};

export const joinGuild = async function () {

  // 本番フロント用
  // const publicKey = getActivePublicKey();

  // テスト用
  const publicKey = "87B3802189D9C74AECF8915B015ACD4A69CE777EE4DDE8B51ADF6237AFC65478";
  
  const aggregateTransaction = await createJoinGuildAggregateTransaction(publicKey);
  // 本番フロント用
  //setTransaction(aggregateTransaction);
  //const signedAggTransaction = await requestSign();

  // テスト用 要参加希望者の秘密鍵
  const dummyAcc = Account.createFromPrivateKey('B9B39486BEFD899BC678D5A7E99186E190076605702D5904721C684F266A257D', networkType);
  const signedAggTransaction = dummyAcc.sign(aggregateTransaction, generationHash);
  
  // アグボンはハッシュロックも署名が必要なため二度SSSで署名が必要。少しラグを設けないとバグるためのsetTimeout
  setTimeout(async () => {
      const hashlockTransaction = await createJoinHashLockTransaction(signedAggTransaction);
      // 本番フロント用
      //setTransaction(hashlockTransaction);
      //const signedHashLockTransaction = await requestSign();
      
      // テスト用
      const signedHashLockTransaction = dummyAcc.sign(hashlockTransaction, generationHash);
      announceAggregateBonded(signedAggTransaction, signedHashLockTransaction);
  },1000)
}

export const establishGuild = async function (){
  // 本番フロント用
  //const publicKey = getActivePublicKey();

  // テスト用
  const publicKey = establisherPublicKey;
  
  const aggAndOwner = await establishGuildTransaction(publicKey);

  // 本番フロント用
  //setTransaction(aggAndOwner.aggregateTransactio);
  //const signedAggTransaction = await requestSignWithCosignatories([aggAndOwner.guildOwnerAcc]);

  // テスト用
  const establisher = Account.createFromPrivateKey(establisherPrivateKey, networkType);
  const signedAggTransaction = establisher.signTransactionWithCosignatories(aggAndOwner.aggregateTransaction, [aggAndOwner.guildOwnerAcc], generationHash);
  
  // アグボンはハッシュロックも署名が必要なため二度SSSで署名が必要。少しラグを設けないとバグるためのsetTimeout
  setTimeout(async () => {
      const hashlockTransaction = await createJoinHashLockTransaction(signedAggTransaction);
      // 本番フロント用
      //setTransaction(hashlockTransaction);
      //const signedHashLockTransaction = await requestSign();
      
      // テスト用
      const signedHashLockTransaction = establisher.sign(hashlockTransaction, generationHash);
      announceAggregateBonded(signedAggTransaction, signedHashLockTransaction);
  },1000)
}

export const receivedOrder = async function (){
  // 本番フロント用
  //const contractId = 'RDBから取得';
  //const requesterPublicKey = getActivePublicKey();
  //const workerPublicKey = 'RDBから取得';

  // テスト用
  const contractId = 'CONTRACT_ID';
  const requesterPublicKey = '87B3802189D9C74AECF8915B015ACD4A69CE777EE4DDE8B51ADF6237AFC65478';
  const workerPublicKey = 'C569040B38DF6B0AB17151A30CC553935780B830A4486FAAA68D5632732C7769';

  const aggregateTransaction = await createRecievedOrderAggregateTransaction(contractId, requesterPublicKey, workerPublicKey);

  // 本番フロント用
  //setTransaction(aggregateTransaction);
  //const signedAggTransaction = await requestSign();

  // テスト用
  const requester = Account.createFromPrivateKey('B9B39486BEFD899BC678D5A7E99186E190076605702D5904721C684F266A257D', networkType);
  const signedAggTransaction = requester.sign(aggregateTransaction, generationHash);
  
  // ここでDBのQuestを編集する
  // ハッシュを登録しておくと後ほど検索に便利
  // insert...quest table, hash colom -> signedAggTransaction.hash
  // 書き方全然分からないのでこんなイメージでｗ

  // アグボンはハッシュロックも署名が必要なため二度SSSで署名が必要。少しラグを設けないとバグるためのsetTimeout
  setTimeout(async () => {
      const hashlockTransaction = await createJoinHashLockTransaction(signedAggTransaction);
      // 本番フロント用
      //setTransaction(hashlockTransaction);
      //const signedHashLockTransaction = await requestSign();
      
      // テスト用
      const signedHashLockTransaction = requester.sign(hashlockTransaction, generationHash);

      announceAggregateBonded(signedAggTransaction, signedHashLockTransaction);
  },1000)
}