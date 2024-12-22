const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');


const token = '7828550766:AAGP6tnkcBXK7zEBS1k0Iwj1K9bLkgn5diA';
const bot = new TelegramBot(token, { polling: true });

// Handle '/hubstaff' command 
bot.onText(/\/hubstaff (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const subcommand = match[1]?.trim();

    if (!subcommand) {
        bot.sendMessage(chatId, "Please specify a subcommand. Available options:\n- time\n- project\n- report");
        return;
    }

    switch (subcommand.toLowerCase()) {
        case "time":
          
            const dailyTime = (Math.random() * 8).toFixed(2); // Random hours between 0-8
            bot.sendMessage(chatId, `Total tracked time for today: ${dailyTime} hours`);
            break;

        case "project":
        
            const projects = ["Booking WebApp", "Python backend", "Cloud AWS"];
            bot.sendMessage(chatId, `Active projects:\n${projects.join("\n")}\n`);
            break;

        case "report":
            
            const totalHours = (Math.random() * 40).toFixed(2); 
            const topPerformer = `User${Math.floor(Math.random() * 1000)}`; 
            const report = `
📊 *Weekly Report (Simulated)*:
- Total Hours Tracked: ${totalHours} hours
- Active Projects: 3
- Top Performer: ${topPerformer}
            `;
            bot.sendMessage(chatId, report, { parse_mode: "Markdown" });
            break;

        default:
            bot.sendMessage(chatId, "Unknown subcommand. Available options:\n- time\n- project\n- report");
    }
});



// Handle '/start' command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the PV Operations Bot! Need assistance? Simply type /help to see all available commands.');
});

// Handle '/checkin' command
bot.onText(/\/checkin/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const timestamp = moment().format('DD-MM-YYYY HH:mm'); 

    
    console.log(`Check-in by user ${userId} at ${timestamp}`);

    
    bot.sendMessage(chatId, `Check-in successful at ${timestamp}`);
});

// Handle '/checkout' command
bot.onText(/\/checkout/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const timestamp = moment().format('DD-MM-YYYY HH:mm'); 

    
    console.log(`Check-out by user ${userId} at ${timestamp}`);

    
    bot.sendMessage(chatId, `Check-out successful at ${timestamp}`);
});

const userLeaveRequests = {};

// Handle '/leave' command 
bot.onText(/\/leave/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

   
    userLeaveRequests[userId] = {};

    
    bot.sendMessage(chatId, "Please provide the reason for your leave:");
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

   
    if (userLeaveRequests[userId]) {
        const leaveData = userLeaveRequests[userId];

        if (!leaveData.reason) {
      
            leaveData.reason = msg.text;
            bot.sendMessage(chatId, "Got it! Now, please enter the date for your leave (e.g., 20-12-2024):");
        } else if (!leaveData.date) {
           
            leaveData.date = msg.text;

          
            const timestamp = new Date().toLocaleString(); 
            console.log(`Leave request by user ${userId}: Reason: ${leaveData.reason}, Date: ${leaveData.date}, Submitted at: ${timestamp}`);

           
            bot.sendMessage(chatId, `Leave request submitted!\nReason: ${leaveData.reason}\nDate: ${leaveData.date}\nSubmitted at: ${timestamp}`);

            
            delete userLeaveRequests[userId];
        }
    }
});


const userDailyUpdates = {};


bot.onText(/\/dailyupdate/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

   
    userDailyUpdates[userId] = { type: 'dailyupdate' };

    
    bot.sendMessage(chatId, "Please provide your daily update:");
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

 
    if (userDailyUpdates[userId] && userDailyUpdates[userId].type === 'dailyupdate') {
        const dailyUpdate = msg.text;

       
        const timestamp = new Date().toLocaleString(); 
        console.log(`Daily update by user ${userId}: "${dailyUpdate}" at ${timestamp}`);

        
        bot.sendMessage(chatId, `Thank you for your update! Here's what you shared:\n"${dailyUpdate}"\nSubmitted at: ${timestamp}`);

        
        delete userDailyUpdates[userId];
    }
});

// Handle '/help' command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const helpMessage = `
Here are the available commands:

1. /checkin - Record your check-in time.
2. /checkout - Record your check-out time.
3. /leave - Request leave (provides reason and date interactively).
4. /dailyupdate - Submit your daily work update.
5. /hubstaff <subcommand> - Simulated Hubstaff functionality:
   - time: View daily tracked hours.
   - project: View active projects.
   - report: Get a simulated weekly report.
6. /exit - Exit the ongoing interactive command or end the conversation.
7. /help - Display this list of commands.

⚡ Use these commands to interact with the bot effectively!
    `;

    bot.sendMessage(chatId, helpMessage);
});
