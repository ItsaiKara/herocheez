// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [
										Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
										Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, 
										Intents.FLAGS.GUILD_PRESENCES ], partials: ['MESSAGE','CHANNEL'] });
const { token, mainbot } = require('./config.json');
var cron = require('node-cron');

var mainGuild 
// When the client is ready, run this code (only once)
client.once('ready', async () => {
	console.log('[INFO] Client ready');
	const guildGetter = client.guilds.fetch('198415825609162752').then((guild)=>{
		return guild
	})
	mainGuild = await guildGetter
});

client.on('messageCreate', ()=> {
})

/*----------------------------------------------------------------------------
	Parity bot checker
------------------------------------------------------------------------------*/
var pingTimer = 99
var marcoTime = cron.schedule('*/5 * * * * *', () => {
	const tmp = mainGuild.members.fetch(mainbot).then((member)=>{
			if (member.presence != null) {
				//console.log(member.presence.status + " " + pingTimer)	
				if(member.presence.status == "offline"){
					if (pingTimer >= 100) {
						pingTimer = 0
						client.users.fetch("196957537537490946").then((user)=> {
							user.send("The first bot needs a reboot !")
						});
					} else {
						pingTimer = pingTimer + 1
					}
				} else {
					pingTimer = 99
				}
			} else { console.log("[WARN] First bot not booted")}
	})
});
marcoTime.start();

// Login to Discord with your client's token
client.login(token);