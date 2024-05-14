import { S3Event, S3EventRecord } from "aws-lambda";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import { Readable, Writable } from "stream";
import { pipeline }  from "stream/promises";

const s3 = new S3Client();

const handleRecord = async (record: S3EventRecord) => {
    const bucketName = record.s3.bucket.name;
    const key = record.s3.object.key;
    const s3Command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    const s3Object = await s3.send(s3Command);

    if (!s3Object.Body) {
        throw new Error("Object body does not exist");
    };

    if (!(s3Object.Body instanceof Readable)) {
        throw new Error("Object body is not Readable");
    };

    const stream = s3Object.Body;
    await pipeline(
        stream,
        csv(),
        new Writable({
            objectMode: true,
            write: (chunk, encoding, done) => {
                console.log(chunk);
                done();
            },
        })
    );

    const parsedKey = key.replace("uploaded", "parsed");
    
    try {
        await s3.send(new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `${bucketName}/${key}`,
            Key: parsedKey
        }));
    } catch (err) {
        console.error("Error copy object:", err);
        throw err;
    };

    try {
        await s3.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        }));
    } catch (err) {
        console.error("Error delete object:", err);
        throw err;
    };

};

export const importFileParser = async (event: S3Event) => {
    if (!event || !event.Records) {
        throw new Error("Event is not defined");
    };

    const promises = event.Records.map((record) => handleRecord(record));

    return Promise.allSettled(promises);
};
