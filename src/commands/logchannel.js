const util = require('../util.js');

const command = {};

command.description = 'Specify the log channel';

command.usage = '<#channel|channelId|off>';

command.names = ['logchannel'];

command.execute = async (message, args, database, bot) => {
  //Permission check
  if (!message.member.hasPermission('MANAGE_GUILD')) {
    message.channel.send('You need the "Manage Server" permission to use this command.');
    return;
  }

  if (['off','disabled'].includes(args[0].toLowerCase())) {
    let config = await util.getGuildConfig(message);
    delete config.logChannel;
    await util.saveGuildConfig(config);
    await message.channel.send(`Disabled log!`);
    return;
  }

  //Get channel
  let channelId = util.channelMentionToId(args.shift());
  if (!message.guild.channels.resolve(channelId)) {
    await message.channel.send(await util.usage(message,command.names[0]));
    return;
  }

  if (!message.guild.channels.resolve(channelId).permissionsFor(bot.user).has(['VIEW_CHANNEL','SEND_MESSAGES'])) {
    await message.channel.send("The bot is doesn't have the permission to send messages in this channel!")
    return;
  }

  let config = await util.getGuildConfig(message);
  config.logChannel = channelId;
  await util.saveGuildConfig(config);
  await message.channel.send(`Set log channel to <#${channelId}>!`);
};

module.exports = command;
