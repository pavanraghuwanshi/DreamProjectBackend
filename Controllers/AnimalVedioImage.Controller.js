import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import Video from "../Models/videoPath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// export const uploadAnimalVideo = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No video uploaded" });
//     }

//     const originalPath = req.file.path;
//     const outputPath = path.join("Videos", `${Date.now()}_360p.mp4`);

//     const command = `ffmpeg -i ${originalPath} -vf "scale=-2:360" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k ${outputPath}`;

//     exec(command, async (error) => {
//       if (error) {
//         console.error("FFmpeg error:", error);
//         return res.status(500).json({ message: "Error converting video" });
//       }

//       fs.unlinkSync(originalPath);

//       const video = new Video({
//         title: req.body.title || "Untitled Video",
//         path: outputPath,
//       });

//       await video.save();

//       res.status(201).json({
//         message: "Video uploaded and converted to 360p",
//         video,
//       });
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const uploadAnimalVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    const { title, location } = req.body;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    let parsedLocation;
    try {
      parsedLocation = JSON.parse(location);
      if (
        !parsedLocation.type ||
        parsedLocation.type !== "Point" ||
        !Array.isArray(parsedLocation.coordinates) ||
        parsedLocation.coordinates.length !== 2
      ) {
        throw new Error("Invalid location format");
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const originalPath = req.file.path;
    const outputDir = path.join("Videos");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${Date.now()}_360p.mp4`);

    const command = `ffmpeg -i ${originalPath} -vf "scale=-2:360" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k ${outputPath}`;

    exec(command, async (error) => {
      if (error) {
        console.error("FFmpeg error:", error);
        return res.status(500).json({ message: "Error converting video" });
      }

      fs.unlinkSync(originalPath);

      const video = new Video({
        title: title || "Untitled Video",
        path: outputPath,
        location: parsedLocation, 
      });

      await video.save();

      return res.status(201).json({
        message: "Video uploaded and converted to 360p successfully",
        video,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

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




export const streamVideoOfAnimalsWithPagination = async (req, res) => {
  try {
    const { lat, lng, page = 1 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude (lat) and longitude (lng) are required.",
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const limit = 3;
    const skip = (Number(page) - 1) * limit;


    const videos = await Video.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 10000, // 10 km radius
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users", // collection name in MongoDB
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          path: 1,
          location: 1,
          distance: 1,
          userId: 1,
          userName: "$user.username",
          userMobile: "$user.mobileNo",
        },
      },
    ]);


    if (!videos.length) {
      return res
        .status(404)
        .json({ success: false, message: "No nearby videos found." });
    }

    // ✅ Total count for pagination metadata
    const totalCountAgg = await Video.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 10000,
        },
      },
      { $count: "total" },
    ]);

    const totalCount = totalCountAgg[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // ✅ Response
    return res.status(200).json({
      success: true,
      message: "Nearby videos fetched successfully",
      currentPage: Number(page),
      totalPages,
      totalCount,
      results: videos.length,
      videos,
    });
  } catch (err) {
    console.error("Error fetching nearby videos:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

