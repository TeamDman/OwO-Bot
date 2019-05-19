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
        'send': ['〰 __**SKY ADVENTURES**__', '⛸ <#579445480254078977>', '✍ <#579445483051810827>', '⚛ <#579445481839788032>'],
        'reacts': {
            '〰': '579476978005180426',
            '⛸': '579476978609029120',
            '✍': '579476981356167168',
            '⚛': '579476983633674240'
        }
    }, {
        'send': ['⚖ __**IMPORTANT**__'],
        'reacts': { '⚖': '579476986242662413' }
    }, {
        'send': ['⚔ __**BUILDERS PARADISE**__', '⛪ <#579445498071744522>', '⛽ <#579445495198384158>', '✒ <#579445496649613343>'],
        'reacts': {
            '⚔': '579476986565492743',
            '⛪': '579476987421130752',
            '⛽': '579476989778591794',
            '✒': '579476992366477352'
        }
    }, {
        'send': ['♍ __**OTHER FTB MOD PACKS**__', '☸ <#579445502786142241>', '☦ <#579445500105719818>', '⌨ <#579445501569794078>'],
        'reacts': {
            '♍': '579476994786328576',
            '☸': '579476995386114049',
            '☦': '579476998137839616',
            '⌨': '579476999962099755'
        }
    }, {
        'send': ['➗ __**ULTIMATE RELOADED**__', '⛵ <#579445490396168196>', '⬜ <#579445491708985363>', '♒ <#579445493034385408>'],
        'reacts': {
            '➗': '579477002713694228',
            '⛵': '579477003351228436',
            '⬜': '579477006178320405',
            '♒': '579477008690446351'
        }
    }, {
        'send': ['⏫ __**CONTINUUM**__', '⛰ <#579445440475430941>', '✅ <#579445439099699255>', '♌ <#579445441457029151>'],
        'reacts': {
            '⏫': '579477012373045271',
            '⛰': '579477013216362496',
            '✅': '579477015846060032',
            '♌': '579477017947537429'
        }
    }, {
        'send': ['⛴ __**REVELATION**__', '☄ <#579445475447406602>', '⏭ <#579445478182354944>', '⏩ <#579445476810817552>'],
        'reacts': {
            '⛴': '579477020430303234',
            '☄': '579477021437198346',
            '⏭': '579477023827820544',
            '⏩': '579477025916715029'
        }
    }, {
        'send': ['⏲ __**FTB PRESENTS STONEBLOCK 2**__', '⛱ <#579445457483202560>', '㊙ <#579445454199062528>', '⏱ <#579445455981772820>'],
        'reacts': {
            '⏲': '579477028236165153',
            '⛱': '579477029087346688',
            '㊙': '579477032233336843',
            '⏱': '579477034921885707'
        }
    }, {
        'send': ['☁ __**PYRAMID REBORN**__', '♎ <#579445469810524161>', '⛩ <#579445471462817802>', '☔ <#579445473157578753>'],
        'reacts': {
            '☁': '579477037685932062',
            '♎': '579477037912293388',
            '⛩': '579477042324832267',
            '☔': '579477044413595649'
        }
    }, {
        'send': ['♊ __**FTB PRESENTS DIREWOLF20**__', '♣ <#579445443641999379>', '➖ <#579445446452314112>', '♋ <#579445444870930434>'],
        'reacts': {
            '♊': '579477046972121091',
            '♣': '579477047567450132',
            '➖': '579477050314719246',
            '♋': '579477052449619969'
        }
    }, {
        'send': ['⛅ __**TEXT CHANNELS**__', '⚓ <#579445436881043478>'],
        'reacts': { '⛅': '579477055146557462', '⚓': '579477055863783424' }
    }, {
        'send': ['⏹ __**INFINITY EVOLVED**__', '♓ <#579445461165801482>', '➰ <#579445459525828608>', '◾ <#579445461946073101>'],
        'reacts': {
            '⏹': '579477057965260802',
            '♓': '579477058657189889',
            '➰': '579477061060788234',
            '◾': '579477063506067456'
        }
    }, {
        'send': ['⛹ __**FTB PRESENTS SKYFACTORY 3**__', '⛳ <#579445452118818867>', '❔ <#579445450470326273>', '♈ <#579445448515911692>'],
        'reacts': {
            '⛹': '579477065405956127',
            '⛳': '579477066207068181',
            '❔': '579477068916588565',
            '♈': '579477071172993054'
        }
    }, {
        'send': ['♦ __**INTERACTIONS**__', '⚫ <#579445466026999808>', '⏯ <#579445464248877057>', '❎ <#579445467801452544>'],
        'reacts': {
            '♦': '579477073752621097',
            '⚫': '579477074738413569',
            '⏯': '579477078605430784',
            '❎': '579477081033932810'
        }
    }, {
        'send': ['➕ __**SKY ODYSSEY**__', '❌ <#579445486407254048>', '© <#579445488164667393>', '☮ <#579445485203488769>'],
        'reacts': {
            '➕': '579477083655503894',
            '❌': '579477084234186763',
            '©': '579477087929368576',
            '☮': '579477090718449684'
        }
    }];
exports.default = {
    name: 'Create Reaction Controller',
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
        this.runningCount--;
    }),
    stop: (client) => __awaiter(this, void 0, void 0, function* () {
    })
};
//# sourceMappingURL=controllerCreator.js.map