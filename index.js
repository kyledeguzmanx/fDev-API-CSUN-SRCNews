const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
 const PORT = 8000;

request("https://www.csun.edu/src/news/", (error, response, html) =>{
  if(!error && response.statusCode == 200){
    
    const $ = cheerio.load(html);
    const newsfeed = $(".view-content");
    //console.log(newsfeed.html());
    let titles = [];
    let dates = [];
    let description = [];

    $(".view-content .views-row article h2").each((i,el) =>{
      const item = $(el).text();

      titles.push(item);
    })
    $(".view-content .views-row article p.field-type-datetime").each((i,el) =>{
      const item = $(el).text().trim();

      dates.push(item);
    })
    $(".view-content .views-row article .field-type-text-long p").each((i,el) =>{
      const item = $(el).text();

      description.push(item);
    })
    
    let returnObj = [];
    for(var i = 0; i < titles.length; i++){
        returnObj.push({
          title: titles[i],
          date: dates[i],
          details: description[i]
        })
    }

    console.log(returnObj);

    app.get("/", (req,res) => {
             res.json(returnObj);
         })

        app.listen(PORT, () => console.log(`server running on ${PORT}`)); //starts server and listens on port 8000
  }
  else{
    console.log("error")
  }
})
