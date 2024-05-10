import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent } from "aws-lambda";
import { BUCKET, TYPE_CSV } from "../../constants";
import { generateHttpResponse } from "../../utils/lambda";
import { StatusCode } from "../../types/http";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client();

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
    const fileName = event.queryStringParameters?.name;

    if (!fileName) {
        return generateHttpResponse(StatusCode.BAD_REQUEST, { message: "Filename parameter is empty" });
    };

    const filePath = `uploaded/${fileName}`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: filePath,
        ContentType: TYPE_CSV,
    });

    try {
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return generateHttpResponse(StatusCode.OK, url);
    } catch (err) {
        if (err instanceof Error) {
            return generateHttpResponse(StatusCode.SERVER_ERROR, { message: err.message });
        };
    };
};