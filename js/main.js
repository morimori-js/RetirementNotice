window.onload = () => {

    enchant();


    /**
     * @param args
     *   [0]: スプライトの横幅、縦幅
     *   [1]: スプライトURL
     *   [2]: マップデータ
     *   [3]: マップ衝突判定用データ
     */
    const Map = enchant.Class.create(enchant.Map, {
        initialize: function(args) {
            enchant.Map.call(this, args[0], args[0]);
            this.image = core.assets[args[1]];
            this.loadData(args[2]);
            this.collisionData = args[3];
        }
    });


    /**
     * @param args
     *   [0]: スプライトの横幅、縦幅
     *   [1]: スタート時のx座標
     *   [2]: スタート時のy座標
     *   [3]: スプライトURL
     *   [4]: 移動用フレーム遷移
     *   [5]: ジャンプ用フレーム遷移
     *   [6]: ｘ軸加速度
     *   [7]: y軸加速度
     *   [8]: ジャンプ量
     *   [9]: ジャンプ量上限
     * @param map マップオブジェクト
     */
    const Player = enchant.Class.create(enchant.Sprite, {
        initialize: function(args, map) {
            enchant.Sprite.call(this, args[0], args[0]);
            this.x = args[1];
            this.y = args[2];
            this.vx = 0;
            this.vy = 0;
            this.image = core.assets[args[3]];
            this.frame = args[4];
            this.isJump = false;
            this.jumpHeight = args[8];
            this.jumpCount = 0;
            this.jumpHeightLimit = args[9];

            this.addEventListener('enterframe', function(e) {
                this.vy = args[6]; // y軸加速度
                this.vx = args[7]; // x軸加速度

                // 着地判定
                if(!this.possibleJump && map.hitTest(this.x + this.vx + 24, this.y + this.vy + 40) && map.hitTest(this.x + this.vx + 18, this.y + this.vy + 40)) {
                    this.vy -= args[7];
                    this.isJump = false;
                    this.jumpCount = 0;
                }

                // ジャンプ中の場合、規定のジャンプ量までジャンプ
                if(this.isJump && this.possibleJump) {
                    this.vy -= this.jumpHeight;
                    this.jumpCount++;
                }

                // ジャンプ上限判定
                if(this.isJump && this.jumpCount >= this.jumpHeightLimit) this.possibleJump = false;

                // 移動可否判定
                if(map.hitTest(this.x + this.vx + 38 , this.y + this.vy + 40)) {
                    this.vx -= args[7];
                }

                // ジャンプ可否判定
                if (this.isJump) {
                    if(map.hitTest(this.x + this.vx + 24, this.y + this.vy + 15)) {
                        this.vy += this.jumpHeight;
                        this.possibleJump = false;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
            });
        },

        jump: function() {
            this.isJump = true; // 複数回のジャンプ対策
            this.possibleJump = true; // 複数回のジャンプ対策
        },

        /**
         * 敵衝突時、スプライト点滅
         * @param t 点滅時間
         * @param lifeLabel ライフオブジェクト
         */
        blink: function(t, lifeLabel) {
            // 規定の時間スプライト点滅
            this.tl
            .clear()
            .repeat(function() {
                this.visible = !this.visible;
            }, t)
            .then(function() {
                this.visible = true;
            });

            lifeLabel.life--; // ライフの減少
        }
    });


    /**
     * @param args
     *   [0]: スプライトの横幅、縦幅
     *   [1]: スタート時のx座標
     *   [2]: スタート時のy座標
     *   [3]: スプライトURL
     *   [4]: 移動用フレーム遷移
     *   [5]: x軸加速度
     *   [6]: y軸加速度
     * @param player プレイヤーオブジェクト
     * @param map マップオブジェクト
     */
    const Enemy = enchant.Class.create(enchant.Sprite, {
        initialize: function(args, player, map) {
            enchant.Sprite.call(this, args[0], args[0]);
            this.x = (player.x + args[1]);
            this.y = args[2];
            this.vx = args[5];
            this.vy = args[6];
            this.name = randomName();
            this.image = core.assets[args[3]];
            this.frame = args[4];
            this.turnFlag = 'right';

            this.addEventListener('enterframe', function(e) {

                // 下の衝突
                if(map.hitTest(this.x + this.vx + 24, this.y + this.vy + 46)) {
                    this.vy -= args[6];
                } 

                // 左の衝突
                if(this.turnFlag === 'right' && map.hitTest(this.x - this.vx + 7 , this.y + this.vy + 40)) {
                    this.vx -= (args[5] * 2);
                    this.scaleX = -1;
                    this.turnFlag = 'left'
                }
                
                // 右の衝突
                if(this.turnFlag === 'left' && map.hitTest(this.x + this.vx + 41 , this.y + this.vy + 40)) {
                    this.vx += (args[5] * 2);
                    this.scaleX = +1;
                    this.turnFlag = 'right'
                }

                this.y += this.vy;
                this.x -= this.vx;
            });
        }
    });


    /**
     * @param args
     *   [0]: スタート時のx座標
     *   [1]: スタート時のy座標
     * @param stage ステージオブジェクト
     * @param core コアオブジェクト
     */
    const ScoreLabel = enchant.Class.create(enchant.ui.ScoreLabel, {
        initialize: function(args, stage, core) {
            enchant.ui.ScoreLabel.call(this, args[0], args[1]);
            this.score = core.score;
            this.text = this.label = '';

            this.addEventListener('enterframe', function() {
                this.x = (Math.abs(stage.x) + args[0]);
            });
        }
    });


    /**
     * @param args
     *   [0]: スタート時のx座標
     *   [1]: スタート時のy座標
     * @param stage ステージオブジェクト
     * @param core コアオブジェクト
     */
    const TimeLabel = enchant.Class.create(enchant.ui.TimeLabel, {
        initialize: function(args, stage, core) {
            enchant.ui.TimeLabel.call(this, args[0], args[1]);
            this.time = core.time;
            this.text = this.label = '';

            this.addEventListener('enterframe', function() {
                this.x = (Math.abs(stage.x) + args[0]);
            });
        }
    });


    /**
     * @param args
     *   [0]: スタート時のx座標
     *   [1]: スタート時のy座標
     * @param stage ステージオブジェクト
     * @param core コアオブジェクト
     */
    const LifeLabel = enchant.Class.create(enchant.ui.LifeLabel, {
        initialize: function(args, stage, core) {
            enchant.ui.LifeLabel.call(this, args[0], args[1]);
            this.life = core.life;
            this.label.text = '';

            this.addEventListener('enterframe', function() {
                this.x = (Math.abs(stage.x) + args[0]);
            });
        }
    });


    /**
     * @param player プレイヤーオブジェクト
     * @param enemy 敵オブジェクト
     * @param stage ステージオブジェクト
     * @param core コアオブジェクト
     * @param scoreLabel スコアオブジェクト
     * @param lifeLabel ライフオブジェクト
     */
    const collisionJudgement = function(player, enemy, stage, core, scoreLabel, lifeLabel) {
        if (enemy.intersect(player)) {
            if (player.isJump) {
                stage.removeChild(enemy);
                player.y -= player.jumpHeight;
                core.enemy = false;
            } else {
                player.blink(10, lifeLabel); // 衝突時にプライヤースプライト点滅
            }
        }
    }

    /**
     * 敵オブジェクトのnameプロパティの値をランダム生成
     */
    const randomName = () => {
        let result = '';
        const materials = CONSTANT.RANDOM_NAME;

        for (let i = 0; i < CONSTANT.RANDOM_NAME_LENGTH; i++) {
            result += materials[Math.floor(Math.random() * materials.length)];
        }

        return result;
    }

    /**
     * コア生成
     */
    const core = new Core(320, 320);
    core.fps = 15;
    core.score = 0; // 開始時のスコア
    core.time = 0 // 開始時のタイム
    core.life = 3; // 開始時のライフ
    core.enemy = false; // 敵生成可否フラグ

    core.preload(CONSTANT.CORE_PRELOAD); // 画像ファイルのプリロード

    core.onload = () => {
        let enemy; // enemyオブジェクトのインスタンス用
        const stage = new Group();

        const map = new Map(CONSTANT.STAGE1);
        stage.addChild(map);

        const player = new Player(CONSTANT.PLAYER, map ,core);
        stage.addChild(player);

        const scoreLabel = new ScoreLabel(CONSTANT.SCORE_LABEL, stage, core);
        stage.addChild(scoreLabel);

        const timeLabel = new TimeLabel(CONSTANT.TIME_LABEL, stage, core);
        stage.addChild(timeLabel);

        const lifeLabel = new LifeLabel(CONSTANT.LIFE_LABEL, stage, core);
        stage.addChild(lifeLabel);

        /**
         * coreオブジェクトのタッチイベント
         */
        core.rootScene.addEventListener('touchstart', function() {
            if (!player.isJump) player.jump(); // 画面タッチでジャンプ
        });

        /**
         * coreオブジェクトの毎フレームイベント
         */
        core.rootScene.addEventListener('enterframe', function(e) {
            // 敵生成
            if (!core.enemy && Math.floor(Math.random() * 1000 < 5)) {
                core.enemy = true;
                enemy = new Enemy(CONSTANT.ENEMY, player, map);
                stage.addChild(enemy);
            }

            if (core.enemy) {
                collisionJudgement(player, enemy, stage, core, scoreLabel, lifeLabel); // 敵とプレイヤーの衝突判定
                if (enemy.y >= map.height || enemy.x < core.width) stage.removeChild(enemy);　// 敵の落下判定
            }

            // 画面のスクロール
            var x = Math.min((core.width - player.width) / 2 - player.x, 0); // 画面スクロール量
            if (player.y >= map.height || lifeLabel.life < 1) core.end(); // 落下判定
            if (Math.abs(x) >= (map.width - 50)) core.clear(); // ゴール判定
            stage.x = x;
        });

        core.rootScene.addChild(stage);
    }

    core.start();
}