const request = require('request-promise-native');
const cheerio = require('cheerio');
const _ = require('lodash');

async function getKeywordList() {
    try {
        console.log('실시간 검색어 수집중 ...');
        console.log('-----------------------');
        const linkTable = [];
        const body = await request(requestOptions = {
            method: 'GET'
            , uri: 'http://www.naver.com/'
            , headers: { 'User-Agent': 'Mozilla/5.0' }
        },);
        const $ = cheerio.load(body)
        const postElements = $('#PM_ID_ct > div.header > div.section_navbar > div.area_hotkeyword.PM_CL_realtimeKeyword_base > div.ah_list.PM_CL_realtimeKeyword_list_base > ul > li');
        postElements.each(function () {
            const linkData = {};
            linkData.num = $(this).find('a').find($('.ah_r')).text();
            linkData.text = $(this).find('a').find($('.ah_k')).text();
            linkData.link = $(this).find('a').attr('href');
            linkTable.push(linkData);
        })

        console.log('실시간 검색어 수집 완료.');
        console.log('-----------------------');

        return linkTable
    }
    catch(error) {
        throw error
    }
}

async function getRelatedKeywordList(keywordList) {
    try {
        console.log('연관 검색어 수집중 ...');
        console.log('-----------------------');
        return await Promise.all(_.map(keywordList, async (keyword) => {
            const body = await request({
                method: 'GET'
                , uri: keyword.link
                , headers: {
                    'accept': ' */*',
                    'accept-language': ' ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36',
                }
            });
            const $ = cheerio.load(body);
            const postElements = $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li');

            const relatedKeywords = [];
            postElements.each(function () {
                    relatedKeywords.push($(this).find('a').text());
            });
            keyword.relatedKeywords = relatedKeywords;
            return keyword;
        }))
    }
    catch (error) {
        throw error
    }
}

async function key() {
    console.log('-----------------------');
    console.log('실시간 검색어의 연관 검색어 추출 실행.');
    console.log('-----------------------');

    const keywordList = await getKeywordList();
    const keywordListWithRelatedKeywords = _.slice(await getRelatedKeywordList(keywordList), 0, 10);

    keywordListWithRelatedKeywords.forEach((keyword) => {
        console.log('-----------------------');
        console.log(keyword.num + '위 : ' + keyword.text);
        console.log('연관검색어 : ');
        keyword.relatedKeywords.forEach(function (relatedKeyword) {
            console.log(relatedKeyword);
        });
        console.log('-----------------------');
    });
}

key();