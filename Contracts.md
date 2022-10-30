# Decentralized Guild ToDo

### 発注時コントラクトフロー

1つのコントラクト処理内で以下対応を完結する。2つの子トランザクション内で、システムが預かり金の徴収を行いつつ、どの契約IDに対する処理かをオンチェーン上に記録する（契約IDはサーバー内のDatabaseを参照。契約内容全てを記録する事も可能であるが、個人情報等を記載された場合の対応が困難である為、システム的IDのみをコントラクト側には記録を行う）。

※ 預かり金 ... イタズラ、荒らしの防止として契約成立時に一定数の資産を徴収する。契約完了時には返却する。通報があった場合ロックする。

```mermaid
sequenceDiagram
    Requester（AggKicker）-->>Worker: 署名要求
    Requester（AggKicker）-->>System: InnerTx[預かり金with契約ID]
    Worker-->>System: InnerTx[預かり金with契約ID]
```

### 納品完了時コントラクトフロー

1つのコントラクト処理内で以下対応を完結する。発注時にシステムは預かり金を得ている為、このタイミングで返却する。ただし、システムは手数料（税収）を徴収する為、この際に預かり金を減産して返却する。

```mermaid
sequenceDiagram
    Requester（AggKicker）-->>System: 署名要求（契約IDと送信元を照合後、自動署名）
    System-->>Worker: [ITX]WRP加減算+預かり金返却（▲手数料）
    Requester（AggKicker）-->>Worker: [ITX]報酬支払（XYM）
    System-->>Requester（AggKicker）: [ITX]WRP加減算（失敗=減）+預かり金返却（▲手数料）
    System-->>Guild: [ITX]ギルドポイント加算or減算
```



### ギルド設立時コントラクトフロー

ギルドの建設時には以下のフローを行う。トークンの発行が必要であり、この処理を行う前にギルドオーナーに対して消費するトークンの明示を行い、承認があった場合、アカウントやトークンの作成が行われる。GuildOwnerアカウントは発行者のマルチシグアカウントとして構成される。Guild Ownerの変更時はマルチシグアカウントの組み替えで表現とする

※ worker ro requester が申請を行う為、Establisher = worker/requester

```mermaid
sequenceDiagram
    Establisher(AggKicker)-->>System: 署名要求
    Establisher(AggKicker)-->>GuidOwner: アカウント作成
    Establisher(AggKicker)-->>GuidOwner: マルチシグ（垢作成時に秘密鍵を一瞬サーバーが把握するので署名は要らない）
    System-->>GuidOwner: ギルドオーナーモザイク付与
    GuidOwner-->>GuidOwner: 下弦ギルドモザイク作成
    GuidOwner-->>GuidOwner: 上弦ギルドモザイク作成
    System-->>GuidOwner: メタデータで上下弦モザイクID
```



### ギルド加入/脱退時コントラクトフロー

ギルド加入の署名はトークンの所有により署名される。このトークンを下位トークンと呼ぶ。没収可能であり、ギルドへの加入有無のみを判別する

```mermaid
sequenceDiagram
    applicant(AggKicker)-->>GuidOwner: 署名要求
    GuidOwner-->>Worker: ギルドモザイク送付（リボーカブル）
```

### ギルド内評価用ポイントコントラクトフロー

ギルド内で貢献したものに専用のトークンをオーナーより発行する。上位トークンと呼ぶ。下位トークンのみでもギルド運営は可能であるが、上位トークンには以下の意味合いを持たせる。サーバー側には記録されず、所有数はBlockchainへ照会をかけるのみとする。

1. ギルド内で貢献する価値の向上 = 上位トークンの価値向上等でギルドを育てる意義を作る
2. ギルド内での議決権を示す = 上位トークンの所有者はギルド運営に参加が可能。所有数が議決権となる

```mermaid
sequenceDiagram
   Guild owner or 役員 -->> Worker: トークンの発行。没収は不可能（モザイク） 
```



