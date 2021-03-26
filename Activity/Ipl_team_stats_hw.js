
let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let path=require("path");

let base_url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";

/*
    step 1:get the list of matches and create a folder of all the teams

*/

request(base_url,cb);

function cb(err,resp,html){
    if(err){
        console.log(err);
    }else{
        getListOfMatches(html)
    }
}


function getListOfMatches(html){
    let selTool=cheerio.load(html);

    //get link of scoreboard

    let scoreboardLink=selTool(".row.no-gutters .col-md-8.col-16 .match-cta-container");
    for(let i=0;i<scoreboardLink.length;i++){
        let card=selTool(scoreboardLink[i]).find(".btn.btn-sm.btn-outline-dark.match-cta");
        let link="https://www.espncricinfo.com"+selTool(card[2]).attr("href");
       goToScoreboardPage(link);
    }


}


function goToScoreboardPage(url){
    request(url,cb);
    function cb(err,resp,html){
        if(err){
            console.log(err);
        }else{
            getStatesOfPlayer(html);
        }
    }
}


function getStatesOfPlayer(html){
    let selTool = cheerio.load(html);

    //extracting name of the teams
    let teams=selTool(".match-info.match-info-MATCH .teams .name");
    let teams_name=[];
    for(let i=0;i<teams.length;i++){
        teams_name.push(selTool(teams[i]).text().trim());
    }

    //get the winner team and stats of each batsman
    let winning_team=selTool(".match-info.match-info-MATCH .status-text").text();
    
    
    //creat the folders for team name
    for(let i=0;i<teams_name.length;i++){
        createDir(teams_name[i]);
    }


    //extracting stats of the players
    let batsman_table=selTool(".table.batsman");
    for(let i=0;i<batsman_table.length;i++){
        let player_statsArr=selTool(batsman_table[i]).find("tbody tr");
        for(let j=0;j<player_statsArr.length-1;j++){
            if(j%2==0){
                let data=selTool(player_statsArr[j]).find("td");
                let player_name=selTool(data[0]).text().trim();
                //console.log(player_name);
                createFile(player_name,teams_name[i]);
                let match=teams_name[0]+" vs "+teams_name[1];
                let player_run=selTool(data[2]).text().trim();
                let balls_played=selTool(data[3]).text().trim();
                let no_of_four=selTool(data[5]).text().trim();
                let no_of_sixes=selTool(data[6]).text().trim();
                let strike_rate=selTool(data[7]).text().trim();

                putStatsInJson(teams_name[i],match,player_name,player_run,balls_played,no_of_four,no_of_sixes,strike_rate,winning_team);

            }
        }
    }
}




function putStatsInJson(team_name,match,player_name,player_run,balls_played,four,six,strike_rate,winning_status){
    let PlayerStatsJsonArr=[];
    PlayerStatsJsonArr.push({
        match:match,
        player_name:player_name,
        Total_run:player_run,
        Total_balls_played:balls_played,
        Total_four:four,
        Total_six:six,
        Strike_rate:strike_rate,
        staus:winning_status
    });
    let file_path=path.join(__dirname,team_name,player_name+".json");
    fs.writeFileSync(file_path,JSON.stringify(PlayerStatsJsonArr));

}
//to create a folder
function createDir(topic_name){
    let folder_path=path.join(__dirname,topic_name);
    if(fs.existsSync(folder_path)==false){
        fs.mkdirSync(folder_path);
    }
}


//to create a file
function createFile(file_name,topic_name){
    let path_of_file=path.join(__dirname,topic_name,file_name+".json");
    if(fs.existsSync(path_of_file)==false){
        let createStream = fs.createWriteStream(path_of_file);
        createStream.end();
    }
}