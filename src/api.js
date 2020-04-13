const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const request = require('request');
const cheerio = require("cheerio");
const serverless = require('serverless-http');

const router = express.Router();

router.get('/', cors(), (req, res) =>

    request("https://www.worldometers.info/coronavirus/", function (error, response, body) {
        if (error) {
            res.send(response.statusCode);
        }
        var country = [];
        var $ = cheerio.load(body);
        $('#main_table_countries_today>tbody>tr').not('tr[style="display: none"]').each(function (index, element) {
            country[index] = {};
            country[index]['country'] = $(element).find('td:nth-child(1)').text().trim();
            country[index]['totalCases'] = $(element).find('td:nth-child(2)').text().trim().replace(/[+,]/g, '') * 1;
            country[index]['newCases'] = $(element).find('td:nth-child(3)').text().trim().replace(/[+,]/g, '') * 1;
            country[index]['totalDeaths'] = $(element).find('td:nth-child(4)').text().trim().replace(/[+,]/g, '') * 1;
            country[index]['newDeath'] = $(element).find('td:nth-child(5)').text().trim().replace(/[+,]/g, '') * 1;
            country[index]['totalRecovered'] = $(element).find('td:nth-child(6)').text().trim().replace(/[+,]/g, '') * 1;
            country[index]['activeCases'] = $(element).find('td:nth-child(7)').text().trim().replace(/[+,]/g, '') * 1;
            country[index]['seriousCases'] = $(element).find('td:nth-child(8)').text().trim().replace(/[+,]/g, '') * 1;
            country[index]['totalCasesperOneMillionPopulation'] = $(element).find('td:nth-child(9)').text().trim().replace(/[+,]/g, '') * 1;
        });

        res.json(country);
    })
)

app.use('/.netlify/functions/api', router)
module.exports.handler = serverless(app);


