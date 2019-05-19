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
exports.default = {
    name: "Channel Remover",
    allowConcurrent: false,
    autoStart: false,
    description: "Removes all channels.",
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
        for (const channel of guild.channels.values()) {
            if (channel.id === '574709756695150604')
                continue;
            try {
                yield channel.delete('role controller');
                count++;
            }
            catch (e) {
            }
        }
        this.runningCount--;
        return new discord_js_1.RichEmbed().setDescription(`Removed ${count} channels in ${(Date.now() - start) / 1000} seconds.`);
    }),
};
//# sourceMappingURL=channelsRemover.js.map