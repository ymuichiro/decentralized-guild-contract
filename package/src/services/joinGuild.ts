import { User } from '../models/User';
import { PublicAccount, AccountMetadataTransaction, Deadline, KeyGenerator, Convert, AggregateTransaction, TransferTransaction, Mosaic, UInt64, PlainMessage, HashLockTransaction, SignedTransaction } from 'symbol-sdk';
import { networkType, guildUserMetadataKey, epochAdjustment, ownerPublic, createAccountTaxFee, networkCurrencyMosaicId, createAccountTaxMessage, networkCurrencyDivisibility } from '../config'

export const createJoinGuildAggregateTransaction = async function (userData: User) {
    const json = JSON.stringify(userData);
    const userPublic = PublicAccount.createFromPublicKey(
        userData.publicKey,
        networkType,
    );
    const metaTx = AccountMetadataTransaction.create(
        Deadline.createEmtpy(),
        userPublic.address,
        KeyGenerator.generateUInt64Key(guildUserMetadataKey),
        json.length,
        Convert.utf8ToUint8(json),
        networkType,
    );

    let aggTx = AggregateTransaction.createBonded(
        Deadline.create(epochAdjustment),
        [metaTx.toAggregate(ownerPublic)],
        networkType,
        [],
    ).setMaxFeeForAggregate(100, 1);

    if (createAccountTaxFee != 0) {
        const taxTx = TransferTransaction.create(
            Deadline.createEmtpy(),
            ownerPublic.address,
            [
                new Mosaic(
                    networkCurrencyMosaicId,
                    UInt64.fromUint(createAccountTaxFee),
                ),
            ],
            PlainMessage.create(createAccountTaxMessage),
            networkType,
        );
        aggTx.innerTransactions.push(taxTx.toAggregate(userPublic));
        aggTx = aggTx.setMaxFeeForAggregate(100, 1);
    }
    return aggTx;
};
