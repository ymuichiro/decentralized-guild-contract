import { RepositoryFactoryHttp } from "symbol-sdk/dist/src/infrastructure/RepositoryFactoryHttp";
import { PublicAccount, AccountInfo } from "symbol-sdk/dist/src/model/account";
import { NodeInfo } from "../models/Network";
import { firstValueFrom } from "rxjs";

/**
 * APIからアカウント情報を取得する
 */
export const getAccountInfo = async function (
  publicAcc: PublicAccount,
  nodeInfo: NodeInfo,
) : Promise<AccountInfo>{
  const repositoryFactory = new RepositoryFactoryHttp(nodeInfo.url);
  const accountHttp = repositoryFactory.createAccountRepository();
  const accInfo = await firstValueFrom(accountHttp.getAccountInfo(publicAcc.address));
  return accInfo;
}
 