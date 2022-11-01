import { PublicAccount } from "symbol-sdk/dist/src/model/account";
import { Network } from "../models/Network";
import { Mosaic, MosaicId } from "symbol-sdk/dist/src/model/mosaic";
import { PlainMessage } from "symbol-sdk/dist/src/model/message";
import { SystemFee } from "../models/Tax";
import {
  AggregateTransaction,
  Deadline,
  MosaicSupplyRevocationTransaction,
  TransferTransaction,
} from "symbol-sdk/dist/src/model/transaction";
import { getAccountInfo } from '../http/getAccountInfo'
import { TEST_DATA } from "../config";
/**
 * ギルド脱退申請を行う際のコントラクト
 * モザイクIDは下位ギルドモザイクトークンを指定する
 */
export const leaveGuildTransaction = async function (
  applicantPublicKey: string,
  guildOwnerPublicKey: string,
  lowGuildMosaicId: string,
  systemFee: SystemFee,
  network: Network
): Promise<AggregateTransaction> {
  /*
    コントラクト作成
  */
  const applicantPublicAccount = PublicAccount.createFromPublicKey(
    applicantPublicKey,
    network.type
  );
  const ownerPublicAccount = PublicAccount.createFromPublicKey(
    guildOwnerPublicKey,
    network.type
  );

  const accountInfo = await getAccountInfo(applicantPublicAccount, TEST_DATA.NODE);
  const lowGuildMosaic = accountInfo.mosaics.find((mosaic)=>{
    return mosaic.id.toHex() == lowGuildMosaicId;
  })
  if (lowGuildMosaic == undefined) throw new Error("Don't have Low Mosaic");
  
  // Guild Owner --> 下位ギルドモザイクトークン没収 Worker
  const guildMosaicRevoke = MosaicSupplyRevocationTransaction.create(
    Deadline.createEmtpy(),
    applicantPublicAccount.address,
    new Mosaic(new MosaicId(lowGuildMosaicId), lowGuildMosaic.amount),
    network.type
  );

  // 脱退申請者に署名させるためのダミートランザクション
  const dummy = TransferTransaction.create(
    Deadline.createEmtpy(),
    ownerPublicAccount.address,
    [],
    PlainMessage.create("leave guild"),
    network.type
  );

  // アグリゲートボンデッドトランザクションを作成する
  let aggTx = AggregateTransaction.createBonded(
    Deadline.create(network.epochAdjustment),
    [
      guildMosaicRevoke.toAggregate(ownerPublicAccount),
      dummy.toAggregate(applicantPublicAccount)
    ],
    network.type,
    []
  ).setMaxFeeForAggregate(100, 1);

  // 作成完了したコントラクトを返却
  return aggTx;
};
