# 語楽道クエスト シナリオ叩き台

本ドキュメントは、ホームページRPG化プロジェクトのシナリオ案（序章〜第15章）です。
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
  - 挙動: クリックで画面が暗転し、第1章（教室の日本人シーン）へ遷移。

---

## 第1章: 「なぜ従来の文法・翻訳では話せないのか」（Kenapa Metode Tradisional Gagal?）

**シーン描写**: 案内役に連れられて訪れたインドネシア語学校の教室。窓の外を見つめながら頭を抱える日本人の知り合いの姿がある。

**案内役**:
JP:「ほら、あそこにいるのが僕の知り合いの日本人だよ。8年間、文法書を読んで単語を暗記して頑張ってきたんだ。」
ID: `"Nah, itu kenalanku. Dia udah 8 tahun belajar rajin banget, ngafal buku tata bahasa dan daftar kosa kata."`

**プレイヤー**:
JP:「8年も真面目に勉強したのに、なんで困った顔をしているの？」
ID: `"Udah 8 tahun belajar rajin, tapi kok mukanya keliatan pusing gitu?"`

**案内役**:
JP:「現地の人と話そうとすると、頭の中で『1.日本語で考える → 2.文法公式に当てはめる → 3.単語を探す』ってやっちゃうから、CPUがオーバーロードして言葉が出てこないんだよね。」
ID: `"Pas mau ngomong sama warga lokal, otaknya sibuk mikir: '1.pikir bahasa Indonesia -> 2.cocokin rumus tata bahasa -> 3.cari kata'. Hasilnya CPU-nya overload, jadi macet deh!"`

#### 選択肢 1
- **[それって、まるでプールの外で水泳の公式を暗記してるみたいだね...]** → ID: `[Kayak ngafal rumus berenang di pinggir kolam tanpa nyemplung ya...]`
  - **案内役**:
    JP:「まさにその通り！どれだけ教科書を暗記しても、水に入らないと泳げるようにならないのと同じなんだ。」
    ID: `"Tepat banget! Sebanyak apapun kamu ngafal buku, kalau nggak nyemplung ke air, ya nggak bakal bisa berenang."`

**案内役**:
JP:「これが、私たちが学校で教わってきた **`Metode Tradisional`** の罠なんだよ。」
ID: `"Itulah jebakan dari **`Metode Tradisional`** yang biasa diajarin di sekolah-sekolah."`

---

## 第2章: 「プロイセン・メソッドと化石化（Fossilization）の正体」（Asal-Usul Metode Prusia & Bahaya Fosilisasi）

**シーン描写**: 古い図書館の書庫。何世紀も前の分厚いラテン語の古文書と、石化した彫像が並ぶ静かな回廊。

**案内役**:
JP:「そもそも、なんで世界中の学校や語学スクールであんな非効率な **`Metode Tradisional`** が使われてると思う？」
ID: `"Menurutmu, kenapa sih sekolah dan tempat kursus di seluruh dunia masih pakai **`Metode Tradisional`** yang nggak efisien itu?"`

**プレイヤー**:
JP:「うーん、昔からみんなそうやって勉強してきたからじゃない？」
ID: `"Hmm, mungkin karena dari dulu emang udah gitu cara orang belajar?"`

**案内役**:
JP:「実はこれ、18世紀のヨーロッパで『すでに話す人がいない死んだ言語（ラテン語や古代ギリシャ語）』の古文書を紙の上で解読するために作られた仕組みのなごりなんだ。」
ID: `"Sebenernya itu sisa sejarah abad ke-18 di Eropa, yang dibuat buat menerjemahkan naskah kuno bahasa mati (kayak bahasa Latin) di atas kertas."`

**案内役**:
JP:「そんな『読書用の翻訳システム』を生きた言語にそのまま使っちゃったから大惨事になる。さらに怖いのが、インプットが足りないうちに無理やり喋ろうとすると起きる **Fosilisasi（化石化）** だよ。」
ID: `"Sistem 'baca & terjemah' itu kalau dipaksain ke bahasa hidup, ya rusak. Ditambah lagi ada bahaya **Fosilisasi**, yaitu kebiasaan salah yang nempel terus di otak kalau kita maksain ngomong sebelum waktunya."`

#### 選択肢 1
- **[化石化...？ 変なクセや間違いが脳に固着しちゃうってこと？]** → ID: `[Fosilisasi...? Maksudnya kesalahan-kesalahan kecil nempel permanen di otak?]`
  - **案内役**:
    JP:「そう！一度こびりついた不自然なクセは、後から直すのがめちゃくちゃ大変なんだ。だからこそ、正しい順番が大事なんだよね。」
    ID: `"Betul! Kalau udah mendarah daging, susah banget dibenerinnya. Makanya urutan belajarnya harus bener."`

---

## 第3章: 「歴史の賢人たちからチョムスキー、クラッシェン博士へ」（Jejak Para Pemikir: Dari Sejarah hingga Sains Modern）

**シーン描写**: 時代を超えるタイムラインの回廊（History Biome）。過去の偉人たちの肖像画が輝いている。

**案内役**:
JP:「でもね、**`Metode Tradisional`** が広がる前の1,800年間、人類はみんな自然に外国語を身につけていたんだよ。」
ID: `"Tapi ingat, sebelum **`Metode Tradisional`** merajalela, selama 1.800 tahun umat manusia belajar bahasa asing secara alami, lho!"`

**プレイヤー**:
JP:「昔の人って、どうやって言葉を覚えてたの？」
ID: `"Emang orang jaman dulu cara belajarnya gimana?"`

**案内役**:
JP:「聖アウグスティヌスも、ルネサンスの哲学者モンテーニュも、『文法書なし』で、周りの会話や環境に飛び込んでネイティブのようにラテン語を覚えたんだ。ルールを暗記したわけじゃない。」
ID: `"Santo Agustinus sampai Montaigne belajar bahasa Latin tanpa buku tata bahasa, tapi langsung nyemplung ke lingkungan aslinya."`

**案内役**:
JP:「そして20世紀、その『人類本来の自然な習得メカニズム』を現代科学として解き明かしたのが、ノーム・チョムスキーとスティーヴン・クラッシェン博士なんだ！」
ID: `"Dan di abad ke-20, mekanisme alami itu dibuktikan secara ilmiah oleh Noam Chomsky dan Prof. Stephen Krashen!"`

#### 選択肢 1
- **[科学的に証明されているなら、安心して従えそうだね！]** → ID: `[Kalau udah dibuktikan secara ilmiah, jadi tenang ngikutinnya!]`
  - **案内役**:
    JP:「でしょ？遠回りに見えて、これが一番確実で早い近道なんだ。」
    ID: `"Makanya! Keliatannya kayak muter, tapi justru ini jalan paling cepet dan pasti."`

---

## 第4章: 「チョムスキーのLADとクラッシェン博士の仮説を深掘り」（Rahasia Otak: LAD Chomsky & Hipotesis Krashen）

**シーン描写**: 近未来的な脳内のホログラム研究所。青く光る巨大な神経回路網が浮かんでいる。

**案内役**:
JP:「まずはチョムスキーが発見した **LAD（Language Acquisition Device / 言語獲得装置）** の話からしようか。」
ID: `"Pertama, kita bahas **LAD (Language Acquisition Device)** yang ditemuin sama Chomsky."`

**プレイヤー**:
JP:「LADって、人間の頭の中にある『言語を自動でダウンロードする器官』みたいなもの？」
ID: `"LAD itu kayak 'alat download bahasa otomatis' di dalam kepala kita ya?"`

**案内役**:
JP:「そう！例えば変なインドネシア語を聞いた瞬間に、『あれ、なんかこの表現おかしいな』って直感で分かるでしょ？あれは君の脳にLADが備わっている証拠なんだ。」
ID: `"Tepat! Contohnya pas kamu denger kalimat bahasa Indonesia yang aneh, instingmu langsung bilang 'Eh, kok rasanya janggal ya?'. Itu bukti LAD-mu aktif."`

**案内役**:
JP:「そしてクラッシェン博士は、このLADを動かすための決定的な法則を突き詰めた。それが **`Metode Alami`** の核心にある **Comprehensible Input（理解可能なインプット）** と **情意フィルター（Affective Filter）** の理論だよ。」
ID: `"Dan Prof. Krashen nemuin kunci buat ngidupin LAD itu: **Comprehensible Input** dan **Affective Filter** yang jadi inti dari **`Metode Alami`**."`

#### 選択肢 1
- **[リラックスして、分かる情報を取り込み続けることが大事なんだね]** → ID: `[Intinya harus rileks dan terus nyerap informasi yang bisa kita pahami ya]`
  - **案内役**:
    JP:「大正解！不安や退屈を取り除いて、楽しくインプットを浴びることがすべての始まりなのさ。」
    ID: `"Bener banget! Singkirkan rasa stres, terus nikmati prosesnya. Itu awal dari segalanya."`

---

## 第5章: 「理解度のコンパス：理解量 × 脳の負荷（Effort）」（Kompas Pemahaman: Jumlah Paham × Tingkat Usaha）

**シーン描写**: 冒険のステータス画面が開く。画面中央には「Comprehension（理解度）」と「Effort（脳の負荷）」のゲージが表示されている。

**案内役**:
JP:「ここからは、ゼロからネイティブ領域に至るまでの具体的な階段を登っていこう。まずは自分の現在地を知るためのコンパスだ。」
ID: `"Mulai sekarang, kita naik tangga dari nol menuju level native. Ini kompas buat ngecek posisi kamu sekarang."`

**プレイヤー**:
JP:「どれくらい理解できているかって、どうやって測ればいいの？」
ID: `"Gimana caranya kita tau seberapa paham kita sama suatu materi?"`

**案内役**:
JP:「ジムの運動強度（RPE）と同じで、**『どれくらい意味が分かるか（Comprehension）』** と **『どれくらい脳のエネルギーを使っているか（Effort）』** の2軸で考えるんだ。」
ID: `"Sama kayak intensitas olahraga, kita ukur pakai 2 hal: **seberapa paham kamu** dan **seberapa besar usaha otakmu (Effort)**."`

**案内役**:
JP:「リラックスして内容がスッと入ってくる状態を作るのが、効率的なイマージョンのコツなのさ。」
ID: `"Kuncinya adalah bikin otak rileks tapi tetap nyerap makna dengan natural."`

#### 選択肢 1
- **[自分のペースで無理なく続けられそう！]** → ID: `[Keliatannya bisa dijalanin dengan santai dan konsisten!]`
  - **案内役**:
    JP:「その意気！じゃあさっそく、最初のステップ（Level 1 & 2）からのぞいてみよう。」
    ID: `"Mantap! Yuk, kita intip Level 1 & 2-nya."`

---

## 第6章: 「Level 1 & 2：雑音の海から『知ってる単語』が光り出す」（Level 1–2: Dari Suara Bising ke Kata Pertama）

**シーン描写**: 深い霧に包まれた海岸。遠くから見慣れない外国語の波音が聞こえてくる。

**案内役**:
JP:「**Level 1 & 2** のスタート地点は、聞こえてくる言葉が全部『ただの雑音』に聞こえる状態だよ。」
ID: `"Titik awal **Level 1 & 2** itu saat semua suara asing terdengar kayak 'bising' yang nggak ada artinya."`

**プレイヤー**:
JP:「えっ、何言ってるか全然分からない...これって正常なの？」
ID: `"Hah, nggak ngerti sama sekali... Ini normal kan?"`

**案内役**:
JP:「当たり前！最初は脳が音の境界線をデコードしている最中なんだ。焦らなくていいよ。ここでひらがな・カタカナの基礎と、Ankiを使った最初の基礎単語の種まき（Bibit Intuisi）を始めよう。」
ID: `"Normal banget! Otak lagi nyusun pola suara dasarnya. Jangan panik. Sambil mulai kenal huruf dasar dan Anki buat nanam **Bibit Intuisi** kosa kata pertama."`

**案内役**:
JP:「視覚情報が多いアニメや子供向け動画を見るのもおすすめだよ！」
ID: `"Nonton anime atau video anak-anak dengan banyak visual juga ngebantu banget!"`

#### 選択肢 1
- **[最初は分からなくて当然なんだね。少しずつ単語を拾ってみる！]** → ID: `[Wajar ya kalau awal-awal belum paham. Pelan-pelan coba tangkap kata yang familiar!]`
  - **案内役**:
    JP:「その調子！『あ、今の単語知ってる！』って瞬間が増えてきたら、次のステージへ進む合図さ。」
    ID: `"Nah gitu! Nanti kalau mulai sering denger kata yang kamu tau, itu tandanya kamu naik level."`

---

## 第7章: 「Level 3：点と点が現れる — フレーズの断片を拾う」（Level 3: Menangkap Potongan Frasa）

**シーン描写**: 霧が少し晴れて、海のなかに小さな島や岩がぽつりぽつりと見えてきた景色。

**案内役**:
JP:「**Level 3** に来ると、全体のストーリーはまだ追えなくても、知ってる単語や短い定型フレーズが耳に飛び込んでくるようになるよ。」
ID: `"Di **Level 3**, walau jalan cerita utuh belum ketangkep, kosa kata familiar dan frasa pendek mulai sering nyantol di telinga."`

**プレイヤー**:
JP:「あ、『Halo』とか『Arigatou』以外の短いフレーズが聞こえた気がする！」
ID: `"Eh, kayaknya tadi denger frasa pendek selain kata sapaan biasa!"`

**案内役**:
JP:「そう！完璧に理解しようとせず、『おっ、今Ankiで見たフレーズだ！』っていう小さな発見（気づき / Noticing）を楽しむのがコツなんだ。」
ID: `"Bener! Nggak usah maksain paham 100%. Nikmati aja momen 'Eh, itu kan frasa yang baru kubaca di Anki!'."`

**案内役**:
JP:「この段階から、日本語字幕（JP Sub）を少しずつ活用して音と文字を一致させると効果的だよ。」
ID: `"Mulai tahap ini, aktifin subtitle bahasa aslinya pelan-pelan biar suara dan bentuk tulisannya nyambung di kepala."`

#### 選択肢 1
- **[小さな気づきを見つけるのが楽しくなってきたかも！]** → ID: `[Mulai seru nih nyari penemuan-penemuan kecil kayak gitu!]`
  - **案内役**:
    JP:「そのワクワク感が脳のLADを最高の状態にしてくれるんだよね。」
    ID: `"Rasa penasaran itu yang bikin LAD di otakmu kerja maksimal."`

---

## 第8章: 「Level 4：カケラから話題を推測する — Yomitanと辞書の解禁」（Level 4: Menebak Topik & Senjata Yomitan）

**シーン描写**: プレイヤーの手元に、魔法のルーペのような強力なツール（Yomitan）が光り輝く。

**案内役**:
JP:「**Level 4** では、単語の半分くらいが分かって、映像や状況と合わせれば『今こういう話題をしてるな』と推測できるようになるよ。」
ID: `"Di **Level 4**, setengah kosa kata udah mulai paham. Kalau digabung sama visual, kamu bisa nebak 'Oh, mereka lagi ngomongin ini nih'."`

**プレイヤー**:
JP:「単語を調べるのが大変になってきたんだけど、どうすればいい？」
ID: `"Mulai agak repot nih kalau harus bolak-balik ngecek kamus manual..."`

**案内役**:
JP:「ここで登場するのが、ブラウザ辞書ツール **Yomitan** という最強の武器だ！マウスを重ねるだけで1秒でポップアップ確認できるから、学習のテンポが全然落ちないんだ。」
ID: `"Makanya kita pakai senjata pamungkas: ekstensi kamus **Yomitan**! Cukup arahkan kursor, artinya langsung muncul dalam sedetik tanpa bikin alur nontonmu rusak."`

**案内役**:
JP:「日常系アニメや簡単なコンテンツで、この武器を片手に **`i+1`** のインプットを回していこう。」
ID: `"Pakai senjata ini buat muterin siklus **`i+1`** lewat anime slice-of-life atau konten ringan lainnya."`

#### 選択肢 1
- **[Yomitanのおかげで調べるストレスが消えた！これならサクサク進む！]** → ID: `[Yomitan bikin malas ngecek kamus hilang! Jadi sat-set belajarnya!]`
  - **案内役**:
    JP:「でしょ？ストレスフリーでイマージョンを続けるのが一番の秘訣さ。」
    ID: `"Kan? Imersi tanpa stres itu rahasia utamanya."`

---

## 第9章: 「Level 5：大意（Gist）が掴める — 文脈マイニングの始まり」（Level 5: Menangkap Inti Cerita & Sentence Mining）

**シーン描写**: 部屋の中に、お気に入りのセリフや単語カードが綺麗にファイリングされたボードが完成していく。

**案内役**:
JP:「**Level 5** になると、登場人物がどう思っているか、大まかなストーリーのジスト（Gist）がしっかり掴めるようになるんだ。」
ID: `"Masuk **Level 5**, inti cerita (gist) dan perasaan karakternya udah mulai ketangkep dengan jelas."`

**プレイヤー**:
JP:「ストーリーが分かるようになってくると、さらに面白くなってきた！」
ID: `"Mulai ngerti jalan ceritanya, makin ke sini makin seru!"`

**案内役**:
JP:「ここからが面白いところ。自分が好きなコンテンツから『1単語だけ分からない文（1T文）』を採取してAnkiに登録する **Sentence Mining（文マイニング）** を始めよう。」
ID: `"Nah, mulai dari sini serunya. Ambil kalimat yang cuma punya 1 kata asing (1T sentence) dari konten favoritmu, terus masukkan ke Anki lewat **Sentence Mining**."`

**案内役**:
JP:「勉強が『辛い作業』から『自分だけのコレクションゲーム』に変わる瞬間だよ！」
ID: `"Ini momen di mana belajar berubah dari 'tugas berat' jadi 'game koleksi' pribadi!"`

#### 選択肢 1
- **[自分の好きなセリフでカードを作るの、めちゃくちゃ楽しそう！]** → ID: `[Bikin kartu dari dialog favorit tuh kedengerannya seru banget!]`
  - **案内役**:
    JP:「自分の『好き』がそのまま最強の学習リソースになるんだから最高だよね。」
    ID: `"Keren kan? Hobimu sendiri berubah jadi sumber belajar paling ampuh."`

---

## 第10章: 「Level 6 & 7：ストーリーを追えるが、時々糸が切れる」（Level 6–7: Mengikuti Alur & Menjaga Fokus）

**シーン描写**: 長いトンネルを抜ける途中。少し先の視界が開けてきたが、まだ所々に深い霧がかかっている。

**案内役**:
JP:「**Level 6 & 7** は、物語の筋は追えるけれど、ちょっと集中が切れると置いていかれやすい『中級の壁』のステージだ。」
ID: `"Di **Level 6 & 7**, jalan cerita utama bisa diikuti, tapi kalau fokusnya sedikit buyar, kamu bisa ketinggalan. Ini 'tembok menengah'."`

**プレイヤー**:
JP:「なんとなく分かるんだけど、油断すると頭が追いつかなくなることがあるなあ。」
ID: `"Paham sih, tapi kadang kalau nggak fokus, otak langsung agak ketinggalan."`

**案内役**:
JP:「そう、ここが踏ん張りどころ。YouTubeの専用アカウントを作ってレコメンドをその言語で埋め尽くしたり、多読・多聴の時間を増やして『言語の持久力』をつけるんだ。」
ID: `"Makanya ini saatnya nambah 'daya tahan bahasa'. Bikin akun YouTube khusus biar berandanya penuh konten target, terus perbanyak waktu baca/dengar (active + passive immersion)."`

**案内役**:
JP:「国語辞典（Monolingual）への移行を意識し始めるのもこの時期だね。」
ID: `"Mulai ancang-ancang transisi ke kamus monolingual juga pas di tahap ini."`

#### 選択肢 1
- **[中級の壁を突破するために、毎日のインプットを習慣にするぞ！]** → ID: `[Demi tembus tembok menengah, aku bakal jadiin imersi kebiasaan harian!]`
  - **案内役**:
    JP:「その強い意志があれば大丈夫。着実に脳が進化している証拠だからね！」
    ID: `"Semangat! Itu tanda otakmu lagi berevolusi secara konsisten."`

---

## 第11章: 「Level 8：快適に楽しめる — ニュアンスの吸収」（Level 8: Menikmati Tanpa Beban）

**シーン描写**: 太陽の光が差し込む明るいリビング。お気に入りのコンテンツをリラックスして楽しんでいる空間。

**案内役**:
JP:「**Level 8** へようこそ！ここでは、多少の知らない表現があってもストーリーをストレスなく心から楽しめるようになるよ。」
ID: `"Selamat datang di **Level 8**! Di sini, kamu udah bisa menikmati cerita tanpa beban stres, walau masih ada sedikit kata yang belum dikenal."`

**プレイヤー**:
JP:「わあ、字幕や辞書なしでも登場人物のセリフで自然と笑えるようになってきた！」
ID: `"Wah, bahkan tanpa subtitle atau kamus, aku udah mulai bisa ketawa bareng sama dialog karakternya!"`

**案内役**:
JP:「素晴らしい！『言語を勉強する』フェーズから『その言語で人生を楽しむ』フェーズに完全に入れ替わった瞬間だね。」
ID: `"Keren! Ini momen di mana fase 'belajar bahasa' berubah total jadi fase 'menikmati hidup pakai bahasa itu'."`

**案内役**:
JP:「バラエティ番組や小説などジャンルを広げ、ながら聴き（Effort 2〜3）でも意味がスッと入るように脳をさらに自動化させよう。」
ID: `"Perluas genrenya ke variety show atau novel. Latih otak biar makin otomatis paham walau didengerin sambil santai."`

#### 選択肢 1
- **[学ぶこと自体が楽しくて、時間を忘れて没頭しちゃう！]** → ID: `[Belajarnya udah kelewat seru sampai nggak terasa waktu jalan!]`
  - **案内役**:
    JP:「それこそが、最強のイマージョン状態そのものさ！」
    ID: `"Itulah puncak dari state imersi yang sebenarnya!"`

---

## 第12章: 「Level 9 & 10：ほぼ自動化、そしてネイティブの感覚へ」（Level 9–10: Otomatisasi & Intuisi Native）

**シーン描写**: 頂上に到達した冒険者。目の前にはどこまでも広がる美しい世界と、言葉の壁が消えた世界が広がっている。

**案内役**:
JP:「いよいよ最終ステージ、**Level 9 & 10** だ。ここでは全てのプロセスがほぼ自動化され、ネイティブの感覚（Intuisi Native）に到達する。」
ID: `"Akhirnya kita sampai di tahap akhir: **Level 9 & 10**. Di sini semua proses udah otomatis, nyampe ke tingkat **Intuisi Native**."`

**プレイヤー**:
JP:「言葉の裏にあるニュアンスや皮肉、ジョークの笑いどころまで、自然と心に響いてくる...！」
ID: `"Nuansa di balik kata, lelucon, sampai maksud tersiratnya langsung terasa natural di hati...!"`

**案内役**:
JP:「ここまで来ると、脳のコップから言葉が自然に溢れ出す **Natural Output** が始まる。ネイティブの相槌や自然な話し方をそのまま真似して、言葉の中で『生きる』ステージだ。」
ID: `"Kalau udah di sini, kata-kata bakal ngalir sendiri secara alami (**Natural Output**). Saatnya 'hidup' di dalam bahasa itu dengan nyerap gaya ngomong aslinya."`

**案内役**:
JP:「本当にお疲れ様！長かった旅の基礎はこれでバッチリだね。」
ID: `"Kerja bagus! Fondasi perjalanan panjangmu udah komplet."`

#### 選択肢 1
- **[すごい...！本当に自然と言葉が体に入ってきたって実感する！]** → ID: `[Luar biasa...! Bener-bener berasa kalau bahasanya udah nyerep sendiri ke dalam diri!]`
  - **案内役**:
    JP:「でも旅人よ、まだいくつか気になる疑問（FAQ）が残ってるよね？最後にそこをスッキリ解消しようか。」
    ID: `"Tapi petualang, masih ada beberapa keraguan (FAQ) kan? Yuk kita beresin dulu sebelum lanjut."`

---

## 第13章: 「本当に1日何時間も続けられる？ — 忙しい・疲れた日のイマージョン術」（Gimana Kalau Sibuk atau Capek?）

**シーン描写**: 夜遅く、仕事や学校で疲れて帰ってきたプレイヤーの部屋。デスクに座るのが億劫な雰囲気。

**プレイヤー**:
JP:「ねえヨシア、理論は分かったけどさ...毎日何時間も机に向かってイマージョンするなんて、学校や仕事でクタクタな日には絶対ムリだよ...。」
ID: `"Eh Yoshia... Teorinya sih paham. Tapi tiap hari harus duduk berjam-jam imersi rasanya mustahil kalau pas capek pulang kerja atau sekolah..."`

**案内役**:
JP:「ふふっ、勘違いしちゃいけない。『イマージョン＝机に張り付いてガリガリ勉強すること』じゃないんだよ。」
ID: `"Haha, jangan salah paham! Imersi itu bukan berarti harus duduk kaku di depan meja terus."`

**案内役**:
JP:「疲れた日は、ベッドでゴロゴロしながらポッドキャストを耳に流すだけでもいい。通勤・通学や料理中の **Waktu Mati（スキマ時間）** を全部イマージョンに変えればいいのさ！」
ID: `"Pas capek, tinggal rebahan di kasur sambil dengerin podcast. Manfaatin **waktu mati** pas di jalan atau lagi masak buat imersi!"`

#### 選択肢 1
- **[それなら、スキマ時間だけで無理なく毎日続けられそう！]** → ID: `[Kalau gitu, bisa tetep konsisten tiap hari tanpa bikin stres!]`
  - **案内役**:
    JP:「そう！『がんばる』んじゃなくて、『生活の環境をその言語に染める』のがコツなんだ。」
    ID: `"Bener! Jangan 'berjuang', tapi 'ubah lingkungan hidupmu' ke bahasa itu."`

---

## 第14章: 「いつになったら喋れる？ JLPTの試験はどうなるの？」（Kapan Bisa Ngomong & Gimana Soal JLPT?）

**シーン描写**: 広大な草原の中、遠くに見える目標の山（JLPT試験の山）と、目の前に広がる川（会話の海）。

**プレイヤー**:
JP:「ずっとインプットばかりで、本当に喋れるようになるの？それに、学校や就職のためにJLPTの資格もどうしても必要なんだよね。」
ID: `"Terus-terusan ngebaca/dengerin doang, emang beneran bakal bisa ngomong? Terus soal sertifikat JLPT buat kerja atau sekolah gimana?"`

**案内役**:
JP:「いい質問だね！赤ちゃんだって、最初の1〜2年は喋らずにひたすら聞いて言葉を貯めるでしょ？コップに水が満タンになれば、自然と外へ溢れ出すんだ。」
ID: `"Pertanyaan bagus! Bayi aja butuh 1-2 tahun dengerin dulu sebelum ngomong kan? Kalau gelas airnya udah penuh, pasti tumpah sendiri ke luar."`

**案内役**:
JP:「そして、正しい **`Metode Alami`** で本当の理解力（Acquisition）が身につけば、JLPT N2やN1なんて、あとから勝手に『おまけ（副産物）』としてついてくるものなのさ！」
ID: `"Dan kalau kemampuan aslinya (acquisition) udah dapet lewat **`Metode Alami`**, sertifikat JLPT N2 atau N1 bakal nempel sendiri sebagai 'bonus'!"`

#### 選択肢 1
- **[焦らずインプットを信じて満タンにすれば、資格も会話も両方手に入るんだ！]** → ID: `[Tanpa panik dan percaya prosesnya, sertifikat sama skill ngomong bakal dapet dua-duanya!]`
  - **案内役**:
    JP:「その通り！近道なんてない、だからこそ正しい道（`Metode Alami`）を行くのが一番早いんだ。」
    ID: `"Tepat sekali! Jalan paling aman dan cepet ya lewat jalur yang benar."`

---

## 第15章: 「最初の一歩と仲間たち — 孤独じゃない独学（Otodidak）へ」（Langkah Pertama & Komunitas GoRakuDo）

**シーン描写**: 冒険の旅立ちの門の前。たくさんの仲間たちが笑顔で手を振っている。

**案内役**:
JP:「さあ、いよいよ最後の章だ。最初の一歩を踏み出す準備はいいかい？」
ID: `"Nah, kita udah di babak penutup. Udah siap ngambil langkah pertamamu?"`

**プレイヤー**:
JP:「よし、やってみる！でも1人で途中で迷子になったり、挫折しそうになったりしないかな...ちょっと不安かも。」
ID: `"Oke, aku siap! Tapi takutnya nanti nyasar atau kesepian di tengah jalan... Agak deg-degan sih."`

**案内役**:
JP:「安心していい。『独学（Otodidak）』イコール『孤独（Sendirian）』じゃない。GoRakuDoのコミュニティには、同じ夢に向かって歩む仲間たちがたくさんいるんだから！」
ID: `"Tenang aja! Belajar **otodidak** bukan berarti **sendirian**. Di komunitas GoRakuDo, ada ribuan pejuang lain yang jalan bareng sama kamu!"`

**案内役**:
JP:「武器を装備して、一緒に最高の冒険へ出発しよう！」
ID: `"Yuk, siapin senjatamu, dan mari berangkat ke petualangan seru kita!"`

### グランドフィナーレ（アクションボタン）
- **ボタン**: **「よし、冒険を始める！（ホームページやガイドへ）」**
  - ID表記: `[Ayo Mulai Petualangan!]`
  - 挙動: クリアフラグを `localStorage` に保存し、ポータルハブ（`/` または `/project`）へ転送。

---
