// const urlmodels = require("../models/urlModel")
const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid')
const urlModel = require("../models/urlModel")

const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    18766,
    "redis-18766.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("4PY4EGEZmFhxnMTvY8iGfmSbWSu45ExK", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});


//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);





const baseUrl = "http://localhost:3000"


const shortUrl = async function (req, res) {
    try {
        let url = req.body      // take data from the body

        if (Object.keys(url).length === 0) {               //checking whether data is missing from body
            return res.status(400).send({ status: false, msg: "Body is missing" })
        }

        let { longUrl } = url

        let obj = {}


        if (!validUrl.isWebUri(baseUrl)) {
            return res.status(400).send({ status: false, msg: "Base url is not in valid format" })
        }


        if (!validUrl.isWebUri(longUrl)) {
            return res.status(400).send({ status: false, msg: "long url is not in valid format" })
        }



        obj.longUrl = longUrl

        let cahcedProfileData = await GET_ASYNC(`${req.body.longUrl}`)
        cahcedProfileData = JSON.parse(cahcedProfileData)
        if (cahcedProfileData) {
            return res.status(202).send({ msg: "short url already exist for this long URl", urlCode: cahcedProfileData.urlCode, shortUrl: cahcedProfileData.shortUrl })  // iskop
        } else {
            // let profile = await urlModel.findOne({ longUrl });
            // if (!profile) {
            // ?await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(profile))
            const urlCode = shortid.generate().trim().toLowerCase()


            let isUniqueUrlCode = await urlModel.findOne({ urlCode })
            if (isUniqueUrlCode) {
                return res.status(400).send({ status: false, msg: "dulpi url code generated" })
            }

            obj.urlCode = urlCode

            const shortUrl = baseUrl + '/' + urlCode

            obj.shortUrl = shortUrl

            let urlGenerated = await urlModel.create(obj)
            await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(urlGenerated))
            return res.status(200).send({ data: urlGenerated });


            // }
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



const shortToLongUrl = async function (req, res) {
    try {

        let urlCode = req.params.urlCode
        let cahcedProfileData = await GET_ASYNC(`${req.params.urlCode}`)
        let data = JSON.parse(cahcedProfileData)

        if (cahcedProfileData) {
            return res.redirect(data.longUrl)
        } else {
            let profile = await urlModel.findOne({ urlCode });
            // console.log(profile)
            if (profile) {
                await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(profile))
                return res.redirect(profile.longUrl);
            } else {
                return res.status(404).json('No URL Found')
            }


        }

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.shortUrl = shortUrl
module.exports.shortToLongUrl = shortToLongUrl


