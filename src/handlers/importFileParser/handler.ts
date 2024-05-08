import { S3Event } from "aws-lambda";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import csv from "csv-parser";
import { Readable } from "stream";

const s3 = new S3Client();

export const importFileParser = async (event: S3Event) => {
  if (!event || !event.Records) {
    throw new Error('Event is not defined');
  };

  const promises = event.Records.map(async (record) => {
    try {
      const bucketName = record.s3.bucket.name;
      const key = record.s3.object.key;
      const s3Command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      const s3Object = await s3.send(s3Command);

      if (!s3Object.Body) {
        throw new Error('Object body does not exist');
      };

      const stream = (s3Object.Body as Readable).pipe(csv())
        .on('data', (data) => {
          console.log(data);
        })
        .on('error', (err) => {
          console.error(err);
          throw new Error(err.message);
        });

      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      const parsedKey = key.replace('uploaded', 'parsed');
      
      try {
        await s3.send(new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: `${bucketName}/${key}`,
          Key: parsedKey
        }));
      } catch (err) {
        console.error("Error copy object:", err);
      };

      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key
        }));
      } catch (err) {
        console.error("Error delete object:", err);
      };
      
    } catch (err) {
      console.error(err);
    };
  });

  return Promise.all(promises);
};
