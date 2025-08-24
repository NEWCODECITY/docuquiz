const fs = require('fs');
const pdfParse = require('pdf-parse');

exports.handlePDFUpload = async (req, res) => {
  const filePath = req.file.path;
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    // Later: Send this to OpenAI API
    res.json({ text: data.text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse PDF' });
  } finally {
    fs.unlinkSync(filePath);
  }
};
