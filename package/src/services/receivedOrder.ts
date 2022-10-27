import { PublicAccount, Deadline, AggregateTransaction, TransferTransaction, Mosaic, UInt64, PlainMessage } from 'symbol-sdk';
import { networkType, depositFeeAmount, epochAdjustment, systemPublic, networkCurrencyMosaicId } from '../config'

export const createRecievedOrderAggregateTransaction = async function (contractId: string, requesterPublicKey: string, workerPublicKey: string) {
    const requesterPublic = PublicAccount.createFromPublicKey(requesterPublicKey, networkType);
    const workerPublic = PublicAccount.createFromPublicKey(workerPublicKey, networkType);
    const transgerTransaction1 = TransferTransaction.create(
        Deadline.createEmtpy(),
        systemPublic.address,
        [new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(depositFeeAmount))],
        PlainMessage.create(contractId),
        networkType
    )
    const transgerTransaction2 = TransferTransaction.create(
        Deadline.createEmtpy(),
        systemPublic.address,
        [new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(depositFeeAmount))],
        PlainMessage.create(contractId),
        networkType
    )
    const aggregateTransaction = AggregateTransaction.createBonded(
        Deadline.create(epochAdjustment),
        [transgerTransaction1.toAggregate(requesterPublic),transgerTransaction2.toAggregate(workerPublic)],
        networkType
    ).setMaxFeeForAggregate(100, 2);

    return aggregateTransaction;
}