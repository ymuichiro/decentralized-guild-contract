import { PublicAccount, SignedTransaction, RepositoryFactoryHttp, HashLockTransaction, Deadline, Mosaic, UInt64 } from 'symbol-sdk';
import { networkType, node, epochAdjustment, networkCurrencyMosaicId, networkCurrencyDivisibility } from '../config'
import { filter, delay, mergeMap } from 'rxjs';

export const createJoinHashLockTransaction = async function (signedAggTransaction: SignedTransaction) {
    const hashLockTransaction = HashLockTransaction.create(
        Deadline.create(epochAdjustment),
        new Mosaic(
            networkCurrencyMosaicId,
            UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility)),
        ),
        UInt64.fromUint(5760),
        signedAggTransaction,
        networkType,
    ).setMaxFee(100);
    return hashLockTransaction;
}

export const announceAggregateBonded = async function (signedAggTransaction: SignedTransaction, signedHashLockTransaction: SignedTransaction) {
    const repositoryFactory = new RepositoryFactoryHttp(node);
    const listener = repositoryFactory.createListener();
    const transactionHttp = repositoryFactory.createTransactionRepository();

    const signer = PublicAccount.createFromPublicKey(
        signedHashLockTransaction.signerPublicKey,
        networkType,
    );
    transactionHttp
        .announce(signedHashLockTransaction)
        .subscribe(
            (x) => {
            console.log(x);
        },
            (err) => console.error(err),
        );
    listener.open().then(() => {
        console.log('listener open');
        listener.newBlock();
        listener
            .confirmed(signer.address)
            .pipe(
                filter((tx) => {
                    console.log(tx);
                return (
                    tx.transactionInfo !== undefined &&
                    tx.transactionInfo.hash ===
                        signedHashLockTransaction.hash
                );
            }),
            delay(5000),
            mergeMap((_) => {
                return transactionHttp.announceAggregateBonded(signedAggTransaction,);
            }),
        )
        .subscribe(
            (x) => {
                console.log('tx Ok!!!', x);
                listener.close();
            },
            (err) => {
                console.error(err);
                listener.close();
            },
        );
    });
}