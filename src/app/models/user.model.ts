export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    genre: string;
    password: string;

    // ⚠️ 新增 role
    role?: string;

    // 遊戲相關欄位
    catPhoto?: string;
    level?: number;
    energy?: number;
    fishCount?: number;
    toyCount?: number;
    heartCount?: number;

    dailyRewardDate?: string;
}