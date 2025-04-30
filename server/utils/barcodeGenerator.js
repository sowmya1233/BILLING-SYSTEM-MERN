const bwipjs = require("bwip-js");

const generateBarcode = async (code) => {
  try {
    const barcodeImage = await bwipjs.toBuffer({
      bcid: "code128",       // Barcode type
      text: code,            // Text to encode
      scale: 3,              // 3x scaling factor
      height: 10,            // Bar height in mm
      includetext: true,     // Show human-readable text
      textxalign: "center",  // Center-align the text
    });

    return "data:image/png;base64," + barcodeImage.toString("base64");
  } catch (error) {
    throw new Error("Failed to generate barcode: " + error.message);
  }
};

module.exports = generateBarcode;
