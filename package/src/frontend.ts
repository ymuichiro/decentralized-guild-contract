import { getActiveAccountToken, getActivePublicKey } from 'sss-module';
import { verifierPublicKey } from './config';
import { auth } from './services/login';

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
