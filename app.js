var request = require('request');
var cheerio = require('cheerio');

function key() {
    console.log('-----------------------');
    console.log('실시간 검색어의 연관 검색어 추출 실행.');
    console.log('-----------------------');
    return new Promise((resolve, reject) => {
        console.log('실시간 검색어 수집중 ...');
        console.log('-----------------------');
        const linkTable = [];
        request(requestOptions = {
            method: 'GET'
            , uri: 'http://www.naver.com/'
            , headers: { 'User-Agent': 'Mozilla/5.0' }
        },
            function (error, response, body) {
                if (error) {
                    rejected(0);
                }
                var $ = cheerio.load(body);
                var postElements = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul > li');

                postElements.each(
                    function () {
                        var linkData = new Object();
                        linkData.num = $(this).find('a').find($('.ah_r')).text();
                        linkData.text = $(this).find('a').find($('.ah_k')).text();
                        linkData.link = $(this).find('a').attr('href');
                        linkTable.push(linkData);
                    }
                );
                console.log('실시간 검색어 수집 완료.');
                console.log('-----------------------');
                resolve(linkTable);
            });
    }).then(linkTable => {
        var promiseArray = [];
        console.log('연관 검색어 수집중 ...');
        console.log('-----------------------');
        linkTable.forEach(
            function (value) {
                promiseArray.push(new Promise(function (resolve, reject) {
                    request(requestOptions = {
                        method: 'GET'
                        , uri: value.link
                        , headers: {
                            'accept': ' */*',
                            'accept-language': ' ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36',
                        }
                    },
                        function (error, response, body) {
                            if (error) {
                                throw error;
                            }
                            var $ = cheerio.load(body);
                            var postElements = $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li');

                            var related_keyword = [];
                            postElements.each(
                                function () {
                                    related_keyword.push($(this).find('a').text());
                                }
                            );
                            value.related_keyword = related_keyword;
                            resolve(true);
                        });
                }));
            }
        );
        Promise.all(promiseArray).then(function (values) {
            linkTable.forEach(
                function (value) {
                    if (value.num === '11') {
                        console.log('프로그램 종료.')
                        process.exit();
                    }
                    console.log('-----------------------');
                    console.log(value.num + '위 : ' + value.text);
                    console.log('연관검색어 : ');
                    value.related_keyword.forEach(function (keyword) {
                        console.log(keyword);
                    });
                    console.log('-----------------------');
                }
            )
        });
    })
}

key();