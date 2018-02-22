/**
 * 画像ファイル
 */
const IMGRES = {
    MAP: './images/map2.png',
    TIMEUP: './images/timeup.png',
    ENEMY: './images/monster1.gif',
    BETTY: './images/betty.png',
    BETTY_RECTANGLE: './images/betty_rectangle.png'
};


/**
 * 定数
 */
const CONSTANT = {
    CORE: [
        320, // オブジェクトの幅
        15, // ゲームfps
    ],
    CORE_PRELOAD: [
        IMGRES.MAP,
        IMGRES.TIMEUP,
        IMGRES.ENEMY,
        IMGRES.BETTY,
        IMGRES.BETTY_RECTANGLE
    ],
    PLAYER: [
        48, // スプライトの幅
        17, // x軸初期値
        0, // y軸初期値
        IMGRES.BETTY,
        [3,7,11,15], // 移動中のフレーム
        [4,3,2,1], // ジャンプ中のフレーム
        4, // 重力加速度
        4, // 加速度
        8, // ジャンプ力
        18 // ジャンプ上限
    ],
    ENEMY: [
        48, // スプライトの幅
        160, // スタート時のx軸
        150, // スタート時のy軸
        IMGRES.ENEMY, // 敵スプライト
        [3, 3, 3, 4, 4, 4, 5, 5, 5], // 移動中のフレーム
        2, // x軸加速度
        2 // y軸加速度
    ],
    STAGE1: [
        16, // オブジェクトの幅
        IMGRES.MAP, // マップスプライト
        MAIN_MAP, // マップデータ
        COLLISION_MAP // 衝突判定用データ
    ],
    SCORE_LABEL: [
        10, // スタート時のx軸
        5 // スタート時のy軸
    ],
    TIME_LABEL: [
        120, // スタート時のx軸
        5 // スタート時のy軸
    ],
    LIFE_LABEL: [
        190, // スタート時のx軸
        5 // スタート時のy軸
    ],
    RANDOM_NAME_LENGTH: 8, // ランダム名の長さ
    RANDOM_NAME: 'abcdefghijklmnopqrstuvwxyz0123456789' // ランダム名の素材
};