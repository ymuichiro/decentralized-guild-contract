import { MosaicId, NetworkType, PublicAccount } from 'symbol-sdk';

export const networkType = NetworkType.TEST_NET;
export const node = 'http://test01.xymnodes.com:3000';
export const generationHash = '7FCCD304802016BEBBCD342A332F91FF1F3BB5E902988B352697BE245F48E836';
export const adminPublicKey = 'CD5BBD868762461096AAEFF3ECC4254099F9B60F538CF3EB47359F27A9185060';
export const epochAdjustment = 1637848847;
export const networkCurrencyMosaicId = new MosaicId('3A8416DB2D53B6C8');

/*
export const networkType = NetworkType.MAIN_NET;
export const node = 'https://hideyoshi.mydns.jp:3001';
export const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
export const adminPublicKey = 'F5F70B12E4DF75AAA1131D3F16671F3043CF8ECA98AB30758F5124A7FD545D86';
export const epochAdjustment = 1615853185;
export const networkCurrencyMosaicId = new MosaicId('6BED913FA20223F8');
*/

export const adminPublic = PublicAccount.createFromPublicKey(adminPublicKey,networkType);
export const guildUserMetadataKey = 'GuildUser';
export const networkCurrencyDivisibility = 6;
export const createAccountTaxFee = 0;
export const createQuestTaxFee = 0;
export const acceptQuestTaxFee = 0;
export const questMetadataKey = 'QuestDetails';
export const createAccountTaxMessage = 'Create Account Fee';
export const createQuestTaxMessage = 'Create Quest Fee';
