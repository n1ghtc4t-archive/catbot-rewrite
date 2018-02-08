const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const USER_DATA_FILE = "./userdata.json";
const userData = require(USER_DATA_FILE);

let PREFIX = "c:";
let DEBUG = true;

//Command definitions! For the lols
/*
Sample definition:
cmds["cmdName"] = {
	name: "cmdName",
	aliases: [],
	category: "some category",
	func: (msg, parameters) => {
	}

}
*/

//Define the commands!

let cmds = {};

cmds["eval"] = {
	name: "eval",
	aliases: [],
	category: "Dev",
	help: "eval help",
	func: (msg, parameters) => {
		if (msg.author.id !== "260246864979296256") return;
		let evall = msg.content.split(' ')[0];
		let evalstuff = msg.content.split(" ").slice(1).join(" ");
		try {
			const code = msg.content.split(" ").slice(1).join(" ");
			let evaled = eval(code);
			if (!code) {
				return msg.channel.send("Please provide something for me to eval!");
			}

			if (typeof evaled !== 'string')
				evaled = require('util').inspect(evaled);

			 const embed = new Discord.RichEmbed()
			 .setTitle(`Evaluation:`)
			 .setColor("0x4f351")
			 .setDescription(`📥 Input: \n \`\`\`${evalstuff}\`\`\` \n 📤 Output: \n  \`\`\`${clean(evaled)}\`\`\``);
			 
			 msg.channel.send({embed});
		} catch (err) {
			 const embed = new Discord.RichEmbed()
			 .setTitle(`Evaluation:`)
			 .setColor("0xff0202")
			 .setDescription(`📥 Input: \n \`\`\`${evalstuff}\`\`\` \n 📤 Output: \n  \`\`\`${clean(err)}\`\`\``);
			
			 msg.channel.send({embed});
		}
	}
}

cmds["ping"] = {
	name: "ping",
	aliases: [],
	category: "General",
	help: "ping help",
	func: (msg, parameters) => {
		msg.channel.send("Pinging...").then(sent => {
			sent.edit(`Pong! (Time Taken: ${sent.createdTimestamp - msg.createdTimestamp}ms)`);
		});
	}
}

cmds["cat"] = {
	name: "cat",
	aliases: [],
	category: "Fun",
	help: "cat help",
	func: (msg, parameters) => {
			const {get} = require("snekfetch")
			get("https://random.cat/meow").then(res => {
				msg.channel.send(res.body.file);
			});
	}
}


cmds["userinfo"] = {
	name: "userinfo",
	aliases: [],
	category: "Util",
	help: "Util help",
	func: (msg, parameters) => {
		try {
			// return msg.channel.send("Sorry, you cannot use this command");	
			let userMention = msg.mentions.users.first()
			if (!userMention) {
				const embed = new Discord.RichEmbed()
				.setTitle(`Information about ${msg.author.username}`, msg.author.avatarURL)
				.setColor('RANDOM')
				.addField(`Full username`, `${msg.author.tag}`)
				.addField(`Nickname`, `${msg.member.nickname || "None"}`)
				.addField(`Status`, `${msg.author.presence.status}`)
				.addField(`Roles`, `Soon:tm:`)
				.addField(`Joined guild`, `Soon:tm:`)
				.addField(`Joined Discord`, `Soon:tm:`)
				.addField(`Is a bot`, `${msg.author.bot}`)
				.addField(`User ID`, `${msg.author.id}`)
				
				msg.channel.send({embed});
				/* 
				${msg.member.joinedAt.substr(0, 15)} 
				${msg.member.createdAt.substr(0, 15)} 
				*/
			} else { 
				const embed = new Discord.RichEmbed()
				.setTitle(`Information about ${userMention.username}`, userMention.avatarURL)
				.setColor('RANDOM')
				.addField(`Full username`, `${userMention.tag}`)
				.addField(`Nickname`, `${userMention.nickname || "None"}`)
				.addField(`Status`, `${userMention.presence.status}`)
				.addField(`Roles`, `WIP`)
				.addField(`Joined guild`, `Soon:tm:`)
				.addField(`Joined Discord`, `Soon:tm:`)
				.addField(`Is a bot`, `${userMention.bot}`)
				.addField(`User ID`, `${userMention.id}`) 
				
				msg.channel.send({embed});
				/*
				${userMention.joinedAt.substr(0, 15)} 
				${userMention.createdAt.substr(0, 15)}
				*/
			}
		} catch (err) {
			msg.channel.send(err.stack, {code: true});	
		}
	}
}


cmds["say"] = {
	name: "say",
	aliases: [],
	category: "Dev",
	help: "say help",
	func: (msg, parameters) => {
		let args = msg.content.split(' ').slice(1).join(' ');
		if (msg.author.id !== "260246864979296256") {
			return msg.reply("no");
		}
		if (!args) {
			return msg.reply("Args pls");
		}
		msg.delete();
		msg.channel.send(`${args}`);
	}
}


cmds["serverinfo"] = {
	name: "serverinfo",
	aliases: [],
	category: "Util",
	help: "serverinfo help",
	func: (msg, parameters) => {
		const embed = new Discord.RichEmbed()
		.setTitle(`Information about ${msg.guild.name}`)
		.setColor("RANDOM")
		.addField(`Owner`, `${msg.guild.owner}`)
		.addField(`Channels`, `${msg.guild.channels.filter(c => c.type === "text").size} (${msg.guild.channels.filter(c => c.type === "voice").size} voice)`)
		.addField(`Roles`, `${msg.guild.roles.size}`)
		.addField(`Guild ID`, `${msg.guild.id}`)
		.addField(`Members`, `${msg.guild.members.filter(m => !m.user.bot).size} members (${msg.guild.members.filter(m => m.user.bot).size} bots)`) 
		.addField(`Created At`, `${msg.guild.createdAt.toString().substr(0, 15)}`) 
		.addField(`Region`, `${msg.guild.region}`) 
		.addField(`Verification Level`, `${msg.guild.verificationLevel}`);

		msg.channel.send({embed});
	}
}


cmds["catify"] = {
	name: "catify",
	aliases: [],
	category: "Fun",
	help: "catify help",
	func: (msg, parameters) => {
		let args = msg.content.split(" ").slice(1);
		if (!args) {
			return msg.reply("This command requires arguments.");
		}
		msg.channel.send("🐱" + args.join("🐱") + "🐱");
	}
}


cmds["invite"] = {
	name: "invite",
	aliases: [],
	category: "General",
	help: "invite help",
	func: (msg, parameters) => {
		msg.reply("You can invite me here!\nhttps://bot.discord.io/catbot");
	}
}


cmds["sorry"] = {
	name: "sorry",
	aliases: [],
	category: "Hidden",
	help: "sorry help",
	func: (msg, parameters) => {
		msg.channel.send("https://cdn.discordapp.com/attachments/309625872665542658/406040395462737921/image.png");
	}
}

cmds["rep"] = {
	name: "rep",
	aliases: [],
	category: "Fun",
	help: "rep help",
	func: (msg, parameters) => {
		var user = msg.mentions.members.first();
		if(!user) return msg.reply("Please provide a user mention!");
		userid = user.id;
		if (userid == msg.author.id) return msg.reply("You can't give reputation to yourself!");
		author_data = userData[msg.author.id] ? userData[msg.author.id] : {};

		author_last_rep = author_data["lastrep"] ? author_data["lastrep"] : 0;
		now = Math.floor(Date.now() / 1000);
		diff = now - author_last_rep
		if (diff <= 86400) return msg.reply("You can next give reputation in "+(86400 - diff).toString()+" seconds!")

		users_data = userData[userid] ? userData[userid] : {};

		users_data["rep"] = users_data["rep"] ? users_data["rep"] + 1 : 1;
		author_data["lastrep"] = now;

		userData[userid] = users_data;
		userData[msg.author.id] = author_data
		writeUserData();
		msg.reply("You have given 1 reputation point to the user! They now have "+users_data["rep"].toString()+" rep.");
	}
}

cmds["dog"] = {
	name: "dog",
	aliases: [],
	category: "Work In Progress",
	help: "dog help",
	func: (msg, parameters) => {
		const {get} = require("snekfetch")
		get("https://random.dog/woof").then(res => {
			filename = res.body.toString();
//            get("https://random.dog/"+filename).then(res => {
//                msg.channel.send(res.body.file)
//            });
			msg.channel.send("https://random.dog/"+filename);
		});
	}

}
/* Old help for reference
cmds["help"] = {
	name: "help",
	aliases: [],
	category: "Hidden",
	help: "help help",
	func: (msg, parameters) => {
		const embed = new Discord.RichEmbed()
		.setTitle(`Catbot Help`)
		.setColor(0xc6c6c6)
		.addField(`General`, `\`ping\`, \`invite\``)
		.addField(`Fun`, `\`catify\`, \`cat\`, \`rep\``)
		.addField(`Util`, `\`serverinfo\`, \`userinfo\``)
		.addField(`Mod`, `Soon`)
		.addField(`Dev`, `\`eval\`, \`say\``)
		.addField(`Work In Progress`, `\`dog\``)
		
		msg.author.send({embed});
	}
}
*/

cmds["help"] = {
	name: "help",
	aliases: [],
	category: "Hidden",
	help: "help help",
	func: (msg, parameters) => {
		const embed = new Discord.RichEmbed()
		.setTitle(`Catbot Help`)
		.setColor(0xc6c6c6);
		for (cat in categories) {
			if (cat == "Hidden") continue;
			catStr = "";
			cmdNum = categories[cat].length;
			for (var i = 0; i < cmdNum; i++){
				catStr += "`" + categories[cat][i] + "`";
				if (i < cmdNum - 1) catStr += ", ";
			}
			embed.addField(cat, catStr);
		}
		
		msg.author.send({embed});
		msg.channel.send("Sending help, check your DMs!");
	}
}



// Put together the categories
// This might be better done on startup or able to accessed from a command for hot-modification of commands?
// Explicitly naming categories here for manual ordering
let categories = {
	"General" : [],
	"Fun" : [],
	"Util" : [],
	"Mod" : ["Soon"],
	"Dev" : [],
	"Work In Progress" : []
}


for (cmd in cmds) {
	cat = cmds[cmd]["category"];
	if ( !(cat in categories) ) categories[cat] = [];
	categories[cat].push(cmd);
}

//Start the client and get going!
client.on('ready', () => {
	console.log(`I'm ready! (Logged in as: ${client.user.tag})`);
	client.user.setGame(PREFIX+'help for help!', 'https://www.twitch.tv/goddycodes');
});


client.on('message', msg => {
	if (msg.author.bot) return;
	if ( msg.content.startsWith(PREFIX) ){
		message = msg.content;
		params = message.slice(PREFIX.length).split(' ');
		if (params[0] in cmds){
			if ( DEBUG ) console.log("Running command \""+params[0]+"\" from message:\n"+message);
			try{
				cmds[params[0]].func(msg, params);
			} catch (err) {
				msg.channel.send("Something went wrong! This event has been logged.");
				console.error("Something went wrong. Was running command \""+params[0]+"\" from message \n"+message+"\nGot the stack trace:\n"+err.stack)
			}
		}
	}
});

function clean(text) {
	if (typeof(text) === "string")
    		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  	else
      		return text;
}

function writeUserData() {
    /*
    //Heroku has read only file system so don't do anything here at the moment
	fs.writeFile(USER_DATA_FILE, JSON.stringify(UserData), err => {
		if (err) { console.error(err) };
	});
    */
}

client.login(process.env.BOT_TOKEN);
