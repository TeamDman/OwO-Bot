"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const guildID = '574709755772141569';
const packs = [
    'continuum',
    'ftb presents direwolf20',
    'ftb presents skyfactory 3',
    'ftb presents stoneblock 2',
    'infinity evolved',
    'interactions',
    'pyramid reborn',
    'revelation',
    'sky adventures',
    'sky odyssey',
    'ultimate reloaded',
    'builders paradise',
    'other ftb mod packs'
];
const channels = Object.assign({ 'IMPORTANT': ['announcements', 'rules'], 'TEXT CHANNELS': ['general', 'support', 'server-operators'] }, packs.reduce((map, pack) => {
    map[pack.toUpperCase()] = ['general', 'media', 'servers'];
    return map;
}, {}));
exports.default = {
    name: 'Channel Creator',
    allowConcurrent: false,
    autoStart: false,
    description: 'Populates the channel list to mimic FTB.',
    runningCount: 0,
    start: (client) => __awaiter(this, void 0, void 0, function* () {
        this.runningCount++;
        const start = Date.now();
        const guild = client.guilds.get(guildID);
        let count = 0;
        if (guild === null) {
            this.runningCount--;
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Could not find guild [${guildID}].`);
        }
        for (const [categoryName, channelNames] of Object.entries(channels)) {
            const category = yield guild.createChannel(categoryName, 'category', [], 'role controller');
            for (const channelName of Object.values(channelNames)) {
                const channel = yield guild.createChannel(channelName, 'text', [], 'role controller');
                yield channel.setParent(category, 'role controller');
            }
        }
        this.runningCount--;
        return new discord_js_1.RichEmbed().setDescription(`Created ${count} channels in ${(Date.now() - start) / 1000} seconds.`);
    }),
};
//# sourceMappingURL=channelsCreator.js.map