import { User } from '../models/User';
import { PublicAccount, Account, AccountMetadataTransaction, Deadline, KeyGenerator, Convert, AggregateTransaction, TransferTransaction, Mosaic, UInt64, PlainMessage, HashLockTransaction, SignedTransaction, RepositoryFactoryHttp } from 'symbol-sdk';
import { networkType, guildUserMetadataKey, generationHash, epochAdjustment, adminPublic, createAccountTaxFee, networkCurrencyMosaicId, createAccountTaxMessage, networkCurrencyDivisibility, node } from '../config'
import { filter, delay, mergeMap } from 'rxjs';

export const signUp = async function (userData: User) {
    const aggregateTransaction = await createSignUpAggregateTransaction(userData);
    /* SSSで以下のように署名を取る
    setTransaction(aggregateTransaction);
    const signedAggTransaction = await requestSign();
    */

    //SSSの代わりに以下で署名
    const dummyAcc = Account.createFromPrivateKey('286A162AED0E607978DDD84197F5A3A2EA6BA0971388FED0C5653EE643AD1906', networkType);
    const signedAggTransaction = dummyAcc.sign(aggregateTransaction, generationHash);
    console.log("signedAggTransaction:" + signedAggTransaction.payload)

    // アグボンはハッシュロックも署名が必要なため二度SSSで署名が必要。少しラグを設けないとバグるためのsetTimeout
    setTimeout(async () => {
        const hashlockTransaction = await createSignUpHashLockTransaction(signedAggTransaction);
        /* SSSで以下のように署名を取る
        setTransaction(hashlockTransaction);
        const signedHashLockTransaction = await requestSign();
        */
        //SSSの代わりに以下で署名
        const signedHashLockTransaction = dummyAcc.sign(hashlockTransaction, generationHash);
        console.log("signedHashLockTransaction:" + signedHashLockTransaction.payload)
        announceSignUpTransactions(signedAggTransaction, signedHashLockTransaction);
    },1000)
}

export const createSignUpAggregateTransaction = async function (userData: User) {
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
        [metaTx.toAggregate(adminPublic)],
        networkType,
        [],
    ).setMaxFeeForAggregate(100, 1);

    if (createAccountTaxFee != 0) {
        const taxTx = TransferTransaction.create(
            Deadline.createEmtpy(),
            adminPublic.address,
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

export const createSignUpHashLockTransaction = async function (signedAggTransaction: SignedTransaction) {
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

export const announceSignUpTransactions = async function (signedAggTransaction: SignedTransaction, signedHashLockTransaction: SignedTransaction) {
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