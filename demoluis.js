var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.1a1a7346-1134-463b-8bf9-3f6da439502f,
    appPassword: process.env.HS67HtHquSpeVs03buwAYbU
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
var bot = new builder.UniversalBot(connector, [

    function (session) {
        session.send("Welcome to HP Support Assistant.");
session.beginDialog('askForIssue');
        
    },
function (session, results) {
        session.beginDialog('idPrompt');
session.dialogData.idNumber = results.response;
        
    },
]);

// Dialog to ask issue
bot.dialog('askForIssue', [
//
function (session, results) {
        session.beginDialog('idPrompt');
// luis intents
    },
function (session) {
        builder.Prompts.text(session, "How may I help you");
},
function (session, results) {
        session.endDialogWithResult(results);
// luis intents
    }
]);
// Add global LUIS recognizer to bot
var luisAppUrl = process.env.LUIS_APP_URL || ' https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/3943bc06-af01-4a2f-a595-6e22d4a0971a?subscription-key=86918a40e4be44a5bf71f2e2e61deb53&timezoneOffset=0&verbose=true&q=';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

bot.dialog('noboot', [
function (session) {
builder.Prompts.text(session, "You have a no boot issue");
   
},
    
]).triggerAction({ 
    matches: 'No.Boot'
});
bot.dialog('idPrompt', [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, "Enter the number using a format of six digits")
        } else {
            builder.Prompts.text(session, "Can I have your id  number?");
        }
    },
    function (session, results) {
        var matched = results.response.match(/^\d{6}/);
        var number = matched ? matched.join('') : '';
        if (number.length == 6) {
            session.idNumber = number; // Save the number.
            session.endDialogWithResult({ response: number });
        } else {
            // Repeat the dialog
            session.replaceDialog('idPrompt', { reprompt: true });
        }
    }
]);
