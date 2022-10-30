import { createRecievedOrderAggregateTransaction } from "../Contracts/createRecievedOrderAggregateTransaction";
import SystemService from "./SystemService";

export default class QuestService extends SystemService {
  constructor() {
    super();
  }

  /**
   * クエストを受注する（ふぁー整理中）
   */
  public static async receivedOrder() {
    // 本番フロント用
    //const contractId = 'RDBから取得';
    //const requesterPublicKey = getActivePublicKey();
    //const workerPublicKey = 'RDBから取得';

    // テスト用
    const contractId = "CONTRACT_ID";
    const requesterPublicKey =
      "87B3802189D9C74AECF8915B015ACD4A69CE777EE4DDE8B51ADF6237AFC65478";
    const workerPublicKey =
      "C569040B38DF6B0AB17151A30CC553935780B830A4486FAAA68D5632732C7769";

    // const aggregateTransaction = await createRecievedOrderAggregateTransaction(
    //   contractId,
    //   requesterPublicKey,
    //   workerPublicKey
    // );

    // 本番フロント用
    //setTransaction(aggregateTransaction);
    //const signedAggTransaction = await requestSign();

    // テスト用
    // const requester = Account.createFromPrivateKey(
    //   "B9B39486BEFD899BC678D5A7E99186E190076605702D5904721C684F266A257D",
    //   networkType
    // );
    // const signedAggTransaction = requester.sign(
    //   aggregateTransaction,
    //   generationHash
    // );

    // ここでDBのQuestを編集する
    // ハッシュを登録しておくと後ほど検索に便利
    // insert...quest table, hash colom -> signedAggTransaction.hash
    // 書き方全然分からないのでこんなイメージでｗ

    // アグボンはハッシュロックも署名が必要なため二度SSSで署名が必要。少しラグを設けないとバグるためのsetTimeout
    // setTimeout(async () => {
    //   const hashlockTransaction = await createJoinHashLockTransaction(
    //     signedAggTransaction
    //   );
    //   // 本番フロント用
    //   //setTransaction(hashlockTransaction);
    //   //const signedHashLockTransaction = await requestSign();

    //   // テスト用
    //   const signedHashLockTransaction = requester.sign(
    //     hashlockTransaction,
    //     generationHash
    //   );

    //   announceAggregateBonded(signedAggTransaction, signedHashLockTransaction);
    // }, 1000);
  }
}
