import { MosaicId, NetworkType, PublicAccount } from 'symbol-sdk';

export const networkType = NetworkType.TEST_NET;
export const node = 'https://mikun-testnet.tk:3001';
export const generationHash = '7FCCD304802016BEBBCD342A332F91FF1F3BB5E902988B352697BE245F48E836';
export const establisherPublicKey = 'CD5BBD868762461096AAEFF3ECC4254099F9B60F538CF3EB47359F27A9185060';
export const ownerPublicKey = 'CD5BBD868762461096AAEFF3ECC4254099F9B60F538CF3EB47359F27A9185060';
export const epochAdjustment = 1637848847;
export const networkCurrencyMosaicId = new MosaicId('3A8416DB2D53B6C8');
export const verifierPublicKey = 'CD5BBD868762461096AAEFF3ECC4254099F9B60F538CF3EB47359F27A9185060';

export const ownerPublic = PublicAccount.createFromPublicKey(ownerPublicKey,networkType);
export const guildUserMetadataKey = 'GuildUser';
export const networkCurrencyDivisibility = 6;
export const createAccountTaxFee = 0;
export const createQuestTaxFee = 0;
export const acceptQuestTaxFee = 0;
export const questMetadataKey = 'QuestDetails';
export const createAccountTaxMessage = 'Create Account Fee';
export const createQuestTaxMessage = 'Create Quest Fee';

export const systemPublicKey = '6F50170029B2647B883EB43A7451104EC4086373814DC7A4D115825B3B705126';
export const mosaicSupplyAmount = 100000000;
export const guildOwnerMosaicIdsMetadataKey = 'guildOwnerMosaicIds';
export const guildMosaicId = "4EB02B2A69A6D891";
export const wrpId = "15C6DE40D310C2DA";
export const guildPointId = "5723ADD9F8610384";

// test
export const establisherPrivateKey = 'DEA5FDB45AEB9485F1D612B738DA3ECD7817E547D44B6D8123ACE15511AED7D1';
export const kagenMosaicId = '4EB02B2A69A6D891';
export const jougenMosaicId = '109C1C409343C449';