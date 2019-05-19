import {Client, Message, RichEmbed, TextChannel} from 'discord.js';
import {Task}                                    from '../index';

const channelID = '579452345486802965';

const info = [{
    'send':   ['<:LSS:512831921882005521> __**SKY ADVENTURES**__', '<:roll_safe:512744302678376458> <#579445480254078977>', '<:rolf:512744301499777034> <#579445483051810827>', '<:rokanaisu:512744300216582162> <#579445481839788032>'],
    'reacts': {
        '512831921882005521': '579451897933594625',
        '512744302678376458': '579451899330428950',
        '512744301499777034': '579451906200567828',
        '512744300216582162': '579451912508932108'
    }
}, {
    'send':   ['<:RoHappy:512733235940163595> __**IMPORTANT**__'],
    'reacts': {'512733235940163595': '579451920671047694'}
}, {
    'send':   ['<:RokaGiv:512733235143507968> __**BUILDERS PARADISE**__', '<:rogerodas:512733234082218023> <#579445498071744522>', '<:RoCry:512733232790503434> <#579445495198384158>', '<:Rocket:512733231800647700> <#579445496649613343>'],
    'reacts': {
        '512733235143507968': '579451921925013555',
        '512733234082218023': '579451923955187733',
        '512733232790503434': '579451929675956235',
        '512733231800647700': '579451936009355264'
    }
}, {
    'send':   ['<:rlyniba:512733230865186826> __**OTHER FTB MOD PACKS**__', '<:RipSign:512733229569277973> <#579445502786142241>', '<:rippaulwalker:512733228621365278> <#579445500105719818>', '<:rip:512733227363074059> <#579445501569794078>'],
    'reacts': {
        '512733230865186826': '579451942292684800',
        '512733229569277973': '579451943957823500',
        '512733228621365278': '579451949808746500',
        '512733227363074059': '579451956591067156'
    }
}, {
    'send':   ['<:rip:512733226285137942> __**ULTIMATE RELOADED**__', '<:rip:512733224695365652> <#579445490396168196>', '<:rip:512733223864762388> <#579445491708985363>', '<:RIP:512733222447087658> <#579445493034385408>'],
    'reacts': {
        '512733226285137942': '579451962265960448',
        '512733224695365652': '579451963641692179',
        '512733223864762388': '579451969140424705',
        '512733222447087658': '579451973951291392'
    }
}, {
    'send':   ['<:rip:512733220979212329> __**CONTINUUM**__', '<:riotfist:512733220010459138> <#579445440475430941>', '<:RinWave:512733219246964737> <#579445439099699255>', '<:RinWave:512733218382938122> <#579445441457029151>'],
    'reacts': {
        '512733220979212329': '579451979189714945',
        '512733220010459138': '579451981219758080',
        '512733219246964737': '579451988786282496',
        '512733218382938122': '579451994754777090'
    }
}, {
    'send':   ['<:RinPaci:512729400916049935> __**REVELATION**__', '<:RinHappy:512729392426778624> <#579445475447406602>', '<:RikoShrug:512729380317954068> <#579445478182354944>', '<:rikoAAA:512729340388179968> <#579445476810817552>'],
    'reacts': {
        '512729400916049935': '579452001335771136',
        '512729392426778624': '579452002572959754',
        '512729380317954068': '579452007849656331',
        '512729340388179968': '579452015126773760'
    }
}, {
    'send':   ['<:rikkapaci:512729317625561088> __**FTB PRESENTS STONEBLOCK 2**__', '<:rikkaawe:512729311246286870> <#579445457483202560>', '<:ricky:512729294426865665> <#579445454199062528>', '<:RikaPaci:512729290509385750> <#579445455981772820>'],
    'reacts': {
        '512729317625561088': '579452021380481025',
        '512729311246286870': '579452022944825364',
        '512729294426865665': '579452028984623116',
        '512729290509385750': '579452035389456405'
    }
}, {
    'send':   ['<:RF:512729284260003841> __**PYRAMID REBORN**__', '<:rev3:512729270192177155> <#579445469810524161>', '<:revolving_purple_hearts:512729267898023937> <#579445471462817802>', '<:revolver:512729264466952203> <#579445473157578753>'],
    'reacts': {
        '512729284260003841': '579452042138091539',
        '512729270192177155': '579452043228610572',
        '512729267898023937': '579452049377460244',
        '512729264466952203': '579452053328494604'
    }
}, {
    'send':   ['<:reverse:512729260717244416> __**FTB PRESENTS DIREWOLF20**__', '<:rev2:512729258087546889> <#579445443641999379>', '<:rev1:512729252437688320> <#579445446452314112>', '<:retardeyes:512729249510326293> <#579445444870930434>'],
    'reacts': {
        '512729260717244416': '579452059775008787',
        '512729258087546889': '579452061524033585',
        '512729252437688320': '579452068230725644',
        '512729249510326293': '579452076531253278'
    }
}, {
    'send':   ['<:retardEyes:512729244749529109> __**TEXT CHANNELS**__', '<:Retard:512729241738149917> <#579445436881043478>'],
    'reacts': {'512729244749529109': '579452084282327040', '512729241738149917': '579452086312501258'}
}, {
    'send':   ['<:residentsleeper:512729238307078145> __**INFINITY EVOLVED**__', '<:ResidentSleeper:512729230229110825> <#579445461165801482>', '<:ResidentKrepo:512729227682906126> <#579445459525828608>', '<:remwink:512729221475336199> <#579445461946073101>'],
    'reacts': {
        '512729238307078145': '579452095787171871',
        '512729230229110825': '579452096437551104',
        '512729227682906126': '579452101394956289',
        '512729221475336199': '579452108307300371'
    }
}, {
    'send':   ['<:RemWink:512729218233401364> __**FTB PRESENTS SKYFACTORY 3**__', '<:RemVV:512729206355132417> <#579445452118818867>', '<a:feelsmilkman:512729203485966376> <#579445450470326273>', '<a:foxbot:512729199040135169> <#579445448515911692>'],
    'reacts': {
        '512729218233401364': '579452114225463329',
        '512729206355132417': '579452115425165323',
        '512729203485966376': '579452121938657296',
        '512729199040135169': '579452129316700170'
    }
}, {
    'send':   ['<a:FeelsNyanMan:512729195089100800> __**INTERACTIONS**__', '<a:FeelsMeowMan:512729191486324756> <#579445466026999808>', '<a:fpppp:512711953542545408> <#579445464248877057>', '<a:freek:512711942327107584> <#579445467801452544>'],
    'reacts': {
        '512729195089100800': '579452134815170573',
        '512729191486324756': '579452136551874580',
        '512711953542545408': '579452143820603393',
        '512711942327107584': '579452151194189871'
    }
}, {
    'send':   ['<a:frankerz:512711852602425346> __**SKY ODYSSEY**__', '<a:fp:512711819660623872> <#579445486407254048>', '<a:Fortnite4:512711568673341441> <#579445488164667393>', '<a:footur:512711545789087774> <#579445485203488769>'],
    'reacts': {
        '512711852602425346': '579452158181900307',
        '512711819660623872': '579452160262144016',
        '512711568673341441': '579452167216300052',
        '512711545789087774': '579452174245953536'
    }
}];

export default {
    name:            'Controller Creator',
    allowConcurrent: false,
    autoStart:       false,
    description:     'Creates the role controller message.',
    runningCount:    0,
    start:           async (client: Client) => {
        this.runningCount++;
        const channel = client.channels.get(channelID) as TextChannel;
        if (channel === null) {
            this.runningCount--;
            return new RichEmbed().setColor('ORANGE').setDescription(`Could not find channel [${channelID}].`);
        }
        let rtn = {};
        for (const entry of info) {
            const message   = await channel.send(entry.send) as Message;
            rtn[message.id] = {};
            for (const [emojiID, roleID] of Object.entries(entry.reacts)) {
                await message.react(emojiID);
                rtn[message.id][emojiID] = roleID;
            }
        }
        console.log(JSON.stringify(rtn));
        this.runningCount--;
    },
    stop:            async (client: Client) => {

    }
} as Task;