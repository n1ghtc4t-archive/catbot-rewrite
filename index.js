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
    if (msg.author.id !== "your userID") return
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

	if (msg.content.startsWith(prefix + 'help')) {
		const embed = new Discord.RichEmbed()
		.setTitle(`Catbot Help`)
		.setColor(0xc6c6c6)
		.addField(`Fun`, `\`ping\``)
		.addField(`Util`, `Soon`)
		.addField(`Mod`, `Soon`)
		.addField(`Dev`, `\`eval\``)
		.addField(`Work in Progress`, `No commands here (yet)`)

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
