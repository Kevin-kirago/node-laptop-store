const http = require("http");
const fs = require("fs");
const url = require("url");

// fetching data through fs and parsing it
const laptopData = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`, "utf-8"));

const server = http.createServer((req, res) => {
	const pathName = url.parse(req.url, true).pathname;
	const id = url.parse(req.url, true).query.id;

	if (pathName === "/" || pathName === "/products") {
		res.writeHead(200, { "content-type": "text/html" }, "utf-8");

		fs.readFile(`${__dirname}/templates/template-overview.html`, "utf-8", (err, data) => {
			let productPageOutput = data;

			fs.readFile(`${__dirname}/templates/template-card.html`, "utf-8", (err, data) => {
				// map the laptop data while replacing the cards template strings with data
				const cardOutput = laptopData.map((el) => replaceTemplate(data, el)).join("");

				// parse the card output into the productpageoutput
				productPageOutput = productPageOutput.replace("{%CARDS%}", cardOutput);

				// send the complete rendered overview product page output
				res.end(productPageOutput);
			});
		});
	} else if (pathName === "/laptop" && id < laptopData.length) {
		// access the template laptop file
		fs.readFile(`${__dirname}/templates/template-laptop.html`, "utf-8", (err, data) => {
			// Get laptop data based on url query id
			const laptop = laptopData[id];

			// parse data based on laptop data
			const laptopOutput = replaceTemplate(data, laptop);
			res.end(laptopOutput);
		});
	} else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
		console.log(pathName);
		fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
			res.writeHead(200, { "content-type": "img/jpg" });
			res.end(data);
		});
	} else {
		res.writeHead(404, { "content-type": "text/html" }, "utf-8");
		res.end("An error occured while trying access this page");
	}
});

server.listen(1337, "127.0.0.1", () => {
	console.log("Listening");
});

function replaceTemplate(originalHtml, laptop) {
	let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
	output = output.replace(/{%IMAGE%}/g, laptop.image);
	output = output.replace(/{%CPU%}/g, laptop.cpu);
	output = output.replace(/{%RAM%}/g, laptop.ram);
	output = output.replace(/{%STORAGE%}/g, laptop.storage);
	output = output.replace(/{%SCREEN%}/g, laptop.screen);
	output = output.replace(/{%PRICE%}/g, laptop.price);
	output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
	output = output.replace(/{%ID%}/g, laptop.id);

	return output;
}
