import { PublicAccount, Deadline, AggregateTransaction, TransferTransaction, Mosaic, UInt64, PlainMessage, MosaicId } from 'symbol-sdk';
import { networkType, kagenMosaicId, epochAdjustment, ownerPublic, createAccountTaxFee, networkCurrencyMosaicId, createAccountTaxMessage } from '../config'

export const createJoinGuildAggregateTransaction = async function (publicKey: string) {
    const applicantPublic = PublicAccount.createFromPublicKey(publicKey,networkType,);

    const guildMosaicTransfer = TransferTransaction.create(
        Deadline.createEmtpy(),
        applicantPublic.address,
        [new Mosaic(new MosaicId(kagenMosaicId),UInt64.fromUint(1))],
        PlainMessage.create('give guild mosaic'),
        networkType,
    );

    const dummy = TransferTransaction.create(
        Deadline.createEmtpy(),
        ownerPublic.address,
        [],
        PlainMessage.create('applicant'),
        networkType,
    );

    let aggTx = AggregateTransaction.createBonded(
        Deadline.create(epochAdjustment),
        [guildMosaicTransfer.toAggregate(ownerPublic), dummy.toAggregate(applicantPublic)],
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
        aggTx.innerTransactions.push(taxTx.toAggregate(applicantPublic));
        aggTx = aggTx.setMaxFeeForAggregate(100, 1);
    }
    return aggTx;
};
