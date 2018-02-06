const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const USER_DATA_FILE = "./userdata.json";

const UserData = require(USER_DATA_FILE);

let prefix = "c:";

client.on('ready', () => {
	console.log(`I'm ready! (Logged in as: ${client.user.tag})`);
	client.user.setGame('c:help for help!', 'https://www.twitch.tv/goddycodes');
});


client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content.startsWith(prefix + 'ping')) {
		msg.channel.send("Pinging...").then(sent => {
			sent.edit(`Pong! (Time Taken: ${sent.createdTimestamp - msg.createdTimestamp}ms)`);
		});
	}

	if(msg.content.startsWith(prefix + 'eval')) {
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

	if (msg.content.startsWith(prefix + 'userinfo')) {
		return msg.channel.send("Sorry, you cannot use this command");
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
	
	if (msg.content.startsWith(prefix + 'serverinfo')){ 
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
	
	if (msg.content.startsWith(prefix + 'catify')) {
		let args = msg.content.split(" ").slice(1);
		if (!args) {
			return msg.reply("This command requires arguments.");
		}
		msg.channel.send("🐱" + args.join("🐱") + "🐱");
	}
	
	if (msg.content.startsWith(prefix + 'invite')) {
		msg.reply("You can invite me here!\nhttps://bot.discord.io/catbot");
	}
	
	if(msg.content.startsWith(prefix + "sorry")) {
		msg.channel.send("https://cdn.discordapp.com/attachments/309625872665542658/406040395462737921/image.png");
	}
/*	
	if (msg.content.startsWith(prefix + 'rep')) {
		let userToRep = msg.mentions.members.first().id;
		let startingRep = 0;
		//Check if there was actually a mention
		if(!userToRep) {
			return msg.reply("Please provide a user mention!");
		}
		//Read the userdata file (should really scan.. but then should really use a db engine)
		fs.readFile(USER_DATA_FILE, 'utf8', (err, data) => {
			if (err) {
				if (err.code == "ENOENT") {
					//Replace this with code to initialise file later
					console.log("User data file does not exist. Please initialise with {}");
					return;
				} else {
					console.error(err);
					return;
				}
			}
			usersdata = JSON.parse(data); //Grab the userdata
			userdata = usersdata[userToRep] ? usersdata[userToRep] : {}; // Grab the user we care about
			currentRep = userdata["rep"] ? userdata["rep"] : startingRep; // Get their rep
			newRep = currentRep + 1; //New rep
			userdata["rep"] = newRep; //Set their rep
			usersdata[userToRep] = userdata; //Write in the userdata to the dictionary
			//Write the user data to the file
			fs.writeFile(USER_DATA_FILE, JSON.stringify(usersdata), err => {
				if (err) { console.error(err) };
			});
			msg.reply("You have given 1 reputation point to the user!");
		});
	} */
	if (msg.content.startsWith(prefix + 'rep')) {
		var user = msg.mentions.members.first();
		if(!user) return msg.reply("Please provide a user mention!") ;
		userid = user.id;
		if (userid == msg.author.id) return msg.reply("You can't give reputation to yourself!");

		usersdata = UserData[userid] ? UserData[userid] : {};

		usersdata["rep"] = usersdata["rep"] ? usersdata["rep"] + 1 : 1;
		UserData[userid] = usersdata;
		writeUserData();
		msg.reply("You have given 1 reputation point to the user! They now have \""+usersdata["rep"].toString()+"\" rep.");

	}
/*
//Temp command to check someone's rep. Need a profile or something.
	if (msg.content.startsWith(prefix + 'viewrep')) {
		userToRep = msg.mentions.members.first().id;
		if(!userToRep) {return msg.reply("USAGE: "+prefix+"viewrep "+" <user mention>")};
		fs.readFile(USER_DATA_FILE, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				msg.reply("Something went wrong!");
				return;
			}
			usersdata = JSON.parse(data); //Grab the userdata
			userdata = usersdata[userToRep] ? usersdata[userToRep] : {}; // Grab the user we care about
			rep = userdata["rep"] ? userdata["rep"] : 0; // Get their rep
			msg.reply("This person has "+String(rep)+" rep.");
		});

	}
*/
	if (msg.content.startsWith(prefix + 'help')) {
		const embed = new Discord.RichEmbed()
		 .setTitle(`Catbot Help`)
		 .setColor(0xc6c6c6)
		 .addField(`General`, `\`ping\`, \`invite\``)
		 .addField(`Fun`, `\`catify\``)
		 .addField(`Util`, `\`serverinfo\``)
		 .addField(`Mod`, `Soon`)
		 .addField(`Dev`, `\`eval\`, \`say\``)
		 .addField(`Work In Progress`, `\`userinfo\``)

		msg.author.send({embed});
	}

});

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

function writeUserData() {
	fs.writeFile(USER_DATA_FILE, JSON.stringify(UserData), err => {
		if (err) { console.error(err) };
	});
}

client.login(process.env.BOT_TOKEN);
