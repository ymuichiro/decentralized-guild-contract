# スマコンパターン

`用語`

* サーバー側
  * Decentralized Guild のバックエンドサーバー
* RDB 
  * リレーショナルデータベース（MYSQL）
* 受付嬢
  * AggregateTx等を発信するシステムアカウント（システム Symbol Address）

## RDB

```sql
CREATE TABLE IF NOT EXISTS user (
  `public_key`            TEXT
  `name`                  TEXT
  `icon`                  TEXT
  `created`               DATETIME
)
CREATE TABLE IF NOT EXISTS quest (
  `transaction_hash`      TEXT,
  `title`                 TEXT,
  `description`           TEXT,
  `reward`                INT,
  `requester_public_key`  TEXT,
  `worker_public_key`     TEXT,
  `status`                TEXT,
  `created`               DATETIME
)
```

## Sign-Up

### フロー

1. SSS Ex にて有効な Symbol Address の所有者か否かを検証する
2. サーバー側へ Public Key、アカウント名、アイコン を送信 --> RDB へ insert

## Set Quest Request & Order received & Reward

### フロー

1. Web サイトのフォームへ依頼内容を登録 --> この段階で Unique Key を発行
   1. RDB に書き込み
2. Worker が受注依頼
   1. RDB を更新 1-1 の id をキーにリクエスト中を表現
3. Worker の Public Key を送信
   1. 出来ればこの間チャット出来ると良い
4. Requester は Public Key より Worker の経歴を確認
5. Requester が受注依頼を承認 --> Worker の Public Key へ Aggregate Tx
   1. Requester + worker + System（受付嬢的SYSTEM ROLE）
6. Worker, System の両方が署名
   1. 受付手数料発生（手付金）
7. Quest 完了報告を Web サイトのフォームから登録
8. Requester は 7 を確認し問題なければ承認 --> 完了の Aggregate Tx
   1. Requester + worker + System（受付嬢的SYSTEM ROLE）
9.  8 の Tx で手付金の返金 + 報酬の移動（手数料さっぴき） + WRP の払い出しを行う
    1.  RDB を更新 1-1 の id をキーにリクエスト中を表現
    2.  なおこの際にギルド加入者の場合はギルドのアカウントに対してもWRPの払い出しを行う

### 補足
* 過去のクエスト履歴の検索は受付嬢アカウントからの発信から検索する

## Join the Guild && Leave the Guild

### フロー

1. 

