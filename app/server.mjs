import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
const port = process.env.PORT || 9000;

const app = express();
app.use(express.json());
app.use(cors());

// Route to handle the commit request
app.post("/commit", async (req, res) => {
  try {
    const { repoOwner, repoName, filePath, commitMessage, content } = req.body;

    // Create the file content
    const fileContent = Buffer.from(content).toString("base64");

    // Prepare the commit payload
    const commitPayload = {
      message: commitMessage,
      content: fileContent,
    };

    // Make the API call to GitHub
    const response = await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      commitPayload,
      {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          "Content-Type": "application/json",
          "User-Agent": "Your-App",
        },
      }
    );

    // Handle the response from GitHub
    if (response.status === 201) {
      res.json({ message: "File committed successfully." });
    } else {
      res.status(response.status).json({ message: "Failed to commit file." });
    }
  } catch (error) {
    console.error("Error committing file:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server listening on port %d", port);
});
