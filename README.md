
https://user-images.githubusercontent.com/51274153/118363728-6d275600-b5b3-11eb-8f5b-558a9de93139.mp4

**IPL TEAM PLAYER'S REPORT CARD**<br>
It extract all the information of IPL team player and store it  in JSON file inside their respective team name folder.<h1></h1>


**Introduction:**<br>
      The idea of the project is to create folders of each team and store the JSON file of each player of that team<br>
      and store all the stats of all the matches  that player had played  in his JSON file.<br><br>

**Input:**<br>
    URL : https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results<br><br>

**output:**<br>
    * create a separate folder for each IPL team<br>
    * create a JSON file for each batsman of team<br>
    * store all the stats of batsman of every match he played into their own JSON file.<br><br>

**Tools Required:**<br>
    * node js<br>
    * cheerio (for scrapping)<br><br>

**Installation:**<br>
    * npm install cheerio<br>
    * npm install request<br><br>


**Approach:**<br>
    * load the html of page using request call back function<br>
    * extract the link of stats page<br>
    * load the html of stats page and extract the teams name and create folder<br>
    * find the stats table and find the details of each player and store it in array and create the JSON file of each player's name<br>
      and insert the stats if already exist just insert all the information in the respective player's file.<br>


