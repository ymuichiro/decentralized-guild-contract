# スマコンパターン

`用語`

* サーバー側 ... Decentralized Guild のバックエンドサーバー
* RDB ... リレーショナルデータベース（MYSQL）

## Sign-Up

1. SSS Ex にて有効な Symbol Address の所有者か否かを検証する
2. サーバー側へ Public Key、アカウント名、アイコン を送信 --> RDB へ insert

## Quest set Request

1. Web サイトのフォームへ依頼内容を登録 --> この段階で Unique Key を発行
2. Worker が受注依頼
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

