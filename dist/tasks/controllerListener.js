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
const tasks_1 = require("../tasks");
const logger_1 = require("../logger");
const channelID = '579452345486802965';
const info = {
    '579452492492832810': {
        '512831921882005521': '579451897933594625',
        '512744302678376458': '579451899330428950',
        '512744301499777034': '579451906200567828',
        '512744300216582162': '579451912508932108'
    },
    '579452501326037003': { '512733235940163595': '579451920671047694' },
    '579452505340117021': {
        '512733235143507968': '579451921925013555',
        '512733234082218023': '579451923955187733',
        '512733232790503434': '579451929675956235',
        '512733231800647700': '579451936009355264'
    },
    '579452515150462981': {
        '512733230865186826': '579451942292684800',
        '512733229569277973': '579451943957823500',
        '512733228621365278': '579451949808746500',
        '512733227363074059': '579451956591067156'
    },
    '579452524004900865': {
        '512733226285137942': '579451962265960448',
        '512733224695365652': '579451963641692179',
        '512733223864762388': '579451969140424705',
        '512733222447087658': '579451973951291392'
    },
    '579452558708310017': {
        '512733220979212329': '579451979189714945',
        '512733220010459138': '579451981219758080',
        '512733219246964737': '579451988786282496',
        '512733218382938122': '579451994754777090'
    },
    '579452574521098251': {
        '512729400916049935': '579452001335771136',
        '512729392426778624': '579452002572959754',
        '512729380317954068': '579452007849656331',
        '512729340388179968': '579452015126773760'
    },
    '579452583781990400': {
        '512729317625561088': '579452021380481025',
        '512729311246286870': '579452022944825364',
        '512729294426865665': '579452028984623116',
        '512729290509385750': '579452035389456405'
    },
    '579452592120135710': {
        '512729284260003841': '579452042138091539',
        '512729270192177155': '579452043228610572',
        '512729267898023937': '579452049377460244',
        '512729264466952203': '579452053328494604'
    },
    '579452599221092358': {
        '512729260717244416': '579452059775008787',
        '512729258087546889': '579452061524033585',
        '512729252437688320': '579452068230725644',
        '512729249510326293': '579452076531253278'
    },
    '579452606414323735': { '512729244749529109': '579452084282327040', '512729241738149917': '579452086312501258' },
    '579452610764079107': {
        '512729238307078145': '579452095787171871',
        '512729230229110825': '579452096437551104',
        '512729227682906126': '579452101394956289',
        '512729221475336199': '579452108307300371'
    },
    '579452618380804098': {
        '512729218233401364': '579452114225463329',
        '512729206355132417': '579452115425165323',
        '512729203485966376': '579452121938657296',
        '512729199040135169': '579452129316700170'
    },
    '579452626312232970': {
        '512729195089100800': '579452134815170573',
        '512729191486324756': '579452136551874580',
        '512711953542545408': '579452143820603393',
        '512711942327107584': '579452151194189871'
    },
    '579452637603430410': {
        '512711852602425346': '579452158181900307',
        '512711819660623872': '579452160262144016',
        '512711568673341441': '579452167216300052',
        '512711545789087774': '579452174245953536'
    }
};
function addReacts(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = client.channels.get(channelID);
        if (channel === null)
            return;
        try {
            for (const [messageID, data] of Object.entries(info)) {
                const message = yield channel.fetchMessage(messageID);
                for (const [emojiID, roleID] of Object.entries(data)) {
                    yield message.react(emojiID);
                }
            }
        }
        catch (e) {
            logger_1.warn(`Error starting reaction controller: ${e}`);
        }
    });
}
function action(reaction, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user.bot)
            return;
        if (!(reaction.message.id in info))
            return;
        if (reaction.message.guild === null)
            return;
        const member = reaction.message.guild.members.get(user.id);
        if (member === null)
            return;
        const roleID = info[reaction.message.id][reaction.emoji.id];
        if (roleID === undefined)
            return;
        try {
            if (member.roles.has(roleID))
                yield member.removeRole(roleID);
            else
                yield member.addRole(roleID);
        }
        catch (e) {
            logger_1.warn(`Error in reaction controller: ${e}`);
        }
    });
}
exports.default = new tasks_1.ListenerTask({
    name: 'Reaction Controller Listener',
    description: 'Controls assignment of roles according to the controller.',
    autoStart: true,
    allowConcurrent: false,
    start: addReacts,
    listeners: {
        'messageReactionAdd': action,
        'messageReactionRemove': action
    }
});
//# sourceMappingURL=controllerListener.js.map