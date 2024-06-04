import AWS from "aws-sdk";
import fs from "fs";
import { apiName } from "../constants";

const apiGateway = new AWS.APIGateway({region: "eu-west-1"});

apiGateway.getRestApis({}, (err, data) => {
    if(err) {
        console.error(err);
    } else {
        const api = data.items?.find(item => item.name === apiName);
        
        if (api) {
            fs.appendFileSync(".env", `\nAPI_GATEWAY_ID=${api.id}`);
        };
    };
});
