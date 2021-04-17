const http = require("http");
const fs = require("fs");
const url = require("url");
const replaceTemplate = require("./module/replaceTemplate");

const server = http.createServer((req, res) => {
	const laptopData = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`, "utf-8"));
	const pathName = url.parse(req.url, true).pathname;
	const id = url.parse(req.url, true).query.id;

	if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
		fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
			res.writeHead(200, { "content-type": "img/jpg" });
			res.end(data);
		});
	} else if (pathName === "/" || pathName === "/products") {
		res.writeHead(200, { "content-type": "text/html" });

		fs.readFile(`${__dirname}/templates/template-overview.html`, "utf-8", (err, data) => {
			let productOutput = data;

			// read through the card template
			fs.readFile(`${__dirname}/templates/template-card.html`, "utf-8", (err, cardData) => {
				//map through laptopdata
				const cardOutput = laptopData.map((el) => replaceTemplate(cardData, el)).join("");

				// insert card output to product output
				productOutput = productOutput.replace(/{%CARDS%}/g, cardOutput);
				res.end(productOutput);
			});
		});
	} else if (pathName === "/laptop" && id < laptopData.length) {
		res.writeHead(404, { "content-type": "text/html" }, "utf-8");
		fs.readFile(`${__dirname}/templates/template-laptop.html`, "utf-8", (err, data) => {
			let laptopOutput = replaceTemplate(data, laptopData[id]);
			res.end(laptopOutput);
		});
	} else {
		res.writeHead(404, { "content-type": "text/html" }, "utf-8");
		res.end("An error occured while trying to access that page");
	}
});

server.listen(1337, "127.0.0.1", () => {
	console.log("listening ...");
});
