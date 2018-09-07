var request = require("request");
var cheerio = require("cheerio");
var requestOptions = {
    method: "GET"
    , uri: "http://www.naver.com/"
    , headers: { "User-Agent": "Mozilla/5.0" }
    , encoding: null
};

function key() {

    console.log('1. 소스코드 시작하였습니다.');

    return new Promise((resolve, reject) => {
        console.log('p1 실행 시작.');
        const linkTable = [];
        request(requestOptions,
            function (error, response, body) {
                if (error) {
                    rejected(0);
                }
                var $ = cheerio.load(body);
                var postElements = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul > li');

                postElements.each(
                    function () {
                        var linkData = new Object();
                        linkData.num = $(this).find("a").find($(".ah_r")).text();
                        linkData.text = $(this).find("a").find($(".ah_k")).text();
                        linkData.link = $(this).find("a").attr("href");
                        linkTable.push(linkData);
                    }
                );
                console.log('p1 실행 종료.');
                resolve(linkTable);
            });
    }).then(linkTable => {
        linkTable.forEach(
            function (value) {
                request(requestOptions = {
                    method: "GET"
                    , uri: value.link
                    , headers: {
                        'accept': ' */*',
                        'accept-language': ' ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36',
                    }
                    , encoding: null
                },
                    function (error, response, body) {
                        if (error) {
                            throw error;
                        }
                        var $ = cheerio.load(body);
                        var postElements = $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li');
                        console.log("-----------------------");
                        console.log(value.num + "위 : " + value.text);
                        console.log("연관검색어 : ");
                        postElements.each(
                            function () {
                                var related_keyword = $(this).find("a").text();
                                
                                
                                console.log(related_keyword);
                                
                                
                            }
                        );
                        console.log("-----------------------");
                    });
            }
        );
        console.log('p2 실행 종료.');
    })
    console.log('2. 소스코드 끝났습니다.');
}


key();