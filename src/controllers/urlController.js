const urlmodels = require("../models/urlModel")
const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid')
const urlModel = require("../models/urlModel")
var request = require("xhr")


const baseUrl = "http://localhost:3000"


const shortUrl = async function (req, res) {
    try {
        let Url = req.body


        /// how to check whether this url is valid or not

        // //console.log(Url.longUrl)
        // //var request = new XMLHttpRequest;

        // request.open('GET', Url.longUrl, true);
        // request.onreadystatechange = function () {
        //     if (request.readyState === 4) {
        //         if (request.status === 404) {
        //             alert("Oh no, it does not exist!");
        //         }
        //     }
        // };
        // request.send();




        let obj = {}

        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).send({ status: false, msg: "Base url is not in valid format" })
        }

        if (!validUrl.isWebUri(baseUrl)) {
            return res.status(401).send({ status: false, msg: "BAse url is not in valid format" })
        }



        if (!validUrl.isUri(Url.longUrl)) {
            return res.status(401).send({ status: false, msg: "Long Url is not valid" })
        }

        if (!validUrl.isWebUri(Url.longUrl)) {
            return res.status(401).send({ status: false, msg: "long url is not in valid format" })
        }


        obj.longUrl = Url.longUrl



        const urlCode = shortid.generate()

        let isUniqueUrlCode = await urlModel.findOne({ urlCode })
        if (isUniqueUrlCode) {
            return res.status(400).send({ status: false, msg: "dulpi url code generated" })
        }

        obj.urlCode = urlCode

        const shortUrl = baseUrl + '/' + urlCode

        obj.shortUrl = shortUrl

        let urlGenerated = await urlModel.create(obj)

        return res.status(200).send({ status: true, msg: "created succesfully", data: urlGenerated })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const shortToLongUrl = async function (req, res) {
    try {

        const url = await urlModel.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {
            // when valid we perform a redirect
            return res.redirect(url.longUrl)
        } else {
            // else return a not found 404 status
            return res.status(404).json('No URL Found')
        }

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.shortUrl = shortUrl
module.exports.shortToLongUrl=shortToLongUrl


