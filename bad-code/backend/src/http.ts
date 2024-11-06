import { Express } from "express";
import { copyS3Folder } from "./aws";
import express from "express";

export function initHttp(app: Express) {
    app.use(express.json());

    app.post("/project", async (req, res) => {
        // Hit a database to ensure this slug isn't taken already
        const { replId, language } = req.body;
        
        if (!replId) {
            res.status(400).send("Bad request");
            return;
        }

        // copy base code folder from S3 (base/${language} to code/${replId})
         console.log(language, replId);
         
        await copyS3Folder(`base/${language}`, `code/${replId}`);
        console.log('project created');
        res.send("Project created");
    });
}

