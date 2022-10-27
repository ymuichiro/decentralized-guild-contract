import { Account, Deadline, Convert, MosaicDefinitionTransaction, UInt64, MosaicNonce, MosaicId, MosaicFlags, PublicAccount, MosaicSupplyChangeTransaction, MosaicSupplyChangeAction, MultisigAccountModificationTransaction, TransferTransaction, Mosaic, PlainMessage, AccountMetadataTransaction, KeyGenerator, AggregateTransaction, Message, MessageFactory, MessageMarker } from 'symbol-sdk';
import { epochAdjustment, networkType , mosaicSupplyAmount, guildMosaicId, guildOwnerMosaicIdsMetadataKey, systemPublicKey, networkCurrencyMosaicId} from '../config';

export const establishGuildTransaction = async function (publicKey: string) {
    const guildMasterPubAcc = PublicAccount.createFromPublicKey(publicKey, networkType);
    const guildOwnerAcc = Account.generateNewAccount(networkType);
    const systemPubAcc = PublicAccount.createFromPublicKey(systemPublicKey, networkType);

    const multisigTransaction = MultisigAccountModificationTransaction.create(
        Deadline.createEmtpy(),
        1,
        1,
        [guildMasterPubAcc.address],
        [],
        networkType
    );
    const mosaicFeeTransaction = TransferTransaction.create(
        Deadline.createEmtpy(),
        guildOwnerAcc.address,
        [new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(100000000))],
        PlainMessage.create('transger fee'),
        networkType
    )
    const nonce1 = MosaicNonce.createRandom();
    const mosaicId1 = MosaicId.createFromNonce(nonce1, guildOwnerAcc.address);
    const mosaicDefinitionTransaction1 = MosaicDefinitionTransaction.create(
        Deadline.createEmtpy(),
        nonce1,
        mosaicId1,
        MosaicFlags.create(false, false, true, true),
        0,
        UInt64.fromUint(0),
        networkType,
    );
    const mosaicSupplyChangeTransaction1 = MosaicSupplyChangeTransaction.create(
        Deadline.createEmtpy(),
        mosaicDefinitionTransaction1.mosaicId,
        MosaicSupplyChangeAction.Increase,
        UInt64.fromUint(mosaicSupplyAmount * Math.pow(10, 0)),
        networkType,
    );
    const nonce2 = MosaicNonce.createRandom();
    const mosaicId2 = MosaicId.createFromNonce(nonce2, guildOwnerAcc.address);
    const mosaicDefinitionTransaction2 = MosaicDefinitionTransaction.create(
        Deadline.createEmtpy(),
        nonce2,
        MosaicId.createFromNonce(nonce2, guildOwnerAcc.address),
        MosaicFlags.create(false, true, true, false),
        0,
        UInt64.fromUint(0),
        networkType,
    );
    const mosaicSupplyChangeTransaction2 = MosaicSupplyChangeTransaction.create(
        Deadline.createEmtpy(),
        mosaicDefinitionTransaction2.mosaicId,
        MosaicSupplyChangeAction.Increase,
        UInt64.fromUint(mosaicSupplyAmount * Math.pow(10, 0)),
        networkType,
    );
    const guildMosaicTransaction = TransferTransaction.create(
        Deadline.createEmtpy(),
        guildOwnerAcc.address,
        [new Mosaic(new MosaicId(guildMosaicId), UInt64.fromUint(1))],
        PlainMessage.create("transfer guild mosaic"),
        networkType
    )
    const value = mosaicId1.toHex() + ',' + mosaicId2.toHex();
    const metadataTransaction = AccountMetadataTransaction.create(
        Deadline.createEmtpy(),
        guildOwnerAcc.address,
        KeyGenerator.generateUInt64Key(guildOwnerMosaicIdsMetadataKey),
        value.length,
        Convert.utf8ToUint8(value),
        networkType
    )

    const aggregateTransaction = AggregateTransaction.createBonded(
        Deadline.create(epochAdjustment),
        [
            multisigTransaction.toAggregate(guildOwnerAcc.publicAccount),
            mosaicFeeTransaction.toAggregate(guildMasterPubAcc),
            mosaicDefinitionTransaction1.toAggregate(guildOwnerAcc.publicAccount),
            mosaicSupplyChangeTransaction1.toAggregate(guildOwnerAcc.publicAccount),
            mosaicDefinitionTransaction2.toAggregate(guildOwnerAcc.publicAccount),
            mosaicSupplyChangeTransaction2.toAggregate(guildOwnerAcc.publicAccount),
            guildMosaicTransaction.toAggregate(systemPubAcc),
            metadataTransaction.toAggregate(systemPubAcc),
        ],
        networkType,
    ).setMaxFeeForAggregate(100, 2);

    const result = {
        aggregateTransaction,
        guildOwnerAcc
    }
    return result;
}