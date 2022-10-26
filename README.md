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

### トランザクションパターン
#### 受注時

種別：アグボン
発信者：受付嬢
受信者：Requester, Worker
中身：Symbol 0xym、本文に受注時の案件ID（RDBから引っ張ってきた）を書き込み。
--> Transaction が completed であることを確認したら RDB 側でステータスを対応中に変更する

### 完了報告時

WEB FORM　--> Requester チェック。承認したら報酬↓へ進む

### 報酬時

種別：アグボン
発信者：受付嬢
受信者：Requester, Worker
中身：Symbol 報酬分の枚数のxym、1WRP+1GPT（※ギルド加入時のみ）本文に受注時の案件ID（RDBから引っ張ってきた）を書き込み
--> Transaction が completed であることを確認したら RDB 側でステータスを完了に変更する


### 補足
* 過去のクエスト履歴の検索は受付嬢アカウントからの発信から検索する

## Join the Guild && Leave the Guild

### 加入時
1. 加入者はギルドオーナーに加入申請を行う（Web form）
2. ギルドオーナーは問題なければギルドモザイクのついた、リボーカブルトランザクションを発行
----
### 脱退時
1. 加入者はギルドオーナーに除隊申請を行う（Web form）
2. ギルドオーナーは問題なければギルドモザイクのついた、リボーカブルトランザクションを没収

### ニュアンス
1. 現実的にキック機能はいるだろう --> 信頼性を落とす輩が紛れた時、キックできないと困る = リボーカブルでやる
2. リボーカブルでギルド限定のMosaic がユーザーに渡される
3. 荒らしと判断されたユーザーはリボーカブルで剥奪される。優良ギルド員と認定されると、リボーカブルじゃないギルドモザイクが貰える
------- ここから future
3. 一定以上のギルドモザイクを持っているユーザーはギルド内の総会で議決権を持つ（議決機能を将来的に作る
4. ギルドモザイクを "本当の意味で所持" できるのはギルド役員のみ。役員はギルド員追加の権限を持つ（だって持ってるから）
5. ギルドモザイクの価値は取引所には上場はしていないので、その人々が決める。これを持っていると割引を受ける、売れる（入隊賄賂）etc

ある意味ちょっと生々しい、ギルドリーダーの手腕によっては修羅場発生機能 

1. 発行はギルドオーナー。モザイクを好きなだけ発行する
2. ギルドオーナーは加入希望者にリボーカブルでモザイクを送る
3. 加入者はこのモザイクを各所に見せて加入を証明する
4. 悪いことをすると没収されて除隊される
5. ただしギルドオーナーに信頼されるとリボーカブルじゃないトランザクションでモザイクが貰える
6. リボーカブルじゃないモザイクを持った加入者は、議決権としてカウントされる
