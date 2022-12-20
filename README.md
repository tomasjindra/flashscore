## Features
The results of your favourite leagues, teams or players are at your fingertips. Get all match results including the most important statistics from 30+ sports such as ⚽️ Soccer, 🎾 Tennis, 🏀 Basketball, 🏒 Ice hockey, 🏈 American football, ⚾️ Baseball and more using the API created from https://www.flashscore.com/. 

## Input parameters
- **inputURL** - The list of input URLs to be used. It can be URL for a specific team, player or league (e.g. for Premier League: https://www.flashscore.com/en/soccer/england/premier-league/#/nunhS7Vn/table/overall 

## Cost of usage
You can get a bit more than 1 000 results for 1 USD.

## How to use the actor?

1.) On flashscore.com choose a league / team / player which you would like to scrape and copy the URL from your browser.

![](/assets/images/intro_step1.png "Intro step 1")

2.) Paste the URL you have just copied to the Input URLs field in the Flashscore actor under "Input" tab  

![](/assets/images/intro_step2.png "Intro step 2")

3.) Hit green ✅ start button and enjoy your data!

![](/assets/images/intro_step3.png "Intro step 3")


## Input example
```json
{
    "inputURL": [
        {
            "url": "https://www.flashscore.com/en/soccer/england/premier-league/#/nunhS7Vn/table/overall"
        }
    ]
}
```

## Output
You can download the dataset with your results in various formats such as JSON, HTML, CSV, or Excel.

**Example of data to be collected:**
![](/assets/images/output_example.png "Output example")


## Match details in JSON Format

```json
{
"URL": "https://www.flashscore.com/en/match/rBfk6fO7/#/match-summary/match-summary",
"sport": "Soccer",
"region": "WORLD",
"league": "World Cup - Play Offs - Final",
"matchTime": "18.12.2022 15:00",
"matchState": "After Penalties",
"homeTeamName": "Argentina",
"awayTeamName": "France",
"homeTeamScore": "4",
"awayTeamScore": "3",
"Ball Possession": {
"homeTeamValue": "54%",
"awayTeamValue": "46%"
},
"Goal Attempts": {
"homeTeamValue": "21",
"awayTeamValue": "10"
},
"Shots on Goal": {
"homeTeamValue": "9",
"awayTeamValue": "5"
},
"Shots off Goal": {
"homeTeamValue": "9",
"awayTeamValue": "3"
},
"Blocked Shots": {
"homeTeamValue": "3",
"awayTeamValue": "2"
},
"Free Kicks": {
"homeTeamValue": "22",
"awayTeamValue": "28"
},
"Corner Kicks": {
"homeTeamValue": "6",
"awayTeamValue": "5"
},
"Offsides": {
"homeTeamValue": "4",
"awayTeamValue": "4"
},
"Throw-in": {
"homeTeamValue": "25",
"awayTeamValue": "22"
},
"Goalkeeper Saves": {
"homeTeamValue": "2",
"awayTeamValue": "6"
},
"Fouls": {
"homeTeamValue": "26",
"awayTeamValue": "19"
},
"Yellow Cards": {
"homeTeamValue": "4",
"awayTeamValue": "3"
},
"Total Passes": {
"homeTeamValue": "648",
"awayTeamValue": "516"
},
"Completed Passes": {
"homeTeamValue": "544",
"awayTeamValue": "419"
},
"Tackles": {
"homeTeamValue": "23",
"awayTeamValue": "26"
},
"Attacks": {
"homeTeamValue": "81",
"awayTeamValue": "113"
},
"Dangerous Attacks": {
"homeTeamValue": "42",
"awayTeamValue": "31"
}
},

```