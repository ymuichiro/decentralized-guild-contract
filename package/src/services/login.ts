import { EncryptedMessage, PublicAccount, Account} from 'symbol-sdk';
import { networkType } from '../config';

export type VerifiedSss = {
  signerAddress: string,
  iat: number,
  verifierAddress: string,
  netWork: number
}

export const auth = async function (userPublicKey: string, token: string) {
  try {
    const userPublic = PublicAccount.createFromPublicKey(userPublicKey, networkType);
    const msg = new EncryptedMessage(token, userPublic);
    const verifier = Account.createFromPrivateKey(
      process.env.VERIFIER_PRIVATE_KEY!,
      networkType,
    );
    const verified: VerifiedSss = JSON.parse(verifier.decryptMessage(msg, PublicAccount.createFromPublicKey(userPublicKey, networkType)).payload);
    return verified;
  } catch {
    throw new Error('署名検証に失敗しました');
  }
};
