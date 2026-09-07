import fs from "node:fs";

const fileName = "example.txt";

// CREATE FILE
fs.writeFile(fileName, "Hello! This is my first Node.js file.", (err) => {

    if (err) {
        console.log("Error creating file:", err.message);
        return;
    }

    console.log("File created successfully.");

    // READ FILE
    fs.readFile(fileName, "utf8", (err, data) => {

        if (err) {
            console.log("Error reading file:", err.message);
            return;
        }

        console.log("File content:");
        console.log(data);

        // UPDATE FILE
        fs.appendFile(
            fileName,
            "\nThis line was added using appendFile().",
            (err) => {

                if (err) {
                    console.log("Error updating file:", err.message);
                    return;
                }

                console.log("File updated successfully.");

                // READ UPDATED FILE
                fs.readFile(fileName, "utf8", (err, updatedData) => {

                    if (err) {
                        console.log(
                            "Error reading updated file:",
                            err.message
                        );
                        return;
                    }

                    console.log("Updated content:");
                    console.log(updatedData);

                    // DELETE FILE
                    fs.unlink(fileName, (err) => {

                        if (err) {
                            console.log(
                                "Error deleting file:",
                                err.message
                            );
                            return;
                        }

                        console.log("File deleted successfully.");
                    });
                });
            }
        );
    });
});