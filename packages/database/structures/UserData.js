"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = void 0;
class UserData {
    constructor(user) {
        this.id = user.id;
        this.balance = Number(user.balance);
        this.bank = Number(user.bank);
        this.bankCap = Number(user.bankCap);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.premium = user.premium || this.getDefaultPremium();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.levelData = user.levelData || this.getDefaultLevel();
        if (user.gangId)
            this.gangId = user.gangId;
    }
    getDefaultPremium() {
        return {
            discordId: this.id,
            patronId: null,
            activeTiers: [],
            hasPremium: false,
        };
    }
    getDefaultLevel() {
        return {
            exp: 0,
            level: 1,
            total: 100,
            percent: 0,
            cooldown: 0,
            usernameColor: '#000000',
            bigSquareColor: '#d3d3d3',
            bigSquareOpacity: 0.6,
            levelColor: '#000000',
            xpColor: '#606060',
            rankColor: '#000000',
            filledDotsColor: '#606060',
            emptyDotsColor: '#d6d6d6',
            backgroundURL: 'https://i.imgur.com/FydJyTs.png',
            backgroundX: 0,
            backgroundY: 0,
            backgroundW: null,
            backgroundH: null,
        };
    }
}
exports.UserData = UserData;
