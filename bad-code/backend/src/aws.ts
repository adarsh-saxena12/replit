import { S3 } from "aws-sdk"
import fs from "fs";
import path from "path";

// const s3 = new S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     endpoint: process.env.S3_ENDPOINT
// })
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION ?? 'eu-north-1', // Set region explicitly
});
export const fetchS3Folder = async (key: string, localPath: string): Promise<void> => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET ?? "",
            Prefix: key
        };

        const response = await s3.listObjectsV2(params).promise();

        if (response.Contents) {
            // Use Promise.all to run getObject operations in parallel
            await Promise.all(response.Contents.map(async (file) => {
                const fileKey = file.Key;
                if (fileKey) {
                    const getObjectParams = {
                        Bucket: process.env.S3_BUCKET ?? "",
                        Key: fileKey
                    };

                    const data = await s3.getObject(getObjectParams).promise();
                    console.log('Fetched file from S3:', fileKey);
                    
                    if (data.Body) {
                        // const fileData = data.Body;
                          // Handle different types of data.Body
                          let fileData: Buffer;

                          if (Buffer.isBuffer(data.Body)) {
                              fileData = data.Body;
                          } else if (typeof data.Body === 'string') {
                              fileData = Buffer.from(data.Body); // Convert string to Buffer
                          } else {
                              // If data.Body is a Uint8Array, directly convert it
                              fileData = Buffer.from(data.Body as Uint8Array);
                          }

                        // const filePath = `${localPath}/${fileKey.replace(key, "")}`;
                        
                        const relativePath = fileKey.replace(key, ""); // Path relative to the key
                        const filePath = path.join(localPath, relativePath); // Full path to save locally

                        console.log('Saving to local path:', filePath); // Log file path

                        await writeFile(filePath, fileData);
                         
                         
                        console.log(`Downloaded ${fileKey} to ${filePath}`);
                    }
                }
            }));
        }
    } catch (error) {
        // this is happening
        console.error('Error fetching folder:', error);
    }
};

export async function copyS3Folder(
    sourcePrefix: string, 
    destinationPrefix: string, 
    continuationToken?: string): Promise<void> {
    try {
        // List all objects in the source folder
        const listParams = {
            Bucket: process.env.S3_BUCKET ?? "",
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();
        
        console.log('source:', sourcePrefix);
        console.log('destination:', destinationPrefix);
        
        console.log('listObject', listedObjects);
        
        if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;
        
        // Copy each object to the new location
        await Promise.all(listedObjects.Contents.map(async (object) => {
            if (!object.Key) return;
            let destinationKey = object.Key.replace(sourcePrefix, destinationPrefix);
            let copyParams = {
                Bucket: process.env.S3_BUCKET ?? "",
                CopySource: `${process.env.S3_BUCKET}/${object.Key}`,
                Key: destinationKey
            };
            console.log(copyParams);
            
            console.log(object);
            
            // let copyParams = {
            //     Bucket: process.env.S3_BUCKET ?? "",
            //     CopySource: encodeURIComponent(`${process.env.S3_BUCKET}/${object.Key}`),
            //     Key: destinationKey
            // };

            // console.log('copyS3Folders', copyParams);
            console.log('Copying file:', copyParams);

            // await s3.copyObject(copyParams).promise();
            // console.log(`Copied ${object.Key} to ${destinationKey}`);
            try {
                await s3.copyObject(copyParams).promise();
                console.log(`Copied ${object.Key} to ${destinationKey}`);
            } catch (copyError) {
                console.error(`Failed to copy ${object.Key}:`, copyError);
            }
        }));

        // Check if the list was truncated and continue copying if necessary
        if (listedObjects.IsTruncated) {
            listParams.ContinuationToken = listedObjects.NextContinuationToken;
            // await copyS3Folder(sourcePrefix, destinationPrefix, continuationToken);
            await copyS3Folder(sourcePrefix, destinationPrefix, listedObjects.NextContinuationToken);
            
        }

    } catch (error) {
        console.error('Error copying folder:', error);
    }
}

// Helper function to create folder
// function writeFile(filePath: string, fileData: Buffer): Promise<void> {
//     return new Promise(async (resolve, reject) => {
//         await createFolder(path.dirname(filePath));

//          console.log(path.dirname(filePath));
         
//         fs.writeFile(filePath, fileData, (err) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve()
//             }
//         })
//     });
// }


function writeFile(filePath: string, fileData: Buffer): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            // Ensure the directory exists
 
            await createFolder(path.dirname(filePath));

            // Log the file path and size of the data being written
            console.log(`Writing file to path: ${filePath}, size: ${fileData.length}`);

            // Write the file
            fs.writeFile(filePath, fileData, (err) => {
                if (err) {
                    console.error(`Error writing file ${filePath}:`, err);
                    return reject(err);
                }
                console.log(`Successfully wrote file: ${filePath}`);
                resolve();
            });
        } catch (error) {
            console.error('Error in writeFile:', error);
            reject(error);
        }
    });
}


function createFolder(dirName: string) {
    console.log('dirname', dirName);
    
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        });
    })
}

export const saveToS3 = async (key: string, filePath: string, content: string): Promise<void> => {
    const params = {
        Bucket: process.env.S3_BUCKET ?? "",
        Key: `${key}${filePath}`,
        Body: content
    }

    await s3.putObject(params).promise()
}







