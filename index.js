/*
 * © 2026 SeXyxeon (VOIDSEC)
 *
 * ⚠️ COPYRIGHT NOTICE
 * This source code is protected under copyright law.
 * Any form of re-uploading, recoding, modification,
 * selling, or redistribution WITHOUT explicit permission
 * from the original author is strictly prohibited.
 *
 * ❌ NO CREDIT = NO PERMISSION
 * ❌ DO NOT CLAIM THIS CODE AS YOUR OWN
 *
 * ✔️ Usage or modification is allowed ONLY
 * with prior permission and proper credit.
 *
 * OFFICIAL LINKS (ONLY):
 * YouTube   : https://youtube.com/@voidsec7718
 * Instagram : sabir._7718
 * Telegram  : https://t.me/SABIR7718
 * GitHub    : https://github.com/SABIR7718
 * WhatsApp  : +91 73650 85213
 *
 * Violations may result in DMCA takedown
 * or termination of the Telegram bot.
 */
 

require("dotenv").config();
process.env.NTBA_FIX_350 = 1;
const SY = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch').default;
const {
    log
} = require("@sabir7718/log");
const config = require("./config");
const {
    exec
} = require('child_process');
const LoveDir = './Love';
if (!fs.existsSync(LoveDir)) {
    fs.mkdirSync(LoveDir);
}

const api = process.env.API

const activeBots = {};
const notauthorized = '⚠️ 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.';
const protectionMessage = `❌ 𝖸𝗈𝗎 𝗆𝗎𝗌𝗍 𝗃𝗈𝗂𝗇 𝗈𝗎𝗋 𝖼𝗁𝖺𝗇𝗇𝖾𝗅 𝖺𝗇𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖻𝗈𝗍.\n𝖠𝖿𝗍𝖾𝗋 𝗃𝗈𝗂𝗇𝗂𝗇𝗀, 𝖼𝗅𝗂𝖼𝗄 𝗍𝗁𝖾 𝗏𝖾𝗋𝗂𝖿𝗒 𝖻𝗎𝗍𝗍𝗈𝗇 𝖻𝖾𝗅𝗈𝗐.`;

function getDB() {
    const dbPath = path.join(LoveDir, 'data.json');
    if (!fs.existsSync(dbPath)) {
        return {
            tokens: [],
            premium: [],
            resellers: []
        };
    }
    try {
        const content = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        log('error', null, 'Database read error: ' + err.message);
        return {
            tokens: [],
            premium: [],
            resellers: []
        };
    }
}

function saveDB(data) {
    try {
        fs.writeFileSync(path.join(LoveDir, 'data.json'), JSON.stringify(data, null, 2));
    } catch (err) {
        log('error', null, 'Database save error: ' + err.message);
    }
}

function isPremium(userId) {
    const db = getDB();
    return db.premium.some(id => id.toString() === userId.toString());
}

async function CheckSYlovesToo(userId) {
    if (userId.toString() === config.adminId.toString()) return true;

    try {
        const response = await fetch(
            `https://checksylovetoo.onrender.com/checksylovestoo?id=${userId}`
        );

        const data = await response.json();

        return data.isjoined === true;

    } catch (err) {
        console.error("Protection API Error:", err.message);
        return false;
    }
}

function cleanHTML(text) {
    return (text || "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
}

function SABIR7718() {
    const diff = Date.now() - startTime;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${d}𝖽 ${h}𝗁 ${m}𝗆`;
}

const startTime = Date.now();

function mainCaption(name, runtime) {
    return `<b>─【 𝐒𝐀𝐘𝐀𝐍 𝐗 𝐓𝐄𝐌𝐏 𝐌𝐀𝐈𝐋 】─

 𝖴𝗌𝖾𝗋 : ${name}
 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 : ${runtime}
 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋 : ${config.S7}

𝖴𝗌𝖾 -</b> <code>/getmail</code> 👀`;
}

const joinKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: '📢 𝖩𝗈𝗂𝗇 𝖢𝗁𝖺𝗇𝗇𝖾𝗅',
                url: config.channel
            }, {
                text: '👥 𝖩𝗈𝗂𝗇 𝖦𝗋𝗈𝗎𝗉',
                url: config.group
            }],
            [{
                text: '✅ 𝖵𝖾𝗋𝗂𝖿𝗒 𝖬𝖾𝗆𝖻𝖾𝗋𝗌𝗁𝗂𝗉',
                callback_data: 'check_membership'
            }]
        ]
    }
};

function startBot(token, isMain = false) {
    try {
        const S7 = new SY(token, {
            polling: true
        });
        let botConfig = {
            ...config
        };
        let tokenData = getDB().tokens.find(t => t.token === token);
        if (tokenData && tokenData.config) {
            botConfig = {
                ...botConfig,
                ...tokenData.config
            };
        }
        const botOwnerId = tokenData ? tokenData.owner : config.adminId;

        S7.getMe().then(me => {
            activeBots[token] = S7;
            log('success', 'BOT', `Started @${me.username}`);
        }).catch(err => {
            log('error', 'BOT', `Failed token ${token.slice(0,10)}`);
        });

        function SYLoVe(commands, callback) {
            if (!Array.isArray(commands)) commands = [commands];
            S7.on('message', async (msg) => {
                if (!msg.text) return;
                const cmd = msg.text.trim().split(' ')[0].slice(1).toLowerCase();
                if (commands.includes(cmd)) {
                    const chatId = msg.chat.id;
                    const userId = msg.from.id;
                    if (botConfig.channelId || botConfig.groupId) {
                        if (cmd !== 'checkmembership') {
                            const isMember = await CheckSYlovesToo(userId)
                            if (!isMember) {
                                return S7.sendMessage(chatId, `🚫 <b>𝖠𝖼𝖼𝖾𝗌𝗌 𝖣𝖾𝗇𝗂𝖾𝖽!</b>\n\n𝖯𝗅𝖾𝖺𝗌𝖾 𝗃𝗈𝗂𝗇 𝗈𝗎𝗋 𝖼𝗈𝗆𝗆𝗎𝗇𝗂𝗍𝗒 𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾.`, {
                                    parse_mode: 'HTML',
                                    ...joinKeyboard
                                });
                            }
                        }
                    }
                    callback(msg, S7, chatId, userId);
                }
            });
        }

        SYLoVe(['start', 'menu'], (msg, S7, chatId) => {
            const name = msg.from.first_name || "𝖴𝗌𝖾𝗋";
            S7.sendPhoto(chatId, config.logo, {
                caption: mainCaption(name, SABIR7718()),
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '📢 𝖮𝖿𝖿𝗂𝖼𝗂𝖺𝗅 𝖢𝗁𝖺𝗇𝗇𝖾𝗅',
                            url: config.channel
                        }],
                        [{
                            text: '👥 𝖲𝗎𝗉𝗉𝗈𝗋𝗍 𝖦𝗋𝗈𝗎𝗉',
                            url: config.group
                        }]
                    ]
                }
            });
        });

        const userInboxes = new Map();

        SYLoVe('getmail', async (msg, S7, chatId, userId) => {

            const loading = await S7.sendMessage(chatId,
                "─【 𝐃 𝐇 — ا 𝐘 】─\n\n" +
                "🔄 *Creating New Temporary Mail...* 👀", {
                    parse_mode: "Markdown"
                }
            );

            try {
                const response = await fetch(`${api}/new`);
                const data = await response.json();

                if (!data.email || !data.id) throw new Error("API Error");

                const email = data.email;
                const inboxId = data.id;

                userInboxes.set(userId.toString(), {
                    email: email,
                    inboxId: inboxId,
                    time: Date.now()
                });

                const caption = `
<b>─【 𝐒𝐀𝐘𝐀𝐍 𝐗 𝐓𝐄𝐌𝐏 𝐌𝐀𝐈𝐋 】─</b>

<b>👤 User :</b> ${msg.from.first_name || "User"}
<b>⏳ Runtime :</b> ${SABIR7718()}
<b>👨‍💻 Developer :</b> @ZoroXbug

━━━━━━━━━━━━━━━━━━
<b>✅ New Mail Created Successfully!</b>

<b>📧 Your Email:</b>
<code>${email}</code>

<b>🆔 Inbox ID:</b>
<code>${inboxId}</code>

━━━━━━━━━━━━━━━━━━
<b>📥 Refresh Inbox:</b>

<code>/checkmail ${inboxId}</code>
`;

                await S7.editMessageText(caption, {
                    chat_id: chatId,
                    message_id: loading.message_id,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "Copy Email",
                                copy_text: {
                                    text: email
                                }
                            }]
                        ]
                    }
                });

            } catch (error) {
                console.error(error);
                await S7.editMessageText(
                    "─【 𝐃 𝐇 — ا 𝐘 】─\n\n❌ *Failed to create temporary mail!*", {
                        chat_id: chatId,
                        message_id: loading.message_id,
                        parse_mode: "Markdown"
                    }
                );
            }
        });

        SYLoVe('checkmail', async (msg, S7, chatId, userId) => {

            const userData = userInboxes.get(userId.toString());

            if (!userData) {
                return S7.sendMessage(chatId,
                    "❌ *You don't have any active temporary mail.*\n\nUse /getmail first!", {
                        parse_mode: "Markdown"
                    }
                );
            }

            const loading = await S7.sendMessage(chatId,
                "─【 𝐃 𝐇 — ا 𝐘 】─\n\n🔄 *Checking Inbox...* 👀", {
                    parse_mode: "Markdown"
                }
            );

            try {
                const response = await fetch(`${api}/inbox/${userData.inboxId}`);
                const data = await response.json();

                let text =
                    `─【 𝐒𝐀𝐘𝐀𝐍 𝐗 𝐓𝐄𝐌𝐏 𝐌𝐀𝐈𝐋 】─

 𝖴𝗌𝖾𝗋 : ${msg.from.first_name || "User"}
 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 : ${SABIR7718()}
 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋 : @ZoroXbug

━━━━━━━━━━━━━━━━━━
📧 **Yᴏᴜʀ Eᴍᴀɪʟ:** \`${userData.email}\`

`;

                if (data.mails && data.mails.length > 0) {
                    text += `📬 **Nᴇᴡ Mᴇssᴀɢᴇs:** ${data.mails.length}\n\n`;

                    data.mails.forEach((mail, i) => {
                        text += `📧 *Mᴇssᴀɢᴇ ${i+1}*\n`;
                        text += `👤 Fʀᴏᴍ: ${mail.from || "Unknown"}\n`;
                        text += `📌 Sᴜʙᴊᴇᴄᴛ: ${mail.subject || "No Subject"}\n`;
                        text += `⏰ Tɪᴍᴇ: ${mail.date || "N/A"}\n\n`;

                        let body = cleanHTML(mail.body || mail.text || "No content");

                        if (body.length > 3000) {
                            body = body.slice(0, 300) + "...";
                        }

                        text += `💬 ${body}\n\n━━━━━━━━━━━━━━━━━━\n\n`;
                    });
                } else {
                    text += "📭 *No messages yet...*\n\nRefresh again after some time.";
                }

                await S7.editMessageText(text, {
                    chat_id: chatId,
                    message_id: loading.message_id,
                    parse_mode: "Markdown"
                });

            } catch (error) {
                console.error(error);
                S7.editMessageText(
                    "─【 𝐃 𝐇 — ا 𝐘 】─\n\n❌ *Failed to fetch inbox!*", {
                        chat_id: chatId,
                        message_id: loading.message_id,
                        parse_mode: "Markdown"
                    }
                );
            }
        });



        SYLoVe('checkmembership', async (msg, S7, chatId, userId) => {
            const isMember = await CheckSYlovesToo(userId)
            if (isMember) {
                S7.sendMessage(chatId, "✅ 𝖵𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅! 𝖸𝗈𝗎 𝖼𝖺𝗇 𝗇𝗈𝗐 𝗎𝗌𝖾 𝗍𝗁𝖾 𝖻𝗈𝗍.");
            } else {
                S7.sendMessage(chatId, protectionMessage, {
                    parse_mode: 'HTML',
                    ...joinKeyboard
                });
            }
        });

        SYLoVe('addprem', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);

            const target = msg.text.split(' ')[1];
            if (!target) return S7.sendMessage(chatId, "Usage: /addprem <user_id>");

            let db = getDB();
            if (db.premium.includes(target)) {
                return S7.sendMessage(chatId, "✅ User is already premium.");
            }

            db.premium.push(target);
            saveDB(db);
            S7.sendMessage(chatId, `✅ *User ${target} added to Premium!*`, {
                parse_mode: "Markdown"
            });
        });

        SYLoVe('runs7', async (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId.toString()) {
                return S7.sendMessage(chatId, notauthorized);
            }

            const command = msg.text.split(' ').slice(1).join(' ');
            if (!command) {
                return S7.sendMessage(chatId, "Usage: /run <command>");
            }

            const loading = await S7.sendMessage(chatId, "⚙️ Running command...");

            exec(command, {
                timeout: 15000,
                maxBuffer: 1024 * 1024
            }, (error, stdout, stderr) => {
                let result = '';

                if (error) {
                    result += `❌ Error:\n${error.message}\n\n`;
                }

                if (stderr) {
                    result += `⚠️ Stderr:\n${stderr}\n\n`;
                }

                if (stdout) {
                    result += `✅ Output:\n${stdout}`;
                }

                if (!result) result = "No output.";

                if (result.length > 4000) {
                    result = result.slice(0, 4000) + "\n\n...output truncated";
                }

                S7.editMessageText("```\\n" + result + "\\n```", {
                    chat_id: chatId,
                    message_id: loading.message_id,
                    parse_mode: "Markdown"
                });
            });
        });

        SYLoVe('delprem', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);

            const target = msg.text.split(' ')[1];
            if (!target) return S7.sendMessage(chatId, "Usage: /delprem <user_id>");

            let db = getDB();
            const index = db.premium.indexOf(target);
            if (index === -1) return S7.sendMessage(chatId, "❌ User not found in premium list.");

            db.premium.splice(index, 1);
            saveDB(db);
            S7.sendMessage(chatId, `🗑️ *User ${target} removed from Premium.*`, {
                parse_mode: "Markdown"
            });
        });

        SYLoVe('listprem', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);

            const db = getDB();
            if (db.premium.length === 0) return S7.sendMessage(chatId, "No premium users yet.");

            let text = "🌟 *Premium Users List:*\n\n";
            db.premium.forEach((id, i) => {
                text += `\n${i + 1}. <code>${id}</code>\n`;
            });

            S7.sendMessage(chatId, text, {
                parse_mode: "HTML"
            });
        });

        SYLoVe('addtoken', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            const token = msg.text.split(' ')[1];
            if (!token) return S7.sendMessage(chatId, "𝖴𝗌𝖺𝗀𝖾: /𝖺𝖽𝖽𝗍𝗈𝗄𝖾𝗇 <𝗍𝗈𝗄𝖾𝗇>");
            let db = getDB();
            if (db.tokens.some(t => t.token === token)) return S7.sendMessage(chatId, "𝖳𝗈𝗄𝖾𝗇 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌.");
            db.tokens.push({
                token,
                owner: userId.toString()
            });
            saveDB(db);
            startBot(token);
            S7.sendMessage(chatId, "✅ 𝖭𝖾𝗐 𝖻𝗈𝗍 𝗂𝗇𝗌𝗍𝖺𝗇𝖼𝖾 𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽.");
        });

        SYLoVe('deltoken', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            const token = msg.text.split(' ')[1];
            if (!token) return S7.sendMessage(chatId, "𝖴𝗌𝖺𝗀𝖾: /𝖽𝖾𝗅𝗍𝗈𝗄𝖾𝗇 <𝗍𝗈𝗄𝖾𝗇>");
            let db = getDB();
            const idx = db.tokens.findIndex(t => t.token === token);
            if (idx === -1) return S7.sendMessage(chatId, "𝖳𝗈𝗄𝖾𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.");
            db.tokens.splice(idx, 1);
            saveDB(db);
            if (activeBots[token]) {
                activeBots[token].stopPolling().catch(() => {});
                delete activeBots[token];
            }
            S7.sendMessage(chatId, "🗑️ 𝖳𝗈𝗄𝖾𝗇 𝗋𝖾𝗆𝗈𝗏𝖾𝖽.");
        });

        S7.on('callback_query', async (query) => {
            if (query.data === 'check_membership') {
                const isMember = await CheckSYlovesToo(query.from.id);
                if (isMember) {
                    S7.deleteMessage(query.message.chat.id, query.message.message_id).catch(() => {});
                    S7.sendMessage(query.message.chat.id, "✅ 𝖠𝖼𝖼𝖾𝗌𝗌 𝖦𝗋𝖺𝗇𝗍𝖾𝖽!");
                } else {
                    S7.answerCallbackQuery(query.id, {
                        text: "❌ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾𝗇'𝗍 𝗃𝗈𝗂𝗇𝖾𝖽 𝗒𝖾𝗍!",
                        show_alert: true
                    });
                }
            }
        });

    } catch (err) {
        log('error', 'SYSTEM', err.message);
    }
}

startBot(config.mainToken, true);
const db = getDB();
db.tokens.forEach(item => startBot(item.token));
log('info', 'SYSTEM', `Premium System Online.`);

if (process.env.URL) {

    (async () => {
        try {
            const res = await fetch(process.env.URL);
            log('info', 'PING', `Pinged: ${process.env.URL} | Status: ${res.status}`);
        } catch (err) {
            log('error', 'PING', err.message);
        }
    })();

    setInterval(async () => {
        try {
            const res = await fetch(process.env.URL);
            log('info', 'PING', `Pinged: ${process.env.URL} | Status: ${res.status}`);
        } catch (err) {
            log('error', 'PING', err.message);
        }
    }, 5 * 60 * 1000);
}