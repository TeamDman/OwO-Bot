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
const channelID = '579452345486802965';
const info = [{
        'send': ['⏭ __**SKY ADVENTURES**__', '♌ <#579445480254078977>', '☪ <#579445483051810827>', '◾ <#579445481839788032>'],
        'reacts': {
            '⏭': '579479745373405204',
            '♌': '579479745805418499',
            '☪': '579479748875386880',
            '◾': '579479751559872512'
        }
    }, {
        'send': ['⏬ __**IMPORTANT**__'],
        'reacts': { '⏬': '579479754202415105' }
    }, {
        'send': ['⛔ __**BUILDERS PARADISE**__', '⏩ <#579445498071744522>', '⚽ <#579445495198384158>', '☦ <#579445496649613343>'],
        'reacts': {
            '⛔': '579479754562863106',
            '⏩': '579479755284414476',
            '⚽': '579479758908424193',
            '☦': '579479761663819786'
        }
    }, {
        'send': ['♦ __**OTHER FTB MOD PACKS**__', '⛹ <#579445502786142241>', '⛪ <#579445500105719818>', '⚪ <#579445501569794078>'],
        'reacts': {
            '♦': '579479764176338949',
            '⛹': '579479765145092096',
            '⛪': '579479768039424026',
            '⚪': '579479770715258902'
        }
    }, {
        'send': ['♎ __**ULTIMATE RELOADED**__', '❌ <#579445490396168196>', '↔ <#579445491708985363>', '⌚ <#579445493034385408>'],
        'reacts': {
            '♎': '579479774016307220',
            '❌': '579479774649647134',
            '↔': '579479778755608596',
            '⌚': '579479781280841729'
        }
    }, {
        'send': ['⚰ __**CONTINUUM**__', '♐ <#579445440475430941>', '↕ <#579445439099699255>', '⛩ <#579445441457029151>'],
        'reacts': {
            '⚰': '579479784636022795',
            '♐': '579479785332277248',
            '↕': '579479788389924914',
            '⛩': '579479791896363050'
        }
    }, {
        'send': ['✊ __**REVELATION**__', '♻ <#579445475447406602>', '⭐ <#579445478182354944>', '♊ <#579445476810817552>'],
        'reacts': {
            '✊': '579479794672992256',
            '♻': '579479795352469516',
            '⭐': '579479798200533003',
            '♊': '579479801363038229'
        }
    }, {
        'send': ['♥ __**FTB PRESENTS STONEBLOCK 2**__', '☠ <#579445457483202560>', '⛰ <#579445454199062528>', '✋ <#579445455981772820>'],
        'reacts': {
            '♥': '579479805318398003',
            '☠': '579479806350065684',
            '⛰': '579479808736755715',
            '✋': '579479811798466560'
        }
    }, {
        'send': ['⚖ __**PYRAMID REBORN**__', '⏺ <#579445469810524161>', '⛲ <#579445471462817802>', '⏲ <#579445473157578753>'],
        'reacts': {
            '⚖': '579479814445203456',
            '⏺': '579479815145521152',
            '⛲': '579479818249175041',
            '⏲': '579479821160153098'
        }
    }, {
        'send': ['⏮ __**FTB PRESENTS DIREWOLF20**__', '⚔ <#579445443641999379>', '⏹ <#579445446452314112>', '⛎ <#579445444870930434>'],
        'reacts': {
            '⏮': '579479823794044928',
            '⚔': '579479824410869773',
            '⏹': '579479827195756545',
            '⛎': '579479830068854805'
        }
    }, {
        'send': ['⏱ __**TEXT CHANNELS**__', '➗ <#579445436881043478>'],
        'reacts': { '⏱': '579479833046941706', '➗': '579479833705316373' }
    }, {
        'send': ['➕ __**INFINITY EVOLVED**__', '♒ <#579445461165801482>', '〰 <#579445459525828608>', '♑ <#579445461946073101>'],
        'reacts': {
            '➕': '579479836289007629',
            '♒': '579479836935061514',
            '〰': '579479839828869131',
            '♑': '579479842291187733'
        }
    }, {
        'send': ['☣ __**FTB PRESENTS SKYFACTORY 3**__', '⏳ <#579445452118818867>', '♉ <#579445450470326273>', '⭕ <#579445448515911692>'],
        'reacts': {
            '☣': '579479845155766283',
            '⏳': '579479845868666887',
            '♉': '579479848926576681',
            '⭕': '579479851933630486'
        }
    }, {
        'send': ['⚒ __**INTERACTIONS**__', '➰ <#579445466026999808>', '➿ <#579445464248877057>', '♋ <#579445467801452544>'],
        'reacts': {
            '⚒': '579479854773305373',
            '➰': '579479855293530133',
            '➿': '579479858577670144',
            '♋': '579479860976812033'
        }
    }, {
        'send': ['✅ __**SKY ODYSSEY**__', '✏ <#579445486407254048>', '⏫ <#579445488164667393>', '➡ <#579445485203488769>'],
        'reacts': {
            '✅': '579479864143380480',
            '✏': '579479864973721600',
            '⏫': '579479867993882624',
            '➡': '579479871026364426'
        }
    }];
exports.default = {
    name: 'Reaction Controller Creator',
    allowConcurrent: false,
    autoStart: false,
    description: 'Creates the role controller message.',
    runningCount: 0,
    start: (client) => __awaiter(this, void 0, void 0, function* () {
        this.runningCount++;
        const channel = client.channels.get(channelID);
        if (channel === null) {
            this.runningCount--;
            return new discord_js_1.RichEmbed().setColor('ORANGE').setDescription(`Could not find channel [${channelID}].`);
        }
        let rtn = {};
        for (const entry of info) {
            const message = yield channel.send(entry.send);
            rtn[message.id] = {};
            for (const [emojiID, roleID] of Object.entries(entry.reacts)) {
                yield message.react(emojiID);
                rtn[message.id][emojiID] = roleID;
            }
        }
        console.log(JSON.stringify(rtn));
        return new discord_js_1.RichEmbed().setDescription('Sent Reaction Controller messages.');
        this.runningCount--;
    })
};
//# sourceMappingURL=reactionControllerCreator.js.map