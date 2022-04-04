const express = require('express');
const router = express.Router();

const urlController = require("../controllers/urlController")


router.get("/test-me", function(req, res){
    return res.status(400).send({status:true, msg:"working"})
})


router.post("/url/shorten"  , urlController.shortUrl)

router.get("/:urlCode", urlController.shortToLongUrl)



module.exports=router