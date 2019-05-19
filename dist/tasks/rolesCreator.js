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
const blacklist = {
    '574709756695150604': true,
    '579445431394762773': true,
    '579445435383676928': true,
    '579445428244971520': true,
    '579445429498806282': true,
};
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
exports.default = {
    name: "Roles Creator",
    allowConcurrent: false,
    autoStart: false,
    description: "Creates channels for each role.",
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
        const everyone = guild.roles.find((role) => role.name === '@everyone');
        if (everyone === null) {
            this.runningCount--;
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Could not find @everyone role for guild [${guildID}].`);
        }
        const rtn = [];
        const emojis = shuffle(require('../../emojis.json').emojis).filter((e) => e.emoji.length === 1);
        for (const c of guild.channels.filter((c) => c.type === 'category').values()) {
            //type guard
            const category = c;
            const categoryRole = yield guild.createRole({
                name: category.name
            }, 'role controller');
            count++;
            let emoji = emojis.pop().emoji;
            let item = {
                send: [`${emoji} __**${category.name}**__`],
                reacts: { [emoji]: categoryRole.id },
            };
            for (const channel of category.children.values()) {
                if (channel.id in blacklist)
                    continue;
                const role = yield guild.createRole({
                    name: `${category.name} - ${channel.name}`
                }, 'role controller');
                emoji = emojis.pop().emoji;
                item.send.push(`${emoji} <#${channel.id}>`);
                item.reacts[emoji] = role.id;
                count++;
                yield channel.overwritePermissions(role, {
                    READ_MESSAGES: true
                }, 'role controller');
                yield channel.overwritePermissions(categoryRole, {
                    READ_MESSAGES: true
                }, 'role controller');
                yield channel.overwritePermissions(everyone, {
                    READ_MESSAGES: false
                }, 'role controller');
            }
            rtn.push(item);
        }
        console.log(JSON.stringify(rtn));
        this.runningCount--;
        return new discord_js_1.RichEmbed().setDescription(`Created ${count} roles in ${(Date.now() - start) / 1000} seconds.`);
    }),
    stop: (client) => __awaiter(this, void 0, void 0, function* () {
    }),
};
//# sourceMappingURL=rolesCreator.js.map