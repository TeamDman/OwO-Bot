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
const config_1 = require("./config");
const logger_1 = require("./logger");
let purging = false;
function shouldPurge(member) {
    if (member.user.bot)
        return false;
    let has = 0;
    for (let role of Object.values(config_1.default.snap['must have more roles than these to not be purged']))
        if (member.roles.has(role))
            has++;
    // If they only have those roles, then boot 'em.
    return has === member.roles.size;
}
exports.shouldPurge = shouldPurge;
function startPurge(context, count) {
    return __awaiter(this, void 0, void 0, function* () {
        if (purging)
            throw new Error("Already purging.");
        let toPurge = context.guild.members
            .filter(shouldPurge)
            .array()
            .filter((_, index) => index < count);
        let startCount = toPurge.length;
        logger_1.info(`Purging ${startCount} members in ${context.guild.name}`);
        let startTime = Date.now();
        purging = true;
        let progressMessage = yield context.send('Purging...');
        let reportText = '';
        yield logger_1.report(context.guild, 'Snapped members:');
        for (let i = 0; purging && toPurge.length > 0; i++) {
            let member = toPurge.pop();
            try {
                yield purgeMember(member);
            }
            catch (e) {
                console.error(`Failed kicking user: ${e}`);
            }
            reportText += `${member.user.id} ${member}\n`;
            if (i % 10 == 0) {
                yield progressMessage.edit(`Purging... ${Math.floor((i / startCount) * 100)}%`);
                yield logger_1.report(context.guild, reportText);
                reportText = '';
            }
        }
        yield progressMessage.edit('Purging... 100%');
        yield context.send(`Purged ${startCount} members in ${Math.floor((Date.now() - startTime) / 1000)} seconds.`);
        purging = false;
        console.log(`Purge complete, purged ${startCount} members.`);
    });
}
exports.startPurge = startPurge;
function purgeMember(member) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config_1.default.snap_dm_message.length > 0) {
            yield member.send(config_1.default.snap['dm message']);
        }
        yield member.kick(config_1.default.snap['kick reason']);
    });
}
exports.purgeMember = purgeMember;
//# sourceMappingURL=purgeHandler.js.map