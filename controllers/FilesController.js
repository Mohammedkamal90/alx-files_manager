// Import necessary modules
import fs from 'fs';

// Define the controller class
class FilesController {
  // Method to upload a file
  static async uploadFile(req, res) {
    try {
      const { file } = req;

      // Check if file exists
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Extract file details
      const { originalname, mimetype, size, path } = file;

      // Perform file upload operations (e.g., save to database or filesystem)
      // Example: Save file to filesystem
      // fs.writeFileSync(`uploads/${originalname}`, fs.readFileSync(path));

      // Return success response
      return res.status(200).json({
        message: 'File uploaded successfully',
        fileInfo: { originalname, mimetype, size },
      });
    } catch (error) {
      // Handle errors
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method to download a file
  static async downloadFile(req, res) {
    try {
      const { fileName } = req.params;

      // Check if file exists
      if (!fs.existsSync(`uploads/${fileName}`)) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Serve the file for download
      res.download(`uploads/${fileName}`, fileName);
    } catch (error) {
      // Handle errors
      console.error('Error downloading file:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Export the controller class
export default FilesController;
