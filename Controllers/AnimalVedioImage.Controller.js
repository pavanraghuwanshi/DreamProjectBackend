import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import Video from "../Models/videoPath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadAnimalVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    const originalPath = req.file.path;
    const outputPath = path.join("Videos", `${Date.now()}_360p.mp4`);

    const command = `ffmpeg -i ${originalPath} -vf "scale=-2:360" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k ${outputPath}`;

    exec(command, async (error) => {
      if (error) {
        console.error("FFmpeg error:", error);
        return res.status(500).json({ message: "Error converting video" });
      }

      fs.unlinkSync(originalPath);

      const video = new Video({
        title: req.body.title || "Untitled Video",
        path: outputPath,
      });

      await video.save();

      res.status(201).json({
        message: "Video uploaded and converted to 360p",
        video,
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const streamVideoOfAnimal = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { part = 0 } = req.query; 

//     // Find video in DB
//     const video = await Video.findById(id);
//     if (!video) {
//       return res.status(404).json({ message: "Video not found" });
//     }

//     const videoPath = path.resolve(video.path);
//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;

//     const CHUNK_SIZE = 512 * 1024; // 512 KB per chunk (tune for internet speed)
//     const start = Number(part) * CHUNK_SIZE;
//     const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

//     if (start >= fileSize) {
//       return res.status(200).send("EOF"); // end of file
//     }

//     const contentLength = end - start + 1;
//     const headers = {
//       "Content-Length": contentLength,
//       "Content-Type": "video/mp4",
//     };

//     res.writeHead(200, headers);

//     const videoStream = fs.createReadStream(videoPath, { start, end });
//     videoStream.pipe(res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const streamVideoOfAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const videoPath = path.resolve(video.path);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    const range = req.headers.range;
    if (!range) {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes", // 🔹 add this here
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    } else {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, headers);
      fs.createReadStream(videoPath, { start, end }).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const streamVideoOfAnimal = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const video = await Video.findById(id);
//     if (!video) return res.status(404).json({ message: "Video not found" });

//     const videoPath = path.resolve(video.path);
//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;

//     const range = req.headers.range;
//     if (!range) {
//       const head = {
//         "Content-Length": fileSize,
//         "Content-Type": "video/mp4",
//       };
//       res.writeHead(200, head);
//       fs.createReadStream(videoPath).pipe(res);
//     } else {
//       const parts = range.replace(/bytes=/, "").split("-");
//       const start = parseInt(parts[0], 10);
//       const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//       const chunkSize = end - start + 1;

//       const headers = {
//         "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//         "Accept-Ranges": "bytes",
//         "Content-Length": chunkSize,
//         "Content-Type": "video/mp4",
//       };

//       res.writeHead(206, headers);
//       fs.createReadStream(videoPath, { start, end }).pipe(res);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };