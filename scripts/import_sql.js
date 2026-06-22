const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Product = require("../src/models/Product");

async function importSql() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/meesho";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const sqlFilePath = path.join(__dirname, "../75 live june 2026.sql");
    if (!fs.existsSync(sqlFilePath)) {
      console.error("SQL file not found at", sqlFilePath);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlFilePath, "utf-8");

    // We will extract the VALUES block for tbl_product
    const insertPrefix = "INSERT INTO `tbl_product` (`id`, `index`, `unique_name`, `name`, `is_show`, `category`, `color`, `size`, `storage`, `selling_price`, `mrp`, `fetaures`, `img1`, `img2`, `img3`, `img4`, `img5`, `from_csv`, `created_at`) VALUES\n";
    
    const startIndex = sqlContent.indexOf(insertPrefix);
    if (startIndex === -1) {
      console.error("Could not find tbl_product insert statement in SQL file.");
      process.exit(1);
    }

    // Extract the substring containing the values
    let valuesString = sqlContent.substring(startIndex + insertPrefix.length);
    // Find where the statement ends (semicolon)
    const endIndex = valuesString.indexOf(";");
    if (endIndex !== -1) {
      valuesString = valuesString.substring(0, endIndex);
    }

    // Splitting a raw SQL dump reliably is tough due to strings containing commas and parentheses.
    // However, as a basic one-off extraction, we can try matching tuples:
    // This regex looks for ( followed by digits, commas, strings etc, ending with )
    // A more robust way for one-off is splitting by newline if each tuple is on its own line.
    
    const lines = valuesString.split("\n");
    const productsToInsert = [];

    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;
      // remove trailing comma or semicolon
      if (line.endsWith(",")) line = line.slice(0, -1);
      if (line.endsWith(";")) line = line.slice(0, -1);
      
      // line should start with ( and end with )
      if (line.startsWith("(") && line.endsWith(")")) {
        const tupleContent = line.slice(1, -1);
        
        // We can do a rudimentary split by comma, respecting single quotes
        const cols = [];
        let inString = false;
        let current = "";
        
        for (let i = 0; i < tupleContent.length; i++) {
          const char = tupleContent[i];
          const nextChar = tupleContent[i+1];
          
          if (char === "'" && (i === 0 || tupleContent[i-1] !== '\\')) {
            inString = !inString;
          } else if (char === "," && !inString) {
            cols.push(current);
            current = "";
            continue;
          }
          current += char;
        }
        cols.push(current); // last column

        // Cleanup columns (trim and remove surrounding quotes)
        const cleanCols = cols.map(c => {
          let val = c.trim();
          if (val === "NULL") return null;
          if (val.startsWith("'") && val.endsWith("'")) {
            val = val.slice(1, -1);
            // unescape quotes
            val = val.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
          }
          return val;
        });

        // Mapping to Product schema
        // Expected columns: id, index, unique_name, name, is_show, category, color, size, storage, selling_price, mrp, fetaures, img1, img2, img3, img4, img5, from_csv, created_at
        if (cleanCols.length >= 19) {
          productsToInsert.push({
            name: cleanCols[3] || "Unnamed Product",
            price: Number(cleanCols[9]) || 0,
            originalPrice: Number(cleanCols[10]) || 0,
            image: cleanCols[12] || "",
            category: "General", // Could map cleanCols[5] if it matches Categories
            description: cleanCols[11] || "",
            sizes: cleanCols[7] ? [cleanCols[7]] : [],
            isPinned: false,
          });
        }
      }
    });

    console.log(`Parsed ${productsToInsert.length} products. Inserting into MongoDB...`);

    if (productsToInsert.length > 0) {
      await Product.insertMany(productsToInsert);
      console.log("Import successful.");
    } else {
      console.log("No valid products found to insert.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error during import:", error);
    process.exit(1);
  }
}

importSql();
