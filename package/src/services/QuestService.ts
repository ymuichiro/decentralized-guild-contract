import { createRecievedOrderAggregateTransaction } from "../Contracts/createRecievedOrderAggregateTransaction";
import { createDeliverdOrderTransaction } from "../Contracts/createDeliverdOrderTransaction";
import { Network, NodeInfo } from "../models/Network";
import { SystemFee } from "../models/Tax";
import SystemService from "./SystemService";

export default class QuestService extends SystemService {
  constructor() {
    super();
  }

  /**
   * クエストを登録する
   */
  public static async request() {
    // コントラクト不要。サーバーに登録するだけ
  }

  /**
   * クエストを受注する
   */
  public static async receivedOrder(
    contractId: string,
    requesterPublicKey: string,
    fee: SystemFee,
    node: NodeInfo,
    network: Network
  ) {
    const workerPublicKey = this.getActivePublicKey();
    const systemPublicKey = this.getSystemPublicKey();

    const aggregateTransaction = await createRecievedOrderAggregateTransaction(
      contractId,
      requesterPublicKey,
      workerPublicKey,
      systemPublicKey,
      fee.deposit,
      network
    );

    // 本番フロント用
    //setTransaction(aggregateTransaction);
    //const signedAggTransaction = await requestSign();

    // アグボンアナウンス --> ハッシュロック
    const signedTransaction = this.sendAggregateTransaction(
      aggregateTransaction,
      node,
      network
    );

    // ここでDBのQuestを編集する --> API を用意しておくのでAPIを叩く想定で
    // ハッシュを登録しておくと後ほど検索に便利
    // insert...quest table, hash colom -> signedAggTransaction.hash
    // 書き方全然分からないのでこんなイメージでｗ
  }

  /**
   * クエストを納品する
   */
   public static async deliveredOrder(
    contractId: string,
    requesterPublicKey: string,
    fee: SystemFee,
    node: NodeInfo,
    network: Network
  ) {
    // 後ほど作成する
    const workerPublicKey = this.getActivePublicKey();
    const systemPublicKey = this.getSystemPublicKey();
  }
}
