import { getActiveAccountToken, getActivePublicKey, setTransaction, requestSign } from 'sss-module';
import { verifierPublicKey, networkType, generationHash, establisherPublicKey, establisherPrivateKey} from './config';
import { auth } from './services/login';
import { establishGuildTransaction } from './services/establishGuild';
import { createJoinGuildAggregateTransaction } from './services/joinGuild';
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

  // フォームなどでUserデータを取得、以下はテスト用
  const user: User = {
    name: "Bob",
    address: "TBS2EI4K66LVQ57HMUFXYAJQGIFUR25Z4GTFZUI",
    publicKey: "B055C6F655CD3101A04567F9499F24BE7AB970C879887BD3C6644AB7CAA22D22",
  };
  
  const aggregateTransaction = await createJoinGuildAggregateTransaction(user);
  // 本番フロント用
  //setTransaction(aggregateTransaction);
  //const signedAggTransaction = await requestSign();

  // テスト用 要参加希望者の秘密鍵
  const dummyAcc = Account.createFromPrivateKey('D2F4CB68224057808FC2A5B28A1BDC958634FC904809D16CA8F55FBDCE8FB3E3', networkType);
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