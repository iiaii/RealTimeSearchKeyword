// var request = require('request');
// var cheerio = require('cheerio');

// request({
//     url: 'https://www.naver.com/',
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36'
//     }
// }, function(err, res, html) {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     var $ = cheerio.load(html);
//     var liList = $('#list_prod_1').children('ul').children('li');
//     for (var i = 0; i < liList.length; i++) {
//         // productId를 가져오기 위함.
//         var split = $(liList[i]).find('.pr_price .t_roman > span').attr('id').split('_');
//         if (split.length < 2) {
//             continue;
//         }
//         var productId = split[1];
//         var price = $(liList[i]).find('#ItemCurrSalePrc_' + productId).text();
//         price = price.replace(/,/gi, "");
//         var title = $(liList[i]).find('#prodNm_' + productId).val();
//         console.log(productId + ':' + title + '(' + price + ')');
//     }
// });


// const express = require('express');
// const router = express.Router();
 
// const cheerio = require('cheerio');
// const request = require('request');
 
// //https://search.naver.com/search.naver?where=nexearch&sm=tab_lve&ie=utf8&query=
// router.get("/crawlingTest", function(req, res, next){
//     let url = "http://www.naver.com/";
 
//     request(url, function(error, response, body){
//         let resultArr = [];
 
//         const $ = cheerio.load(body);
//         let colArr = $(".ah_k")
//         for(let i = 0; i < colArr.length; i++){
//             resultArr.push(colArr[i].children[1].attribs.title)
//         }
 
//         res.json(resultArr)
//         console.log("sadf");
//     });
// })

// module.exports = router;






//-------------------------
// var http = require('http');
// var express = require('express');
// var app = express();
// var fs = require('fs');
// var request = require('request');
// var cheerio = require('cheerio');
// var Iconv = require('iconv').Iconv;

// app.get('/list1', function(req, res) {
//     request({ url: 'http://www.naver.com/', encoding: 'binary' }, function (error, response, body) {
//         if (!error) {
//             var convertedCon = new Buffer(body, 'binary')
//             iconv = new Iconv("euc-kr", 'UTF-8')
//             convertedCon = iconv.convert(convertedCon).toString()
//             var $ = cheerio.load(convertedCon);
//             linkTable = new Array();
//             $('td.table_td2 > a').each(function (index) {
//                 linkData = new Object();
//                 linkData.title = $(this).attr("title");
//                 linkData.link = "http://www.naver.com" + $(this).attr("href");
//                 linkTable.push(linkData);
//             });
//             res.send(linkTable);
//         }
//     });
// });

// var port = process.env.port || 3000;
// app.listen(port, function() {
//     console.log("listenging on "+ port);
// });





// router.get('/RealTimeSearchKeyword',function(req,res,next){
//     async function Related_keyword(){
//         let first = await RealTime_keyword(req.query.id);
//         console.og("여기2",first);
//     }
//     let result = Related_keyword();
//     console.log(result);
//     res.send("a");
// });

// var RealTime_keyword = function(data){
//     return new Promise(function(resolved, rejected){
//         setTimeout(function(){
//             request(url,
//                 function(error, response, body) {
//                 if(error) {
//                     rejected(0);
//                 } 
//                 var $ = cheerio.load(body);
//                 var postElements = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul > li');
        
//                 postElements.each(
//                     function() {
//                         var linkData = new Object();
//                         linkData.num = $(this).find("a").find($(".ah_r")).text();
//                         linkData.text = $(this).find("a").find($(".ah_k")).text();
//                         linkData.link = $(this).find("a").attr("href");
//                         // console.log("-----------------------");
//                         // console.log(linkData.num +"위 :"+ linkData.text);
//                         // console.log("연관검색어 : ");
//                         // console.log("-----------------------");
//                         linkTable.push(linkData);
//                     }
//                 );
//                 resolved(1);
//             });
//         })
//     })
// }
var request = require("request");
var cheerio = require("cheerio");
var url = "http://www.naver.com/";
var express = require('express');
var router = express();
    
(function() {
				
    console.log('1. 소스코드 시작하였습니다.');
    
    new Promise((resolve, reject) => {
            console.log('p1 실행 시작.');
            const linkTable = [];
            setTimeout(() => {
                request(url,
                    function(error, response, body) {
                    if(error) {
                        rejected(0);
                    } 
                    var $ = cheerio.load(body);
                    var postElements = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul > li');
                
                    postElements.each(
                        function() {
                            var linkData = new Object();
                            linkData.num = $(this).find("a").find($(".ah_r")).text();
                            linkData.text = $(this).find("a").find($(".ah_k")).text();
                            linkData.link = $(this).find("a").attr("href");
                            console.log("-----------------------");
                            console.log(linkData.num +"위 : "+ linkData.text);
                            console.log("연관검색어 : ");
                            
                            console.log("-----------------------");
                            linkTable.push(linkData);

                        }
                    );
                });
                console.log('p1 실행 종료.');
        }, 2000);
        return linkTable;
    }).then(linkTable => {
        setTimeout(() => {
            console.log('linkTable', linkTable);
            linkTable.forEach(
                function(value) {
                    request(value.linkData.link,
                        function(error, response, body) {
                            
                            if(error) {
                                throw error;
                            }
                            var $ = cheerio.load(body);
                            var postElements = $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li > a');
                            postElements.each(
                                function() {
                                    var related_keyword = $(this).text();
                                    
                                    console.log(related_keyword);
                                }
                            );
                            resolve();
                        });
                }
            );
            
            console.log('p2 실행 종료.');
        }, 2000);
    })
    
    console.log('2. 소스코드 끝났습니다.');
    
})();





    