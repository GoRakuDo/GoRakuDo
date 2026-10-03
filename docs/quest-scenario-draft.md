# 語楽道クエスト シナリオ叩き台

本ドキュメントは、ホームページRPG化プロジェクトのシナリオ案（序章・1章）です。
インドネシア語の台詞は、ドラクエ風ダイアログボックスでの表示を想定しています。

---

## 序章: 「出会いと疑問」（Pertemuan dan Tanda Tanya）

**シーン描写**: 部屋（または夜のデスク）。案内役（AI Kasou Yoshia）がプレイヤーを迎える。

### ダイアログフロー

**案内役**:
JP:「ちょっと待っててね...」
ID: `"Tunggu sebentar ya..."`

**案内役**:
JP:「(*´∀`)/いらっしゃーい！日本語を勉強したい方ですか？それと今お勉強されています？」
ID: `"Halo! Selamat datang! (*´∀`)/ Kamu mau mulai belajar bahasa Jepang, atau emang lagi belajar sekarang?"`

#### 選択肢 1
- **[はい！]** → ID: `[Iya!]`
  - **案内役**:
    JP:「じゃあ、話が早いです！うち（語楽道）は自然言語習得っていう方式で教えてます。それはイマージョンって言うんです。」
    ID: `"Wah, pas banget kalau gitu! Di GoRakuDo, kita pakai metode pemerolehan bahasa alami. Namanya 'Immersion'."`
  - **案内役（イマージョン解説）**:
    JP:「イマージョンは文法と翻訳なしで、ゼロから赤ちゃんみたいに自然習得するんです。」
    ID: `"Immersion itu belajar tanpa ngafal tata bahasa atau nerjemahin, persis kayak bayi yang menyerap bahasa pertamanya secara alami dari nol."`
- **[いいえ]** → ID: `[Nggak juga]`
  - **案内役（見送りルート → ホーム戻り）**:
    JP:「そうっすか？また今度で興味があればぜひ、大歓迎です！」
    ID: `"Oh gitu ya? Santai aja! Kalau kapan-kapan tertarik, pintu GoRakuDo selalu terbuka buat kamu!"`
    - ボタン: `[Sampai jumpa!]`（またね！） → 押すと `localStorage` にフラグ保存して `/` へ戻る。
  - **再訪時（フラグ保持者）**:
    JP:「おかえり！始めようか？」
    ID: `"Wah, kamu balik lagi! Gimana, mau mulai sekarang?"`
    （「はい！」で上記イマージョン解説へ合流）

---

**案内役**:
JP:「インドネシア語を片言で話してる日本人はみたことあります？」
ID: `"Ngomong-ngomong, kamu pernah liat orang Jepang yang ngomong bahasa Indonesia tapi masih kaku atau terbata-bata?"`

#### 選択肢 2
- **[あったことありますね...]** → ID: `[Pernah sih...]`
- **[まだあったことないです。]** → ID: `[Belum pernah, deh.]`

---

**案内役**:
JP:「僕の知り合いは、8年もインドネシア語を勉強してきたのにまだ全然上手く話せてないね」
ID: `"Kenalanku tuh udah 8 tahun belajar bahasa Indonesia, tapi sampai sekarang ngomongnya masih belum lancar sama sekali, lho."`

**プレイヤー（心の声 / 合いの手）**:
JP:「外国語を勉強するのが難しいんですね」
ID: `"Emang belajar bahasa asing itu sesusah itu, ya?"`

**案内役**:
JP:「実は簡単だけど、どうやって勉強するによって結果が違うんですよ。僕の知り合いはどうやって勉強か、みて行こうか？」
ID: `"Sebenernya gampang kok! Cuma caranya aja yang bikin hasilnya beda jauh. Mau liat gimana cara kenalanku itu belajar?"`

---

### アクションボタン（第1話への誘導）
ダイアログ内に次の決定ボタンを表示：
- **ボタン**: **「よろしくお願いします。」**
  - ID表記: `[Siap, mohon bimbingannya!]`（または `[Oke, ayo kita lihat!]`）
  - 挙動: クリックで画面が暗転し、第1話（教室の日本人シーン）へ遷移。

---

## 1章: 「分かれ道」

**シーン描写**: ヒーローの後ろ姿。前方には二つの道。左は茨に覆われた暗い道、右は温かい光に包まれた道。

**案内役**:
"Lihatlah di depanmu. Ada dua jalan yang membentang jauh."
（見ろ。目の前には二つの道が続いている。）

**案内役**:
"Jalan kiri: 'Metode Tradisional'. Menghafal rumus, menerjemahkan, dan ujian terus-menerus."
（左の道：「従来の勉強方法」。文法暗記、翻訳、テストの繰り返し。）

**案内役**:
"Banyak orang terjebak di sini, lelah, lalu menyerah di tengah jalan. Apakah kamu ingin lewat sana?"
（多くの人がここで疲れ果て、途中で挫折する。そこを通りたいか？）

**プレイヤー**:
"Tidak... Aku tidak ingin menyerah seperti itu."
（いや...そんなふうに挫折したくない。）

**案内役**:
"Bagus. Itu jalan menuju 'kematian' motivasimu."
（いい返事だ。それはやる気が死ぬ道だ。）

**案内役**:
"Lihat jalan kanan: 'Metode Alami'. Seperti cara bayi mempelajari bahasa pertamanya."
（右の道を見ろ：「自然習得型」。赤ちゃんが母語を覚える方法だ。）

**案内役**:
"Tanpa penjelasan tata bahasa, otakmu akan menyerap pola bahasa secara otomatis."
（文法説明なしで、脳が勝手に言語パターンを吸収していく。）

**案内役**:
"Inilah yang disebut 'Immersion'. Memberimu 'pesan yang bisa kamu pahami' dalam jumlah besar."
（これこそが「イマージョン」だ。理解できるインプットを大量に浴びるんだ。）

**案内役**:
"Pilih jalanmu. Apakah kamu siap untuk terbangun dari tidur panjangmu?"
（道を選べ。長い眠りから覚める準備はできているか？）

---

## 執筆メモ
- **意図**: RPGとしての没入感を最優先し、ユーザーのビートを反映して「邪道＝堅い話し方・石化」のメタファーを導入。
- **省略した内容**: 学習の具体的なツールやテクニックは2章以降に回した。
- **更新内容**: 序章をユーザーの要望に基づき、より親しみやすく、かつ学習の目的を明確にした構成へ書き換え。
- **確認事項**: 
    - 4つの戒律のインドネシア語訳は、初心者にも通じる自然な表現か？
    - キャラクター（案内役）の口調は、「優しくも熱い」バランスになっているか？
    - 「分かれ道」のメタファーは、インドネシアの学習者にもピンとくるか？
