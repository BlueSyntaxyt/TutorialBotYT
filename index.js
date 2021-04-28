const Discord = require("discord.js");
const bot = new Discord.Client();

const data = require("./data.json")

const TOKEN = data.TOKEN;

bot.login(TOKEN);

const mongoose = require("mongoose");

const fs = require("fs");

const MessageH = require("./messages.json");
typeof MessageH;

var prefixes = "!";

var customPrefix = "++";


const prefixData = require("./data/p");

var prefix = prefixes[0];


mongoose.connect(data.SCHEMA_KEY);

bot.on("ready", () => {
  bot.user.setActivity("Uh, yeah.");
});

const leaderboardData = require("./data/leaderboardData");

//#region 
//bot.on("message", function(message){});
bot.on("message", function(message) {
  if(message.channel.type == "dm") return;
  if(message.author.bot) return;
  prefixData.findOne({
    ID: message.channel.guild.id,
  }, (err, data) => {
    if(err) return console.log(err);
    if(data) {
      prefixes = data.Prefixes;
    } else {
      prefixes = "!";
    }
  })
});
bot.on("message", function (message) {
  if(message.channel.type == "dm") return;
  if(message.author.bot) return;
  if (message.content.startsWith(prefix + "prefix")) {
    const filter = m => m.content.includes('');
    prefixData.findOne({
      ID: message.channel.guild.id,
    }, (err, data) => {
      if(err) return console.log(err);
      if(data) {
        message.channel.send("Awaiting a new prefix").then(message.channel.awaitMessages(filter, {max: 1, time: 1500, errors: ["Time"]}).then(collected => {message.channel.send("Changed prefix to " + collected).then(() => {data.Prefixes = collected; data.save();})}).catch(collected => {message.channel.send("Looks like no one answered");}));
      } else {
        message.channel.send("Awaiting a new prefix").then(message.channel.awaitMessages(filter, {max: 1, time: 1500, errors: ["Time"]}).then(collected => {message.channel.send("Changed prefix to " + collected).then(() => {const d = new prefixData({Prefixes: collected, ID: message.channel.guild.id}); d.save();})}).catch(collected => {message.channel.send("Looks like no one answered");}));
      }
    })
  }
});

//NO

bot.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith(prefix + "pingpong")) {
    msg.channel.send(msg.content);
  }
});

//NO

bot.on("message", (message) => {
  const quotes = require("./Quotes.json");

  if(message.author.bot) return;

  if(message.content.startsWith(prefix + "quote")) {

    var num = Math.floor(Math.random()*quotes.Quotes.length);

    let embed = new Discord.MessageEmbed()
    .setDescription(quotes.Quotes[num].q + "\n- " + quotes.Quotes[num].a)
    .setColor("RANDOM")

    message.channel.send(embed)
  };
});

bot.on("message", function (message) {
  var PlayerMute;
  try {
    PlayerMute = message.mentions.members.first();
  } catch (err) {
    console.log(err);
  }
  if (!PlayerMute) return;
  let MuteE = new Discord.MessageEmbed().addField(
    "Name:",
    PlayerMute + "was muted"
  );
  let UMuteE = new Discord.MessageEmbed().addField(
    "Name:",
    PlayerMute + "was unmuted"
  );
  if (message.author.bot) {
    return;
  }
  if (message.content.includes("&mute")) {
    PlayerMute.roles.add("696605344125812816");
    message.channel.send(MuteE);
  }
  if (message.content.includes("&unmute")) {
    PlayerMute.roles.remove("696605344125812816");
    message.channel.send(UMuteE);
  }
});
bot.on("message", function (message) {
  if (message.content.includes("&vote2")) {
    message.react("1️⃣");
    message.react("2️⃣");
  }
});
bot.on("message", function (message) {
  const args = message.content.split(" ").slice(1);
  var DeleteCount = parseInt(args[0], 10);
  if (message.content.includes("&purge")) {
    if (message.member.hasPermission(["MANAGE_MESSAGES"])) {
      if (!DeleteCount) {
        message.channel.send("Please use a valid number!");
        message.delete();
      } else {
        message.channel.bulkDelete(DeleteCount + 1);
        message.channel.send("Succesfully deleted " + DeleteCount);
      }
    }
  }
});
bot.on("message", function (message) {
  var User = message.author.id;
  if (message.author.bot) {
    return;
  }
  if (!MessageH[User]) {
    MessageH[User] = {
      messages: 0,
    };
    MessageH[User].messages++;
  } else {
    MessageH[User].messages++;
  }
  fs.writeFileSync("./messages.json", JSON.stringify(MessageH));
  if (MessageH[User].messages >= 10) {
    message.member.roles.add("696600027333656641");
  }
});
bot.on("message", function (message) {
  var PlayerM = message.mentions.members.first();
  if (!PlayerM) {
    return;
  }
  if (message.author.bot) {
    return;
  }
  if (message.content.includes("&kick")) {
    PlayerM.kick().then(message.channel.send(PlayerM + " was kicked"));
  }
});
bot.on("message", function (message) {
  var PlayerM = message.mentions.members.first();
  var res = message.content.split(" ").slice(1).join(" ");
  if (!PlayerM) {
    return;
  }
  if (message.author.bot) {
    return;
  }
  if (message.content.includes("&ban")) {
    PlayerM.ban({
      reason: res,
    }).then(message.channel.send(PlayerM + " was banned, reason" + res));
  }
});
bot.on("message", function (message) {
  var Member = message.mentions.users.first() || message.author;
  let MEEmbed = new Discord.MessageEmbed()
    .setTitle("Your profile!")
    .addField("Status: ", "" + message.author.presence.status)
    .setDescription("ID: " + message.author.id)
    .addField("Username: ", message.author.username + "")
    .addField("Discriminator: ", "" + message.author.discriminator)
    .setColor("#00ff44")
    .setFooter("Support");
  let WhoEmbed = new Discord.MessageEmbed()
    .setTitle("Your profile!")
    .addField("Status: ", "" + Member.presence.status)
    .setDescription("ID: " + Member.id)
    .addField("Username: ", Member.username + "")
    .addField("Discriminator: ", "" + Member.discriminator)
    .setColor("#00ff44")
    .setFooter("Support");
  if (message.content == "&me") {
    message.channel.send(MEEmbed);
    return;
  } else {
    if (message.content.includes("&whois")) {
      message.channel.send(WhoEmbed);
      return;
    } else {
      return;
    }
  }
});
bot.on("message", (message) => {
  var arg = message.content.split(" ").slice(1).join(" ");
  if (!arg) {
    return;
  }
  let e = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(arg)
    .setColor("RANDOM");
  if (message.content.includes("&say")) {
    message.channel.send(e);
  }
});
bot.on("message", (message) => {
  if (message.channel.type == "dm") return;
  if (message.content.startsWith(prefix + "temp")) {
    const args = message.content.split(" ");
    if (!args[2]) return message.channel.send("Sorry, but I need a number");
    if (parseFloat(args[2]).isNaN)
      return message.channel.send("Sorry, that is not a number");
    var PlayerMute = message.mentions.members.first();
    if (!PlayerMute) return message.channel.send("You need to ping someone");
    let MuteE = new Discord.MessageEmbed().addField(
      "Name:",
      PlayerMute + "was muted for" + args[2]
    );
    PlayerMute.roles.add("696605344125812816");
    message.channel.send(MuteE);
    setTimeout(() => {
      PlayerMute.roles.remove("696605344125812816");
      PlayerMute.user.send("You have been unmuted in " + message.guild.name);
    }, args[2] * 1000);
  }
});

//#endregion


/*
leaderboardData.findOne({
  ID: "00100",
}, (err, data) => {
  if(err) return;
  if(data == null) {
    var namesArray = [message.author.username, "Bot_1", "Bot_2", "Bot_3", "Bot_4"];
    var valuesArray = [1, 2, 5, 6, 7];

    var namesString = JSON.stringify(namesArray);
    var valuesString = JSON.stringify(valuesArray);

    const newSchema = new leaderboardData({
      ID: "00100",
      names: namesString,
      values: valuesString,
    });
    newSchema.save();
  } else {
    Array_names = JSON.parse(data.names);
    Array_values = JSON.parse(data.values);

    for (let index = 0; index < Array_names.length; index++) {
      const element = Array_names[index];
      
      if(element == message.author.username) {
        Array_values[index]++; //+ amount
      }

    }

    data.values = JSON.stringify(Array_values);

    data.save();

  }
})
*/


bot.on("message", (message) => {

  if(message.author.bot) return;

  if(message.content != "%leader") return;



  async function getLeaderboard() {
    var replyString = "";
    await leaderboardData.findOne({
      ID: "00100"
    }, (err, data) => {
      if(err) return console.log(err);
      if(data == null) {
  
        var namesArray = [message.author.username, "Bot_1", "Bot_2", "Bot_3", "Bot_4"];
        var valuesArray = [1, 2, 5, 6, 7];

        var namesString = JSON.stringify(namesArray);
        var valuesString = JSON.stringify(valuesArray);
  
        const newSchema = new leaderboardData({
          ID: "00100",
          names: namesString,
          values: valuesString,
        });
        newSchema.save();

        message.reply("The command hasn't been used before. It was now created.");
      } else {
        var Array_names = [];
        var Array_values = [];

        Array_names = JSON.parse(data.names);
        Array_values = JSON.parse(data.values);

        var first_num = Math.max(...Array_values);
        
        for (let index = 0; index < Array_values.length; index++) {
          const element = Array_values[index];
          if(element == first_num) {
            console.log(element)
            replyString += element + " - " + Array_names[index] + "\n";

            Array_values.splice(index, 1);
            Array_names.splice(index, 1);

            break;
          }
        }
        first_num = Math.max(...Array_values);
        for (let index = 0; index < Array_values.length; index++) {
          const element = Array_values[index];
          if(element == first_num) {
            replyString += element + " - " + Array_names[index] + "\n";

            Array_values.splice(index, 1);
            Array_names.splice(index, 1);

            break;
          }
        }
        first_num = Math.max(...Array_values);
        for (let index = 0; index < Array_values.length; index++) {
          const element = Array_values[index];
          if(element == first_num) {
            replyString += element + " - " + Array_names[index] + "\n";

            Array_values.splice(index, 1);
            Array_names.splice(index, 1);

            break;
          }
        }

      }
    })
    message.channel.send(replyString);
  }

  getLeaderboard()
  
})

//
const randompuppy = require("random-puppy");
bot.on("message", async (message) => {
  if(message.content.startsWith("?reddit")) {
    var args = message.content.split(" ");

    if(!args[1]) return message.channel.send("You need a second argument");


    try {
      const img = await randompuppy(args[1]);

      let embed = new Discord.MessageEmbed().setImage(img).setTitle("r/" + args[1]);

      message.channel.send(embed);
    } catch (error) {
      console.log(error);
      return message.channel.send("Something went wrong...")
    }

  }
})
//