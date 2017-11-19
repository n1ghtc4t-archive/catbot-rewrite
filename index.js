const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`I'm ready! (Logged in as: ${client.user.tag})`);
  client.user.setGame(`c:help for help!`, 'https://www.twitch.tv/goddycodes')
});

let prefix = "c:"

client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content.startsWith(prefix + 'ping')) {
		msg.channel.send("Pinging...").then(sent => {
			sent.edit(`Pong! (Time Taken: ${sent.createdTimestamp - msg.createdTimestamp}ms)`)
		})
	}
    
    if(msg.content.startsWith(prefix + 'eval')) {
    if (msg.author.id !== "260246864979296256") return
    let evall = msg.content.split(' ')[0];
    let evalstuff = msg.content.split(" ").slice(1).join(" ")
    try {
     const code = msg.content.split(" ").slice(1).join(" ")
     let evaled = eval(code);
     if (!code) {
     	return msg.channel.send("Please provide something for me to eval!")
     }

     if (typeof evaled !== 'string')
       evaled = require('util').inspect(evaled);
    
       const embed = new Discord.RichEmbed()
       .setTitle(`Evaluation:`)
   
       .setColor("0x4f351")
       .setDescription(`📥 Input: \n \`\`\`${evalstuff}\`\`\` \n 📤 Output: \n  \`\`\`${clean(evaled)}\`\`\``)
   
     msg.channel.send({embed});
   } catch (err) {
     const embed = new Discord.RichEmbed()
     .setTitle(`Evaluation:`)

     .setColor("0xff0202")
     .setDescription(`📥 Input: \n \`\`\`${evalstuff}\`\`\` \n 📤 Output: \n  \`\`\`${clean(err)}\`\`\``)

     msg.channel.send({embed});
   }
 }

 if (msg.content.startsWith(prefix + 'userinfo')) {
 	return msg.channel.send("Sorry, you cannot use this command")
 }
 	/* 
 	let userMention = msg.mentions.users.first()
 	if (!userMention) {
 		const embed = new Discord.RichEmbed()
 		.setTitle(`Information about ${msg.author.username}`, msg.author.avatarURL)
 		.addField(`Full username`, `${msg.author.tag}`)
 		.addField(`Nickname`, `${msg.author.displayName}`)
 		.addField(`Status`, `${msg.author.presence.status}`)
 		.addField(`Roles`, `WIP`)
 		.addField(`Joined guild`, `${msg.author.joinedAt.toString().substr(0, 15)}`)
 		.addField(`Joined Discord`, `${msg.author.createdAt.toString().substr(0, 15)}`)
 		.addField(`Is a bot`, `${msg.author.bot}`)
 		.addField(`User ID`, `${msg.author.id}`)
 	}   
 	 	const embed = new Discord.RichEmbed()
 		.setTitle(`Information about ${userMention.username}`, userMention.avatarURL)
 		.addField(`Full username`, `${userMention.tag}`)
 		.addField(`Nickname`, `${userMention.displayName}`)
 		.addField(`Status`, `${userMention.presence.status}`)
 		.addField(`Roles`, `WIP`)
 		.addField(`Joined guild`, `${userMention.joinedAt.toString().substr(0, 15)}`)
 		.addField(`Joined Discord`, `${userMention.createdAt.toString().substr(0, 15)}`)
 		.addField(`Is a bot`, `${userMention.bot}`)
 		.addField(`User ID`, `${userMention.id}`) 
 		*/

 	if (msg.content.startsWith(prefix + 'say')) {
 		let args = msg.content.split(' ').slice(1).join(' ')
 		if (msg.author.id !== "260246864979296256") {
 			return msg.reply("no")
 		}
 		if (!args) {
 			return msg.reply("well ok then")
 		}
 		msg.delete()
 		msg.channel.send(`${args}`)
 	}
	
	if (msg.content.startsWith(prefix + 'serverinfo')) {
		const embed = new Discord.RichEmbed()
		.setTitle(`Server name: ${msg.guild.name} (${msg.guild.id})`)
		.addField(`Owner`, `${msg.guild.owner}`)
		.addField(`Channels`, `${msg.guild.channels.filter(c => c.type === "text").size} text channels (${msg.guild.channels.filter(c => c.type === "text").size} voice channels)`)
		.addField(`Roles`, `${msg.guild.roles.size}`)
		.addField(`Members`, `${msg.guild.members.filter(m => !m.user.bot).size} members (${msg.guild.members.filter(m => m.user.bot).size} bots)`)
		.addField(`Created At`, `${msg.guild.createdAt.toString().substr(0, 15)}`)
		.addField(`Region`, `${msg.guild.region}`)
		.addField(`Verification Level`, `${msg.guild.verificationLevel}`)
		
		msg.channel.send({embed})
	}
    
	if (msg.content.startsWith(prefix + 'help')) {
		const embed = new Discord.RichEmbed()
		.setTitle(`Catbot Help`)
		.setColor(0xc6c6c6)
		.addField(`Fun`, `\`ping\``)
		.addField(`Util`, `\`serverinfo\``)
		.addField(`Mod`, `Soon`)
		.addField(`Dev`, `\`eval\`, \`say\``)
		.addField(`Work in Progress`, `\`userinfo\``)

		msg.author.send({embed});
	}
});

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.login(process.env.BOT_TOKEN);
